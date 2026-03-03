import { db } from '@/lib/db';

// GET all schedules or filter by class
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const classId = searchParams.get('classId');
    const published = searchParams.get('published');

    let query = {};
    if (classId) query.classId = classId;
    if (published !== null) query.isPublished = published === 'true';

    const schedules = await db.schedule.findMany({
      where: query,
      include: {
        class: true,
        slots: {
          orderBy: [
            { day: 'asc' },
            { startTime: 'asc' }
          ]
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return Response.json(schedules);
  } catch (error) {
    console.error('Error fetching schedules:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// POST - Create a new schedule
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, description, classId, slots, imageUrl, imageAnalysis } = body;

    if (!name || !classId) {
      return Response.json(
        { error: 'Name and classId are required' },
        { status: 400 }
      );
    }

    const schedule = await db.schedule.create({
      data: {
        name,
        description,
        classId,
        imageUrl,
        imageAnalysis: imageAnalysis ? JSON.stringify(imageAnalysis) : null,
        slots: slots && slots.length > 0 ? {
          createMany: {
            data: slots
          }
        } : undefined
      },
      include: {
        class: true,
        slots: true
      }
    });

    return Response.json(schedule, { status: 201 });
  } catch (error) {
    console.error('Error creating schedule:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// DELETE - Delete a schedule
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const scheduleId = searchParams.get('id');

    if (!scheduleId) {
      return Response.json(
        { error: 'Schedule ID is required' },
        { status: 400 }
      );
    }

    const schedule = await db.schedule.delete({
      where: { id: scheduleId }
    });

    return Response.json(schedule);
  } catch (error) {
    console.error('Error deleting schedule:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
