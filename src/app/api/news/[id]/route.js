// EMSI Flow - Single News API Routes
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/news/[id] - Get single news item
export async function GET(
  request,
  { params }
) {
  try {
    const { id } = await params;
    
    const news = await prisma.news.findUnique({
      where: { id }
    });
    
    if (!news) {
      return NextResponse.json(
        { error: 'News not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      ...news,
      targetClassIds: news.targetClassIds ? JSON.parse(news.targetClassIds) : null,
      targetStudentIds: news.targetStudentIds ? JSON.parse(news.targetStudentIds) : null
    });
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
}

// PUT /api/news/[id] - Update news item
export async function PUT(
  request,
  { params }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const updateData = {};
    
    if (body.title) updateData.title = body.title;
    if (body.content) updateData.content = body.content;
    if (body.type) updateData.type = body.type;
    if (body.priority) updateData.priority = body.priority;
    if (body.targetAudience) updateData.targetAudience = body.targetAudience;
    if (body.targetClassIds !== undefined) updateData.targetClassIds = body.targetClassIds ? JSON.stringify(body.targetClassIds) : null;
    if (body.targetStudentIds !== undefined) updateData.targetStudentIds = body.targetStudentIds ? JSON.stringify(body.targetStudentIds) : null;
    if (body.eventDate !== undefined) updateData.eventDate = body.eventDate ? new Date(body.eventDate) : null;
    if (body.expiresAt !== undefined) updateData.expiresAt = body.expiresAt ? new Date(body.expiresAt) : null;
    if (body.isPublished !== undefined) updateData.isPublished = body.isPublished;
    
    const news = await prisma.news.update({
      where: { id },
      data: updateData
    });
    
    return NextResponse.json({
      ...news,
      targetClassIds: news.targetClassIds ? JSON.parse(news.targetClassIds) : null,
      targetStudentIds: news.targetStudentIds ? JSON.parse(news.targetStudentIds) : null
    });
  } catch (error) {
    console.error('Error updating news:', error);
    return NextResponse.json(
      { error: 'Failed to update news' },
      { status: 500 }
    );
  }
}

// DELETE /api/news/[id] - Delete news item
export async function DELETE(
  request,
  { params }
) {
  try {
    const { id } = await params;
    
    await prisma.news.delete({
      where: { id }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting news:', error);
    return NextResponse.json(
      { error: 'Failed to delete news' },
      { status: 500 }
    );
  }
}
