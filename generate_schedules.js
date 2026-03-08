#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Sample schedule data for each day of week
const scheduleTemplates = [
  { dayOfWeek: 1, startTime: '08:00', endTime: '09:30', type: 'course' },      // Monday
  { dayOfWeek: 1, startTime: '09:45', endTime: '11:15', type: 'course' },
  { dayOfWeek: 1, startTime: '11:30', endTime: '13:00', type: 'td' },
  { dayOfWeek: 2, startTime: '08:00', endTime: '09:30', type: 'course' },      // Tuesday
  { dayOfWeek: 2, startTime: '09:45', endTime: '11:15', type: 'td' },
  { dayOfWeek: 2, startTime: '14:00', endTime: '15:30', type: 'tp' },
  { dayOfWeek: 3, startTime: '08:00', endTime: '09:30', type: 'course' },      // Wednesday
  { dayOfWeek: 3, startTime: '10:00', endTime: '11:30', type: 'course' },
  { dayOfWeek: 3, startTime: '14:00', endTime: '15:30', type: 'td' },
  { dayOfWeek: 4, startTime: '08:00', endTime: '09:30', type: 'tp' },          // Thursday
  { dayOfWeek: 4, startTime: '09:45', endTime: '11:15', type: 'tp' },
  { dayOfWeek: 4, startTime: '14:00', endTime: '15:30', type: 'course' },
  { dayOfWeek: 5, startTime: '08:00', endTime: '09:30', type: 'course' },      // Friday
  { dayOfWeek: 5, startTime: '09:45', endTime: '11:15', type: 'course' },
];

const rooms = ['A101', 'A102', 'A103', 'A201', 'A202', 'B101', 'B102', 'B201', 'Lab-1', 'Lab-2'];
const teachers = [
  'Prof. Alaoui',
  'Prof. Benali',
  'Prof. Mansouri',
  'Prof. Hassan',
  'Prof. Rashid',
  'Prof. Karim',
  'Dr. Bennani',
  'Dr. Idrissi'
];

async function main() {
  try {
    console.log('📅 Generating schedules for all classes...\n');

    // Get all classes and subjects
    const classes = await prisma.class.findMany({
      include: { subjects: true }
    });

    let totalSchedulesCreated = 0;

    for (const classItem of classes) {
      console.log(`\n📚 Processing class: ${classItem.name} (${classItem.code})`);
      
      // Check existing schedules for this class
      const existingCount = await prisma.schedule.count({
        where: { classId: classItem.id }
      });

      if (existingCount > 0) {
        console.log(`   ✅ Already has ${existingCount} schedules`);
        totalSchedulesCreated += existingCount;
        continue;
      }

      // Generate schedules for this class
      const classSubjects = classItem.subjects;
      if (classSubjects.length === 0) {
        console.log(`   ⚠️  No subjects found for this class`);
        continue;
      }

      let schedulesForClass = 0;
      let subjectIndex = 0;

      for (const template of scheduleTemplates) {
        const subject = classSubjects[subjectIndex % classSubjects.length];
        const room = rooms[Math.floor(Math.random() * rooms.length)];
        const teacher = teachers[Math.floor(Math.random() * teachers.length)];

        const schedule = await prisma.schedule.create({
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

      console.log(`   ✨ Created ${schedulesForClass} schedule entries`);
      totalSchedulesCreated += schedulesForClass;
    }

    console.log(`\n✅ Done! Total schedules created: ${totalSchedulesCreated}\n`);
    console.log('📋 Schedule Summary by Class:');
    
    const summary = await prisma.schedule.groupBy({
      by: ['classId'],
      _count: true
    });

    for (const item of summary) {
      const classData = await prisma.class.findUnique({ where: { id: item.classId } });
      console.log(`   ${classData.name}: ${item._count} entries`);
    }

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
