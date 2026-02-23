// EMSI Flow - Classes API Routes
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/classes - List all classes with risk summary
export async function GET(request) {
  try {
    const classes = await prisma.class.findMany({
      include: {
        students: {
          select: { id: true }
        },
        subjects: {
          select: { id: true, name: true }
        },
        _count: {
          select: { students: true }
        }
      },
      orderBy: { name: 'asc' }
    });
    
    return NextResponse.json(classes.map(c => ({
      id: c.id,
      name: c.name,
      code: c.code,
      department: c.department,
      year: c.year,
      studentCount: c._count.students,
      subjectCount: c.subjects.length
    })));
  } catch (error) {
    console.error('Error fetching classes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch classes' },
      { status: 500 }
    );
  }
}
