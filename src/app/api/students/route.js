// EMSI Flow - Students API Routes
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/students - List all students
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const classId = searchParams.get('classId');
    
    const students = await prisma.student.findMany({
      where: classId ? { classId } : undefined,
      include: {
        class: {
          select: { id: true, name: true, code: true }
        }
      },
      orderBy: { name: 'asc' }
    });
    
    return NextResponse.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json(
      { error: 'Failed to fetch students' },
      { status: 500 }
    );
  }
}
