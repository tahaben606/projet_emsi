#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const totalSchedules = await prisma.schedule.count();
    console.log('✅ Total schedules in database:', totalSchedules);

    const classes = await prisma.class.findMany({
      include: {
        _count: {
          select: { schedules: true }
        }
      }
    });

    console.log('\n📋 Schedule Count by Class:');
    for (const cls of classes) {
      console.log(`  ${cls.name} (${cls.code}): ${cls._count.schedules} schedules`);
    }

    // Show sample schedules
    const sample = await prisma.schedule.findMany({
      take: 3,
      include: {
        subject: { select: { name: true } },
        class: { select: { name: true } }
      }
    });

    console.log('\n📌 Sample Schedules:');
    for (const sch of sample) {
      console.log(`  ${sch.class.name} - ${sch.subject?.name} at ${sch.startTime}-${sch.endTime}`);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
