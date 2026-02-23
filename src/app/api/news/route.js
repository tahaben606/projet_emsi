// EMSI Flow - News API Routes (Admin - CRUD)
import { NextResponse } from 'next/server';

// Dynamic import to force fresh Prisma client
async function getPrisma() {
  const { PrismaClient } = await import('@prisma/client');
  return new PrismaClient();
}

// GET /api/news - List all news (admin view)
export async function GET(request) {
  try {
    const prisma = await getPrisma();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const published = searchParams.get('published');
    
    const news = await prisma.news.findMany({
      where: {
        ...(type && { type }),
        ...(published !== null && { isPublished: published === 'true' })
      },
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' }
      ]
    });
    
    // Parse JSON fields
    const parsedNews = news.map(item => ({
      ...item,
      targetClassIds: item.targetClassIds ? JSON.parse(item.targetClassIds) : null,
      targetStudentIds: item.targetStudentIds ? JSON.parse(item.targetStudentIds) : null
    }));
    
    await prisma.$disconnect();
    return NextResponse.json(parsedNews);
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
}

// POST /api/news - Create a new news item
export async function POST(request) {
  try {
    const prisma = await getPrisma();
    const body = await request.json();
    const {
      title,
      content,
      type,
      priority = 'normal',
      targetAudience = 'all',
      targetClassIds,
      targetStudentIds,
      eventDate,
      expiresAt,
      authorName = 'Admin'
    } = body;
    
    if (!title || !content || !type) {
      return NextResponse.json(
        { error: 'Title, content, and type are required' },
        { status: 400 }
      );
    }
    
    const news = await prisma.news.create({
      data: {
        title,
        content,
        type,
        priority,
        targetAudience,
        targetClassIds: targetClassIds ? JSON.stringify(targetClassIds) : null,
        targetStudentIds: targetStudentIds ? JSON.stringify(targetStudentIds) : null,
        eventDate: eventDate ? new Date(eventDate) : null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        isPublished: true,
        authorName
      }
    });
    
    await prisma.$disconnect();
    return NextResponse.json({
      ...news,
      targetClassIds: targetClassIds || null,
      targetStudentIds: targetStudentIds || null
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating news:', error);
    return NextResponse.json(
      { error: 'Failed to create news' },
      { status: 500 }
    );
  }
}
