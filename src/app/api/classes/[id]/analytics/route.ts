// EMSI Flow - Class Analytics API Routes
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { calculateStudentRisk } from '@/services/risk-engine';

// GET /api/classes/[id]/analytics - Get class analytics
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const classData = await prisma.class.findUnique({
      where: { id },
      include: {
        students: {
          include: {
            grades: { include: { subject: true } },
            attendance: true
          }
        },
        subjects: {
          include: {
            grades: true
          }
        }
      }
    });
    
    if (!classData) {
      return NextResponse.json(
        { error: 'Class not found' },
        { status: 404 }
      );
    }
    
    // Calculate student risk distribution
    const riskData = await Promise.all(
      classData.students.map(async (student) => {
        const risk = await calculateStudentRisk(student.id);
        return { studentId: student.id, studentName: student.name, ...risk };
      })
    );
    
    // Calculate subject performance
    const subjectPerformance = classData.subjects.map(subject => {
      const subjectGrades = subject.grades;
      const average = subjectGrades.length > 0
        ? subjectGrades.reduce((acc, g) => acc + (g.value / g.maxValue) * 20, 0) / subjectGrades.length
        : null;
      return {
        subjectId: subject.id,
        subjectName: subject.name,
        subjectCode: subject.code,
        averageGrade: average ? Math.round(average * 10) / 10 : null,
        totalGrades: subjectGrades.length
      };
    });
    
    // Risk distribution
    const riskDistribution = {
      low: riskData.filter(r => r.level === 'LOW').length,
      medium: riskData.filter(r => r.level === 'MEDIUM').length,
      high: riskData.filter(r => r.level === 'HIGH').length
    };
    
    // Calculate overall class average
    const allGrades = classData.students.flatMap(s => s.grades);
    const classAverage = allGrades.length > 0
      ? allGrades.reduce((acc, g) => acc + (g.value / g.maxValue) * 20, 0) / allGrades.length
      : null;
    
    // Calculate overall attendance
    const allAttendance = classData.students.flatMap(s => s.attendance);
    const presentCount = allAttendance.filter(a => a.status === 'present' || a.status === 'excused').length;
    const classAttendanceRate = allAttendance.length > 0
      ? (presentCount / allAttendance.length) * 100
      : null;
    
    return NextResponse.json({
      classId: classData.id,
      className: classData.name,
      classCode: classData.code,
      totalStudents: classData.students.length,
      riskDistribution,
      riskData,
      subjectPerformance,
      classAverage: classAverage ? Math.round(classAverage * 10) / 10 : null,
      classAttendanceRate: classAttendanceRate ? Math.round(classAttendanceRate * 10) / 10 : null
    });
  } catch (error) {
    console.error('Error fetching class analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch class analytics' },
      { status: 500 }
    );
  }
}
