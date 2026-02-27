// EMSI Flow - Context-Aware Planner Service
// Generates actionable daily recommendations based on student context

import OpenAI from 'openai';
import { prisma } from '@/lib/db';
import { calculateStudentRisk } from './risk-engine';

// Initialize Groq AI
const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
});

async function callGroq(messages, options = {}) {
  const { temperature = 0.4, maxOutputTokens = 600 } = options;
  try {
    const completion = await openai.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: messages,
      temperature: temperature,
      max_tokens: maxOutputTokens,
    });
    return completion;
  } catch (error) {
    console.error(`❌ Groq API error:`, error.message || error);
    throw error;
  }
}

/**
 * Get student context for planning
 */
async function getStudentContext(studentId) {
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: {
      class: true,
      grades: {
        include: { subject: true },
        orderBy: { date: 'desc' },
        take: 10
      },
      attendance: true
    }
  });

  if (!student) {
    throw new Error('Student not found');
  }

  // Calculate attendance rate
  const presentCount = student.attendance.filter(a => a.status === 'present' || a.status === 'excused').length;
  const attendanceRate = student.attendance.length > 0
    ? (presentCount / student.attendance.length) * 100
    : 100;

  // Get risk calculation
  const riskCalc = await calculateStudentRisk(studentId);

  // Mock upcoming events (in production, this would come from a calendar system)
  const upcomingEvents = [
    { title: 'Midterm Exams Begin', date: 'In 2 weeks' },
    { title: 'Course Withdrawal Deadline', date: 'In 3 weeks' },
    { title: 'Fall Break', date: 'In 4 weeks' }
  ];

  return {
    studentId: student.id,
    name: student.name,
    className: student.class.name,
    riskScore: riskCalc.score,
    riskLevel: riskCalc.level,
    recentGrades: student.grades.map(g => ({
      subject: g.subject.name,
      value: g.value,
      maxValue: g.maxValue,
      date: g.date
    })),
    attendanceRate,
    upcomingEvents
  };
}

/**
 * Generate AI-powered recommendations
 */
export async function generateRecommendations(studentId) {
  try {
    const context = await getStudentContext(studentId);


    const prompt = `You are an academic advisor AI assistant. Based on the following student context, generate 3-5 actionable daily recommendations.

Student: ${context.name}
Class: ${context.className}
Risk Score: ${context.riskScore}/100 (${context.riskLevel} RISK)
Attendance Rate: ${context.attendanceRate.toFixed(1)}%

Recent Grades:
${context.recentGrades.map(g => `- ${g.subject}: ${g.value}/${g.maxValue}`).join('\n')}

Upcoming Events:
${context.upcomingEvents.map(e => `- ${e.title}: ${e.date}`).join('\n')}

Generate recommendations in this exact JSON format (no markdown, just raw JSON):
[
  {
    "priority": "high|medium|low",
    "action": "Specific action to take",
    "reason": "Why this is important",
    "deadline": "Optional deadline or timeframe",
    "resources": ["Optional list of resources"]
  }
]`;

    const completion = await callGroq([
      {
        role: 'system',
        content: 'You are an academic advisor assistant that generates helpful, specific recommendations for students. Always respond with valid JSON only.'
      },
      {
        role: 'user',
        content: prompt
      }
    ], { temperature: 0.5, maxOutputTokens: 600 });

    const responseText = completion.choices[0]?.message?.content || '[]';

    // Parse JSON from response
    let recommendations = [];
    try {
      // Try to extract JSON array from response
      const jsonMatch = responseText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        recommendations = JSON.parse(jsonMatch[0]);
      }
    } catch {
      // If parsing fails, generate default recommendations
      recommendations = getDefaultRecommendations(context);
    }

    return recommendations;
  } catch (error) {
    console.error('Error generating recommendations:', error);

    // Return default recommendations based on risk level
    const context = await getStudentContext(studentId);
    return getDefaultRecommendations(context);
  }
}

/**
 * Default recommendations based on risk level
 */
function getDefaultRecommendations(context) {
  const recommendations = [];

  if (context.riskLevel === 'HIGH') {
    recommendations.push({
      priority: 'high',
      action: 'Schedule immediate meeting with your academic advisor',
      reason: `Your current risk score of ${context.riskScore} indicates you need urgent academic support`,
      deadline: 'This week',
      resources: ['Academic Affairs Office', 'Building A, Room 301']
    });

    recommendations.push({
      priority: 'high',
      action: 'Attend tutoring sessions for challenging subjects',
      reason: 'Additional support can help improve your grades before finals',
      deadline: 'Starting today',
      resources: ['Tutoring Center - Building A, Room 101']
    });
  }

  if (context.attendanceRate < 85) {
    recommendations.push({
      priority: context.attendanceRate < 75 ? 'high' : 'medium',
      action: 'Improve class attendance immediately',
      reason: `Your attendance rate is ${context.attendanceRate.toFixed(0)}% - you need at least 75% to be eligible for exams`,
      deadline: 'Starting tomorrow'
    });
  }

  // Check for low grades
  const lowGrades = context.recentGrades.filter(g => (g.value / g.maxValue) * 20 < 10);
  if (lowGrades.length > 0) {
    recommendations.push({
      priority: 'medium',
      action: `Focus extra study time on: ${lowGrades.map(g => g.subject).join(', ')}`,
      reason: 'These subjects have grades below passing threshold',
      deadline: 'Before next assessment',
      resources: ['Study groups', 'Office hours with instructors']
    });
  }

  if (context.riskLevel === 'MEDIUM') {
    recommendations.push({
      priority: 'medium',
      action: 'Create a consistent study schedule',
      reason: 'Regular study habits will help maintain and improve your performance',
      deadline: 'This week'
    });
  }

  if (context.riskLevel === 'LOW') {
    recommendations.push({
      priority: 'low',
      action: 'Consider helping classmates as a peer tutor',
      reason: 'Your strong performance can help others while reinforcing your knowledge',
      deadline: 'When available'
    });
  }

  // Always add exam prep recommendation
  recommendations.push({
    priority: 'medium',
    action: 'Begin midterm exam preparation',
    reason: 'Midterms are approaching in 2 weeks',
    deadline: 'Start this week',
    resources: ['Review past exams', 'Study guides', 'Office hours']
  });

  return recommendations.slice(0, 5);
}

/**
 * Get a daily summary for the student
 */
export async function getDailySummary(studentId) {
  try {
    const context = await getStudentContext(studentId);

    const completion = await callGroq([
      {
        role: 'system',
        content: 'You are a friendly academic advisor assistant. Generate brief, encouraging daily summaries for students. Keep it under 100 words.'
      },
      {
        role: 'user',
        content: `Generate a brief daily summary for ${context.name}, a student in ${context.className} with risk score ${context.riskScore}/100 (${context.riskLevel} risk). 
          Attendance: ${context.attendanceRate.toFixed(0)}%.
          Recent grade average: ${context.recentGrades.length > 0 ?
            (context.recentGrades.reduce((a, g) => a + (g.value / g.maxValue) * 20, 0) / context.recentGrades.length).toFixed(1) : 'N/A'}/20.
          Provide: 1) A personalized greeting, 2) A one-sentence summary of their academic status, 3) 2-3 areas to focus on today.
          Format as JSON: {"greeting": "...", "summary": "...", "focus": ["...", "..."]}`
      }
    ], { temperature: 0.6, maxOutputTokens: 200 });

    const responseText = completion.choices[0]?.message?.content || '{}';

    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch {
      // Fall through to default
    }

    // Default summary
    return {
      greeting: `Good day, ${context.name}!`,
      summary: `You're currently at ${context.riskLevel} risk with a score of ${context.riskScore}/100. ${context.riskLevel === 'HIGH' ? 'Focus on improving your grades and attendance.' : context.riskLevel === 'MEDIUM' ? 'Stay consistent with your studies.' : 'Great work maintaining your academic performance!'}`,
      focus: context.riskLevel === 'HIGH'
        ? ['Meet with advisor', 'Attend all classes', 'Start tutoring sessions']
        : context.riskLevel === 'MEDIUM'
          ? ['Review weak subjects', 'Improve attendance', 'Prepare for exams']
          : ['Continue current habits', 'Help classmates', 'Explore enrichment opportunities']
    };
  } catch (error) {
    console.error('Error generating daily summary:', error);
    return {
      greeting: 'Welcome back!',
      summary: 'Focus on your studies today and stay on track with your academic goals.',
      focus: ['Attend all classes', 'Review notes', 'Complete assignments']
    };
  }
}
