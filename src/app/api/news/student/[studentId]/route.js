// EMSI Flow - Student News Feed API
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/news/student/[studentId] - Get news for a specific student
export async function GET(
  request,
  { params }
) {
  try {
    const { studentId } = await params;
    
    // Get student's class
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: { class: true }
    });
    
    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }
    
    const now = new Date();
    
    // Get all published news that haven't expired
    const allNews = await prisma.news.findMany({
      where: {
        isPublished: true,
        OR: [
          { expiresAt: null },
          { expiresAt: { gte: now } }
        ]
      },
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' }
      ]
    });
    
    // Filter news based on targeting
    const studentNews = allNews.filter(news => {
      // Check if news targets all
      if (news.targetAudience === 'all') return true;
      
      // Check if news targets student's class
      if (news.targetAudience === 'class' && news.targetClassIds) {
        const targetClassIds = JSON.parse(news.targetClassIds);
        if (Array.isArray(targetClassIds) && targetClassIds.includes(student.classId)) {
          return true;
        }
      }
      
      // Check if news targets specific students
      if (news.targetAudience === 'students' && news.targetStudentIds) {
        const targetStudentIds = JSON.parse(news.targetStudentIds);
        if (Array.isArray(targetStudentIds) && targetStudentIds.includes(studentId)) {
          return true;
        }
      }
      
      return false;
    });
    
    // Format response
    const formattedNews = studentNews.map(news => ({
      id: news.id,
      title: news.title,
      content: news.content,
      type: news.type,
      priority: news.priority,
      eventDate: news.eventDate,
      authorName: news.authorName,
      createdAt: news.createdAt,
      isUrgent: news.priority === 'urgent',
      isEvent: ['exam', 'event', 'deadline'].includes(news.type)
    }));
    
    return NextResponse.json({
      studentName: student.name,
      className: student.class.name,
      news: formattedNews,
      totalCount: formattedNews.length
    });
  } catch (error) {
    console.error('Error fetching student news:', error);
    return NextResponse.json(
      { error: 'Failed to fetch student news' },
      { status: 500 }
    );
  }
}
