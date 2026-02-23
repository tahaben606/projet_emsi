// EMSI Flow - Student Grades API Routes
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/students/[id]/grades - Get student grades
export async function GET(
  request,
  { params }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const subjectId = searchParams.get('subjectId');
    
    const grades = await prisma.grade.findMany({
      where: {
        studentId: id,
        ...(subjectId && { subjectId })
      },
      include: {
        subject: {
          select: { id: true, name: true, code: true, coefficient: true }
        }
      },
      orderBy: { date: 'desc' }
    });
    
    return NextResponse.json(grades);
  } catch (error) {
    console.error('Error fetching grades:', error);
    return NextResponse.json(
      { error: 'Failed to fetch grades' },
      { status: 500 }
    );
  }
}
