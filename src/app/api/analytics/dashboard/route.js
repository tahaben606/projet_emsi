// EMSI Flow - Dashboard Analytics API Routes
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { calculateStudentRisk } from '@/services/risk-engine';

// GET /api/analytics/dashboard - Get overall institutional dashboard data
export async function GET(request) {
  try {
    // Get all students with their class info
    const students = await prisma.student.findMany({
      include: {
        class: true,
        grades: true,
        attendance: true
      }
    });
    
    // Get all classes
    const classes = await prisma.class.findMany({
      include: {
        students: { select: { id: true } }
      }
    });
    
    // Calculate risk for all students
    const riskCalculations = await Promise.all(
      students.map(async (student) => ({
        studentId: student.id,
        studentName: student.name,
        classId: student.classId,
        className: student.class.name,
        ...(await calculateStudentRisk(student.id))
      }))
    );
    
    // Count by risk level
    const highRiskCount = riskCalculations.filter(r => r.level === 'HIGH').length;
    const mediumRiskCount = riskCalculations.filter(r => r.level === 'MEDIUM').length;
    const lowRiskCount = riskCalculations.filter(r => r.level === 'LOW').length;
    
    // Calculate average stability (percentage of low-risk students)
    const averageStability = students.length > 0
      ? (lowRiskCount / students.length) * 100
      : 0;
    
    // Get recent alerts (students with high risk)
    const recentAlerts = riskCalculations
      .filter(r => r.level === 'HIGH')
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map(r => ({
        studentId: r.studentId,
        studentName: r.studentName,
        className: r.className,
        riskScore: r.score,
        riskLevel: r.level,
        factors: r.factors,
        recommendations: r.recommendations
      }));
    
    // Calculate class analytics
    const classAnalytics = await Promise.all(
      classes.map(async (cls) => {
        const classStudents = riskCalculations.filter(r => r.classId === cls.id);
        const classHighRisk = classStudents.filter(r => r.level === 'HIGH').length;
        const classLowRisk = classStudents.filter(r => r.level === 'LOW').length;
        const avgRiskScore = classStudents.length > 0
          ? classStudents.reduce((acc, s) => acc + s.score, 0) / classStudents.length
          : 0;
        const stabilityPercentage = classStudents.length > 0
          ? (classLowRisk / classStudents.length) * 100
          : 0;
        
        return {
          classId: cls.id,
          className: cls.name,
          classCode: cls.code,
          totalStudents: cls.students.length,
          averageRiskScore: Math.round(avgRiskScore * 10) / 10,
          stabilityPercentage: Math.round(stabilityPercentage * 10) / 10,
          highRiskCount: classHighRisk,
          mediumRiskCount: classStudents.filter(r => r.level === 'MEDIUM').length,
          lowRiskCount: classLowRisk
        };
      })
    );
    
    // Overall statistics
    const totalGrades = students.reduce((acc, s) => acc + s.grades.length, 0);
    const averageGrade = totalGrades > 0
      ? students.flatMap(s => s.grades)
          .reduce((acc, g) => acc + (g.value / g.maxValue) * 20, 0) / totalGrades
      : null;
    
    const totalAttendance = students.reduce((acc, s) => acc + s.attendance.length, 0);
    const presentCount = students.flatMap(s => s.attendance)
      .filter(a => a.status === 'present' || a.status === 'excused').length;
    const averageAttendance = totalAttendance > 0
      ? (presentCount / totalAttendance) * 100
      : null;
    
    return NextResponse.json({
      totalStudents: students.length,
      totalClasses: classes.length,
      highRiskCount,
      mediumRiskCount,
      lowRiskCount,
      averageStability: Math.round(averageStability * 10) / 10,
      alertsToday: highRiskCount,
      averageGrade: averageGrade ? Math.round(averageGrade * 10) / 10 : null,
      averageAttendance: averageAttendance ? Math.round(averageAttendance * 10) / 10 : null,
      recentAlerts,
      classAnalytics,
      riskDistribution: {
        low: lowRiskCount,
        medium: mediumRiskCount,
        high: highRiskCount
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard analytics' },
      { status: 500 }
    );
  }
}
