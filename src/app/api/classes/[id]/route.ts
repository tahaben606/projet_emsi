// EMSI Flow - Single Class API Routes
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { calculateStudentRisk } from '@/services/risk-engine';

// GET /api/classes/[id] - Get class details with student risk breakdown
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
        subjects: true
      }
    });
    
    if (!classData) {
      return NextResponse.json(
        { error: 'Class not found' },
        { status: 404 }
      );
    }
    
    // Calculate risk for each student
    const studentsWithRisk = await Promise.all(
      classData.students.map(async (student) => {
        const risk = await calculateStudentRisk(student.id);
        const gradeAvg = student.grades.length > 0
          ? student.grades.reduce((acc, g) => acc + (g.value / g.maxValue) * 20, 0) / student.grades.length
          : null;
        const presentCount = student.attendance.filter(a => a.status === 'present' || a.status === 'excused').length;
        const attendanceRate = student.attendance.length > 0
          ? (presentCount / student.attendance.length) * 100
          : null;
        
        return {
          id: student.id,
          name: student.name,
          email: student.email,
          riskScore: risk.score,
          riskLevel: risk.level,
          gradeAverage: gradeAvg,
          attendanceRate
        };
      })
    );
    
    // Calculate class-level statistics
    const totalStudents = studentsWithRisk.length;
    const highRiskCount = studentsWithRisk.filter(s => s.riskLevel === 'HIGH').length;
    const mediumRiskCount = studentsWithRisk.filter(s => s.riskLevel === 'MEDIUM').length;
    const lowRiskCount = studentsWithRisk.filter(s => s.riskLevel === 'LOW').length;
    const averageRiskScore = totalStudents > 0
      ? studentsWithRisk.reduce((acc, s) => acc + s.riskScore, 0) / totalStudents
      : 0;
    const stabilityPercentage = totalStudents > 0
      ? (lowRiskCount / totalStudents) * 100
      : 0;
    
    return NextResponse.json({
      ...classData,
      students: studentsWithRisk,
      analytics: {
        totalStudents,
        highRiskCount,
        mediumRiskCount,
        lowRiskCount,
        averageRiskScore: Math.round(averageRiskScore * 10) / 10,
        stabilityPercentage: Math.round(stabilityPercentage * 10) / 10
      }
    });
  } catch (error) {
    console.error('Error fetching class:', error);
    return NextResponse.json(
      { error: 'Failed to fetch class' },
      { status: 500 }
    );
  }
}
