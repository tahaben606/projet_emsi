// EMSI Flow - Student Attendance API Routes
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/students/[id]/attendance - Get student attendance
export async function GET(
  request,
  { params }
) {
  try {
    const { id } = await params;
    
    const attendance = await prisma.attendance.findMany({
      where: { studentId: id },
      include: {
        subject: {
          select: { id: true, name: true, code: true }
        }
      },
      orderBy: { date: 'desc' }
    });
    
    // Calculate statistics
    const stats = {
      total: attendance.length,
      present: attendance.filter(a => a.status === 'present').length,
      absent: attendance.filter(a => a.status === 'absent').length,
      late: attendance.filter(a => a.status === 'late').length,
      excused: attendance.filter(a => a.status === 'excused').length
    };
    
    return NextResponse.json({
      attendance,
      stats,
      rate: stats.total > 0 
        ? ((stats.present + stats.excused) / stats.total * 100).toFixed(1)
        : 'N/A'
    });
  } catch (error) {
    console.error('Error fetching attendance:', error);
    return NextResponse.json(
      { error: 'Failed to fetch attendance' },
      { status: 500 }
    );
  }
}
