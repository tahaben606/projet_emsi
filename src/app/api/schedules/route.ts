import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/schedules?classId=... - Fetch schedules for a class
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const classId = searchParams.get('classId');

        if (!classId) {
            return NextResponse.json({ error: 'classId is required' }, { status: 400 });
        }

        const schedules = await prisma.schedule.findMany({
            where: { classId },
            include: {
                subject: { select: { id: true, name: true, code: true } },
            },
            orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
        });

        return NextResponse.json(schedules);
    } catch (error) {
        console.error('Error fetching schedules:', error);
        return NextResponse.json({ error: 'Failed to fetch schedules' }, { status: 500 });
    }
}

// POST /api/schedules - Create a schedule entry
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { classId, subjectId, dayOfWeek, startTime, endTime, room, type, teacherName } = body;

        if (!classId || dayOfWeek === undefined || !startTime || !endTime) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const schedule = await prisma.schedule.create({
            data: {
                classId,
                subjectId: subjectId || null,
                dayOfWeek,
                startTime,
                endTime,
                room: room || null,
                type: type || 'course',
                teacherName: teacherName || null,
            },
            include: {
                subject: { select: { id: true, name: true, code: true } },
            },
        });

        return NextResponse.json(schedule, { status: 201 });
    } catch (error) {
        console.error('Error creating schedule:', error);
        return NextResponse.json({ error: 'Failed to create schedule' }, { status: 500 });
    }
}

// DELETE /api/schedules?id=... - Delete a schedule entry
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'id is required' }, { status: 400 });
        }

        await prisma.schedule.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting schedule:', error);
        return NextResponse.json({ error: 'Failed to delete schedule' }, { status: 500 });
    }
}
