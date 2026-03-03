import { db } from '@/lib/db';

// GET a single schedule
export async function GET(request, { params }) {
  try {
    const { id } = params;

    const schedule = await db.schedule.findUnique({
      where: { id },
      include: {
        class: true,
        slots: {
          orderBy: [
            { day: 'asc' },
            { startTime: 'asc' }
          ]
        }
      }
    });

    if (!schedule) {
      return Response.json(
        { error: 'Schedule not found' },
        { status: 404 }
      );
    }

    return Response.json(schedule);
  } catch (error) {
    console.error('Error fetching schedule:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// PUT - Update a schedule
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { name, description, isPublished, imageUrl, imageAnalysis, slots } = body;

    const schedule = await db.schedule.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(isPublished !== undefined && { isPublished }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(imageAnalysis !== undefined && { imageAnalysis: imageAnalysis ? JSON.stringify(imageAnalysis) : null })
      },
      include: {
        class: true,
        slots: true
      }
    });

    // Handle slots updates if provided
    if (slots && Array.isArray(slots)) {
      // Delete all existing slots
      await db.scheduleSlot.deleteMany({
        where: { scheduleId: id }
      });

      // Create new slots
      if (slots.length > 0) {
        await db.scheduleSlot.createMany({
          data: slots.map(slot => ({
            ...slot,
            scheduleId: id
          }))
        });
      }

      // Refetch to get updated slots
      const updated = await db.schedule.findUnique({
        where: { id },
        include: {
          class: true,
          slots: {
            orderBy: [
              { day: 'asc' },
              { startTime: 'asc' }
            ]
          }
        }
      });

      return Response.json(updated);
    }

    return Response.json(schedule);
  } catch (error) {
    console.error('Error updating schedule:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// DELETE a schedule
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    const schedule = await db.schedule.delete({
      where: { id }
    });

    return Response.json(schedule);
  } catch (error) {
    console.error('Error deleting schedule:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
