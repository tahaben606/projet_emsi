// EMSI Flow - Single Student API Routes
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { calculateStudentRisk } from '@/services/risk-engine';

// GET /api/students/[id] - Get student details with risk calculation
export async function GET(
  request,
  { params }
) {
  try {
    const { id } = await params;
    
    const student = await prisma.student.findUnique({
      where: { id },
      include: {
        class: {
          include: { subjects: true }
        },
        grades: {
          include: { subject: true },
          orderBy: { date: 'desc' }
        },
        attendance: {
          include: { subject: true },
          orderBy: { date: 'desc' },
          take: 30
        }
      }
    });
    
    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }
    
    // Calculate risk
    const riskCalculation = await calculateStudentRisk(id);
    
    // Calculate grade statistics
    const grades = student.grades;
    const gradeAverage = grades.length > 0
      ? grades.reduce((acc, g) => acc + (g.value / g.maxValue) * 20, 0) / grades.length
      : null;
    
    // Calculate attendance statistics
    const attendance = student.attendance;
    const presentCount = attendance.filter(a => a.status === 'present').length;
    const absentCount = attendance.filter(a => a.status === 'absent').length;
    const lateCount = attendance.filter(a => a.status === 'late').length;
    const attendanceRate = attendance.length > 0
      ? (presentCount / attendance.length) * 100
      : null;
    
    return NextResponse.json({
      ...student,
      risk: riskCalculation,
      stats: {
        gradeAverage,
        attendanceRate,
        presentCount,
        absentCount,
        lateCount,
        totalGrades: grades.length
      }
    });
  } catch (error) {
    console.error('Error fetching student:', error);
    return NextResponse.json(
      { error: 'Failed to fetch student' },
      { status: 500 }
    );
  }
}
