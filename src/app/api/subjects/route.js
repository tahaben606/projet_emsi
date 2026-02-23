// EMSI Flow - Subjects API
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Fetch subjects by class
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const classId = searchParams.get('classId');

    if (classId) {
      const subjects = await prisma.subject.findMany({
        where: { classId },
        orderBy: { name: 'asc' }
      });
      return NextResponse.json(subjects);
    }

    // Return all subjects if no classId
    const subjects = await prisma.subject.findMany({
      include: { class: true },
      orderBy: [{ class: { name: 'asc' } }, { name: 'asc' }]
    });
    return NextResponse.json(subjects);
  } catch (error) {
    console.error('Error fetching subjects:', error);
    return NextResponse.json({ error: 'Failed to fetch subjects' }, { status: 500 });
  }
}
