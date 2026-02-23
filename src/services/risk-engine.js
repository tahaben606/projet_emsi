// EMSI Flow - Risk Engine Service
// Deterministic, rule-based academic risk calculation

import { prisma } from '@/lib/db';

// Risk weights configuration
const RISK_WEIGHTS = {
  gradeAverage: 0.30,      // 30% - Overall grade performance
  attendanceRate: 0.25,    // 25% - Attendance rate
  gradeVolatility: 0.20,   // 20% - Consistency of grades
  recentTrend: 0.25,       // 25% - Recent performance trend
};

// Thresholds for risk calculation
const THRESHOLDS = {
  gradeRisk: {
    low: 12,      // Above 12/20 = low risk
    medium: 10,   // 10-12/20 = medium risk
    high: 10,     // Below 10/20 = high risk
  },
  attendanceRisk: {
    low: 90,      // Above 90% = low risk
    medium: 75,   // 75-90% = medium risk
    high: 75,     // Below 75% = high risk
  },
};

/**
 * Calculate risk score from a value (0-100 scale, higher = more risk)
 */
function calculateRiskComponent(value, max, thresholds) {
  const percentage = (value / max) * 100;
  
  if (percentage >= thresholds.low) return Math.max(0, 30 - (percentage - thresholds.low));
  if (percentage >= thresholds.medium) return 30 + (thresholds.low - percentage) * 2;
  return 60 + (thresholds.medium - percentage) * 1.5;
}

/**
 * Calculate grade volatility (standard deviation)
 */
function calculateVolatility(grades) {
  if (grades.length < 2) return 0;
  
  const normalizedGrades = grades.map(g => (g.value / g.maxValue) * 20);
  const mean = normalizedGrades.reduce((a, b) => a + b, 0) / normalizedGrades.length;
  const variance = normalizedGrades.reduce((acc, g) => acc + Math.pow(g - mean, 2), 0) / normalizedGrades.length;
  const stdDev = Math.sqrt(variance);
  
  // Higher volatility = higher risk (scaled 0-100)
  return Math.min(100, stdDev * 10);
}

/**
 * Calculate recent performance trend
 * Returns a value 0-100 where higher = declining/worse trend
 */
function calculateRecentTrend(grades) {
  if (grades.length < 3) return 30; // Not enough data, assume moderate risk
  
  const sortedGrades = [...grades].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const normalizedGrades = sortedGrades.map(g => (g.value / g.maxValue) * 20);
  
  // Compare first half vs second half performance
  const midPoint = Math.floor(normalizedGrades.length / 2);
  const firstHalfAvg = normalizedGrades.slice(0, midPoint).reduce((a, b) => a + b, 0) / midPoint;
  const secondHalfAvg = normalizedGrades.slice(midPoint).reduce((a, b) => a + b, 0) / (normalizedGrades.length - midPoint);
  
  // Calculate trend (negative = declining = higher risk)
  const trendDiff = firstHalfAvg - secondHalfAvg;
  
  if (trendDiff > 2) return 70; // Declining significantly
  if (trendDiff > 0.5) return 50; // Slight decline
  if (trendDiff > -0.5) return 30; // Stable
  return 10; // Improving
}

/**
 * Determine risk level from score
 */
function getRiskLevel(score) {
  if (score <= 30) return 'LOW';
  if (score <= 60) return 'MEDIUM';
  return 'HIGH';
}

/**
 * Generate recommendations based on risk factors
 */
function generateRecommendations(factors, riskLevel) {
  const recommendations = [];
  
  // Grade-based recommendations
  const gradeFactor = factors.find(f => f.name === 'Grade Average');
  if (gradeFactor && gradeFactor.contribution > 20) {
    recommendations.push('Schedule a meeting with academic advisor to discuss study strategies');
    recommendations.push('Consider forming study groups with classmates');
    if (gradeFactor.value < 10) {
      recommendations.push('Explore tutoring resources available at the academic support center');
    }
  }
  
  // Attendance-based recommendations
  const attendanceFactor = factors.find(f => f.name === 'Attendance');
  if (attendanceFactor && attendanceFactor.contribution > 15) {
    recommendations.push('Improve class attendance - each session contains important material');
    recommendations.push('Set up reminders for class schedules');
  }
  
  // Volatility-based recommendations
  const volatilityFactor = factors.find(f => f.name === 'Grade Consistency');
  if (volatilityFactor && volatilityFactor.contribution > 15) {
    recommendations.push('Focus on consistent preparation across all assessments');
    recommendations.push('Review study schedule to ensure balanced preparation');
  }
  
  // Trend-based recommendations
  const trendFactor = factors.find(f => f.name === 'Recent Trend');
  if (trendFactor && trendFactor.contribution > 15) {
    recommendations.push('Address recent performance decline immediately');
    recommendations.push('Identify and address any personal or academic challenges');
  }
  
  // Risk-level specific recommendations
  if (riskLevel === 'HIGH') {
    recommendations.unshift('URGENT: Schedule immediate meeting with academic advisor');
    recommendations.push('Consider reduced course load or academic support programs');
  } else if (riskLevel === 'MEDIUM') {
    recommendations.push('Regular check-ins with academic advisor recommended');
  }
  
  return recommendations.length > 0 ? recommendations : ['Continue current academic performance'];
}

/**
 * Main risk calculation function for a student
 */
export async function calculateStudentRisk(studentId) {
  // Fetch student data
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: {
      grades: {
        include: { subject: true },
        orderBy: { date: 'asc' }
      },
      attendance: true,
      class: {
        include: { subjects: true }
      }
    }
  });
  
  if (!student) {
    throw new Error('Student not found');
  }
  
  // Calculate grade average
  const grades = student.grades;
  const gradeAverage = grades.length > 0
    ? grades.reduce((acc, g) => acc + (g.value / g.maxValue) * 20, 0) / grades.length
    : 10; // Default to middle if no grades
  
  // Calculate attendance rate
  const attendance = student.attendance;
  const presentCount = attendance.filter(a => a.status === 'present' || a.status === 'excused').length;
  const attendanceRate = attendance.length > 0
    ? (presentCount / attendance.length) * 100
    : 90; // Default to good if no attendance records
  
  // Calculate volatility
  const volatility = calculateVolatility(grades.map(g => ({ value: g.value, maxValue: g.maxValue })));
  
  // Calculate recent trend
  const recentTrend = calculateRecentTrend(grades.map(g => ({ 
    value: g.value, 
    maxValue: g.maxValue, 
    date: g.date 
  })));
  
  // Build risk factors
  const factors = [
    {
      name: 'Grade Average',
      value: gradeAverage,
      weight: RISK_WEIGHTS.gradeAverage,
      contribution: calculateRiskComponent(gradeAverage, 20, THRESHOLDS.gradeRisk) * RISK_WEIGHTS.gradeAverage,
      description: gradeAverage >= 12 ? 'Good academic performance' : 
                   gradeAverage >= 10 ? 'Average academic performance' : 
                   'Below average academic performance'
    },
    {
      name: 'Attendance',
      value: attendanceRate,
      weight: RISK_WEIGHTS.attendanceRate,
      contribution: calculateRiskComponent(attendanceRate, 100, THRESHOLDS.attendanceRisk) * RISK_WEIGHTS.attendanceRate,
      description: attendanceRate >= 90 ? 'Excellent attendance' :
                   attendanceRate >= 75 ? 'Acceptable attendance' :
                   'Poor attendance requires attention'
    },
    {
      name: 'Grade Consistency',
      value: 100 - volatility, // Invert so higher is better
      weight: RISK_WEIGHTS.gradeVolatility,
      contribution: volatility * RISK_WEIGHTS.gradeVolatility,
      description: volatility < 20 ? 'Consistent performance across subjects' :
                   volatility < 40 ? 'Some variation in performance' :
                   'Inconsistent performance needs attention'
    },
    {
      name: 'Recent Trend',
      value: 100 - recentTrend, // Invert so higher is better
      weight: RISK_WEIGHTS.recentTrend,
      contribution: recentTrend * RISK_WEIGHTS.recentTrend,
      description: recentTrend < 30 ? 'Performance is improving' :
                   recentTrend < 50 ? 'Stable performance' :
                   recentTrend < 70 ? 'Slight decline in recent performance' :
                   'Significant decline in recent performance'
    }
  ];
  
  // Calculate total risk score
  const totalRiskScore = Math.min(100, Math.max(0, 
    factors.reduce((acc, f) => acc + f.contribution, 0)
  ));
  
  const riskLevel = getRiskLevel(totalRiskScore);
  const recommendations = generateRecommendations(factors, riskLevel);
  
  return {
    score: Math.round(totalRiskScore * 10) / 10,
    level: riskLevel,
    factors,
    recommendations
  };
}

/**
 * Calculate risk for all students in a class
 */
export async function calculateClassRisk(classId) {
  const students = await prisma.student.findMany({
    where: { classId }
  });
  
  const riskCalculations = await Promise.all(
    students.map(async (student) => ({
      studentId: student.id,
      studentName: student.name,
      ...(await calculateStudentRisk(student.id))
    }))
  );
  
  return riskCalculations;
}

/**
 * Get overall risk summary for dashboard
 */
export async function getOverallRiskSummary() {
  const students = await prisma.student.findMany();
  
  const riskData = await Promise.all(
    students.map(async (student) => ({
      studentId: student.id,
      classId: student.classId,
      ...(await calculateStudentRisk(student.id))
    }))
  );
  
  const summary = {
    total: students.length,
    low: riskData.filter(r => r.level === 'LOW').length,
    medium: riskData.filter(r => r.level === 'MEDIUM').length,
    high: riskData.filter(r => r.level === 'HIGH').length,
    averageScore: riskData.reduce((acc, r) => acc + r.score, 0) / riskData.length,
    details: riskData
  };
  
  return summary;
}
