#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('🗑️  Deleting all schedules...');
    const deleted = await prisma.schedule.deleteMany({});
    console.log(`✅ Deleted ${deleted.count} schedules`);
    
    console.log('\n📅 Regenerating schedules with exams...');
    
    const scheduleTemplates = [
      { dayOfWeek: 1, startTime: '08:00', endTime: '09:30', type: 'course' },
      { dayOfWeek: 1, startTime: '09:45', endTime: '11:15', type: 'course' },
      { dayOfWeek: 1, startTime: '11:30', endTime: '13:00', type: 'td' },
      { dayOfWeek: 2, startTime: '08:00', endTime: '09:30', type: 'course' },
      { dayOfWeek: 2, startTime: '09:45', endTime: '11:15', type: 'td' },
      { dayOfWeek: 2, startTime: '14:00', endTime: '15:30', type: 'tp' },
      { dayOfWeek: 3, startTime: '08:00', endTime: '09:30', type: 'course' },
      { dayOfWeek: 3, startTime: '10:00', endTime: '11:30', type: 'course' },
      { dayOfWeek: 3, startTime: '14:00', endTime: '15:30', type: 'td' },
      { dayOfWeek: 4, startTime: '08:00', endTime: '09:30', type: 'tp' },
      { dayOfWeek: 4, startTime: '09:45', endTime: '11:15', type: 'tp' },
      { dayOfWeek: 4, startTime: '14:00', endTime: '15:30', type: 'course' },
      { dayOfWeek: 5, startTime: '08:00', endTime: '09:30', type: 'course' },
      { dayOfWeek: 5, startTime: '09:45', endTime: '11:15', type: 'course' },
      { dayOfWeek: 2, startTime: '16:00', endTime: '17:30', type: 'exam' },
      { dayOfWeek: 4, startTime: '16:00', endTime: '17:30', type: 'exam' },
    ];

    const rooms = ['A101', 'A102', 'A103', 'A201', 'A202', 'B101', 'B102', 'B201', 'Lab-1', 'Lab-2'];
    const teachers = [
      'Prof. Alaoui', 'Prof. Benali', 'Prof. Mansouri', 'Prof. Hassan',
      'Prof. Rashid', 'Prof. Karim', 'Dr. Bennani', 'Dr. Idrissi'
    ];

    const classes = await prisma.class.findMany({
      include: { subjects: true }
    });

    let totalSchedulesCreated = 0;

    for (const classItem of classes) {
      let schedulesForClass = 0;
      let subjectIndex = 0;

      for (const template of scheduleTemplates) {
        const subject = classItem.subjects[subjectIndex % classItem.subjects.length];
        const room = rooms[Math.floor(Math.random() * rooms.length)];
        const teacher = teachers[Math.floor(Math.random() * teachers.length)];

        await prisma.schedule.create({
          data: {
            classId: classItem.id,
            subjectId: subject.id,
            dayOfWeek: template.dayOfWeek,
            startTime: template.startTime,
            endTime: template.endTime,
            type: template.type,
            room,
            teacherName: teacher
          }
        });

        schedulesForClass++;
        subjectIndex++;
      }

      totalSchedulesCreated += schedulesForClass;
    }

    console.log(`✅ Regenerated ${totalSchedulesCreated} schedules with exams\n`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
