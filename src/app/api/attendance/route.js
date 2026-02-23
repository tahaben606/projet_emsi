// EMSI Flow - Attendance Management API
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Fetch attendance by class and date
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const classId = searchParams.get('classId');
    const date = searchParams.get('date');
    const subjectId = searchParams.get('subjectId');

    if (!classId) {
      return NextResponse.json({ error: 'Class ID is required' }, { status: 400 });
    }

    // Get all students in the class
    const students = await prisma.student.findMany({
      where: { classId },
      include: {
        class: true,
      },
      orderBy: { name: 'asc' }
    });

    // If date provided, get attendance for that date
    let attendanceRecords = [];
    if (date) {
      const targetDate = new Date(date);
      const startOfDay = new Date(targetDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(targetDate);
      endOfDay.setHours(23, 59, 59, 999);

      const whereClause = {
        date: {
          gte: startOfDay,
          lte: endOfDay
        },
        student: { classId }
      };

      if (subjectId) {
        whereClause.subjectId = subjectId;
      }

      attendanceRecords = await prisma.attendance.findMany({
        where: whereClause,
        include: {
          student: true,
          subject: true
        }
      });
    }

    // Get subjects for the class
    const subjects = await prisma.subject.findMany({
      where: { classId },
      orderBy: { name: 'asc' }
    });

    // Combine students with their attendance status
    const studentsWithAttendance = students.map(student => {
      const record = attendanceRecords.find(r => r.studentId === student.id);
      return {
        ...student,
        attendanceStatus: record?.status || null,
        attendanceId: record?.id || null,
        subjectId: record?.subjectId || null
      };
    });

    return NextResponse.json({
      students: studentsWithAttendance,
      subjects,
      date: date || new Date().toISOString().split('T')[0],
      recordsCount: attendanceRecords.length
    });
  } catch (error) {
    console.error('Error fetching attendance:', error);
    return NextResponse.json({ error: 'Failed to fetch attendance' }, { status: 500 });
  }
}

// POST - Mark attendance for students
export async function POST(request) {
  try {
    const body = await request.json();
    const { classId, date, subjectId, attendanceData } = body;

    // attendanceData is an array of { studentId, status }
    // status: "present", "absent", "late", "excused"

    if (!classId || !date || !subjectId || !attendanceData) {
      return NextResponse.json({ 
        error: 'Class ID, date, subject ID, and attendance data are required' 
      }, { status: 400 });
    }

    const targetDate = new Date(date);
    const results = [];

    for (const item of attendanceData) {
      const { studentId, status } = item;

      // Use upsert to create or update attendance record
      const record = await prisma.attendance.upsert({
        where: {
          studentId_subjectId_date: {
            studentId,
            subjectId,
            date: targetDate
          }
        },
        update: {
          status
        },
        create: {
          studentId,
          subjectId,
          date: targetDate,
          status
        }
      });

      results.push(record);
    }

    return NextResponse.json({
      success: true,
      message: `Marked attendance for ${results.length} students`,
      records: results
    });
  } catch (error) {
    console.error('Error marking attendance:', error);
    return NextResponse.json({ error: 'Failed to mark attendance' }, { status: 500 });
  }
}

// PUT - Update single attendance record
export async function PUT(request) {
  try {
    const body = await request.json();
    const { attendanceId, status } = body;

    if (!attendanceId || !status) {
      return NextResponse.json({ 
        error: 'Attendance ID and status are required' 
      }, { status: 400 });
    }

    const record = await prisma.attendance.update({
      where: { id: attendanceId },
      data: { status }
    });

    return NextResponse.json({ success: true, record });
  } catch (error) {
    console.error('Error updating attendance:', error);
    return NextResponse.json({ error: 'Failed to update attendance' }, { status: 500 });
  }
}
