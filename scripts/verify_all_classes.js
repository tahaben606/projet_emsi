#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verifySchedulesByClass() {
  try {
    console.log('📊 SCHEDULE DISTRIBUTION BY CLASS\n');
    console.log('════════════════════════════════════════════\n');

    const classes = await prisma.class.findMany({
      orderBy: { code: 'asc' }
    });

    let grandTotalSchedules = 0;
    let grandTotalCourses = 0;
    let grandTotalTD = 0;
    let grandTotalTP = 0;
    let grandTotalExams = 0;

    for (const classItem of classes) {
      const schedules = await prisma.schedule.findMany({
        where: { classId: classItem.id }
      });

      const courses = schedules.filter(s => s.type === 'course').length;
      const td = schedules.filter(s => s.type === 'td').length;
      const tp = schedules.filter(s => s.type === 'tp').length;
      const exams = schedules.filter(s => s.type === 'exam').length;
      const total = schedules.length;

      console.log(`📚 ${classItem.name} (${classItem.code})`);
      console.log(`   ${total} Cours/semaine`);
      console.log(`   ${courses} Cours`);
      console.log(`   ${tp} TP`);
      console.log(`   ${td} TD`);
      console.log(`   ${exams} Examen\n`);

      grandTotalSchedules += total;
      grandTotalCourses += courses;
      grandTotalTD += td;
      grandTotalTP += tp;
      grandTotalExams += exams;
    }

    console.log('════════════════════════════════════════════\n');
    console.log(`📊 TOTALS ACROSS ALL ${classes.length} CLASSES`);
    console.log(`   ${grandTotalSchedules} Total Schedules`);
    console.log(`   ${grandTotalCourses} Total Courses`);
    console.log(`   ${grandTotalTP} Total TPs`);
    console.log(`   ${grandTotalTD} Total TDs`);
    console.log(`   ${grandTotalExams} Total Exams\n`);
    
    console.log(`📈 PER CLASS AVERAGE`);
    console.log(`   ${(grandTotalSchedules / classes.length).toFixed(0)} Cours/semaine`);
    console.log(`   ${(grandTotalCourses / classes.length).toFixed(0)} Cours`);
    console.log(`   ${(grandTotalTP / classes.length).toFixed(0)} TP`);
    console.log(`   ${(grandTotalTD / classes.length).toFixed(0)} TD`);
    console.log(`   ${(grandTotalExams / classes.length).toFixed(0)} Examen\n`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

verifySchedulesByClass();
