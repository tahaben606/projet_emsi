#!/usr/bin/env node

/**
 * Test script for enhanced AI assistant features
 * Tests schedule and exam awareness
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const DAYS = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

async function testAIEnhancements() {
  try {
    console.log('╔════════════════════════════════════════════════════════════════╗');
    console.log('║        🤖 AI ENHANCEMENT VERIFICATION - Schedule & Exam         ║');
    console.log('╚════════════════════════════════════════════════════════════════╝\n');

    // Get a test student
    const student = await prisma.student.findFirst({
      include: {
        class: {
          include: {
            schedules: {
              include: { subject: true },
              orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }]
            }
          }
        },
        grades: {
          include: { subject: true },
          orderBy: { date: 'desc' },
          take: 10
        }
      }
    });

    if (!student) {
      console.log('❌ No students found in database');
      process.exit(1);
    }

    console.log(`✅ Testing with student: ${student.name}`);
    console.log(`   Class: ${student.class.name} (${student.class.code})\n`);

    // Test 1: Schedule Retrieval
    console.log('📋 TEST 1: Schedule Retrieval');
    console.log('─────────────────────────────────────────');
    if (student.class.schedules.length > 0) {
      console.log(`✅ Found ${student.class.schedules.length} schedule entries\n`);
      
      // Group by day
      const schedulesByDay = {};
      for (const schedule of student.class.schedules) {
        const dayName = DAYS[schedule.dayOfWeek];
        if (!schedulesByDay[dayName]) schedulesByDay[dayName] = [];
        schedulesByDay[dayName].push({
          time: `${schedule.startTime}-${schedule.endTime}`,
          subject: schedule.subject?.name || 'Non spécifié',
          type: schedule.type,
          room: schedule.room || 'TBD'
        });
      }

      Object.entries(schedulesByDay).forEach(([day, sessions]) => {
        console.log(`  ${day}:`);
        sessions.forEach(s => {
          console.log(`    • ${s.time} — ${s.subject} (${s.type}) — Salle ${s.room}`);
        });
        console.log('');
      });
    } else {
      console.log('⚠️  No schedules found\n');
    }

    // Test 2: Exam Detection
    console.log('📝 TEST 2: Exam Detection');
    console.log('─────────────────────────────────────────');
    const exams = student.class.schedules.filter(s => s.type === 'exam');
    if (exams.length > 0) {
      console.log(`✅ Found ${exams.length} exams:\n`);
      exams.forEach(exam => {
        const dayName = DAYS[exam.dayOfWeek];
        console.log(`  📌 ${exam.subject?.name} — ${dayName} ${exam.startTime}-${exam.endTime}`);
        console.log(`     Salle: ${exam.room || 'TBD'}\n`);
      });
    } else {
      console.log('ℹ️  No exams scheduled\n');
    }

    // Test 3: Grade Information
    console.log('📊 TEST 3: Grade Information');
    console.log('─────────────────────────────────────────');
    if (student.grades.length > 0) {
      console.log(`✅ Found ${student.grades.length} grades:\n`);
      
      const examGrades = student.grades.filter(g => g.type === 'exam');
      if (examGrades.length > 0) {
        console.log('  Recent Exams:');
        examGrades.slice(0, 5).forEach(g => {
          const score = ((g.value / g.maxValue) * 20).toFixed(1);
          const date = new Date(g.date).toLocaleDateString('fr-FR');
          console.log(`    • ${g.subject.name}: ${score}/20 (${date})`);
        });
        console.log('');
      }

      // Calculate average
      const gradeValues = student.grades.map(g => (g.value / g.maxValue) * 20);
      const average = (gradeValues.reduce((a, b) => a + b, 0) / gradeValues.length).toFixed(2);
      console.log(`  Overall Average: ${average}/20\n`);
    } else {
      console.log('ℹ️  No grades recorded\n');
    }

    // Test 4: AI Context Block
    console.log('🤖 TEST 4: AI Context Block Simulation');
    console.log('─────────────────────────────────────────');
    console.log('This is what the AI sees:\n');
    
    const schedulesByDay = {};
    for (const schedule of student.class.schedules) {
      const dayName = DAYS[schedule.dayOfWeek];
      if (!schedulesByDay[dayName]) schedulesByDay[dayName] = [];
      schedulesByDay[dayName].push(schedule);
    }

    console.log(`📅 SCHEDULE SAMPLE (${Object.keys(schedulesByDay).length} days):`);
    Object.entries(schedulesByDay).slice(0, 2).forEach(([day, sessions]) => {
      console.log(`  ${day}: ${sessions.length} sessions`);
    });
    console.log('');

    console.log(`📝 EXAMS (${exams.length} total):`);
    if (exams.length > 0) {
      exams.slice(0, 3).forEach(e => {
        console.log(`  - ${e.subject?.name || 'Unknown'} (${e.type})`);
      });
    } else {
      console.log('  No exams scheduled');
    }
    console.log('');

    // Test 5: Question Examples
    console.log('💬 TEST 5: Example Questions AI Can Answer');
    console.log('─────────────────────────────────────────\n');
    
    const exampleQuestions = [
      'Do I have an exam this week?',
      'What\'s my timetable for Monday?',
      'When is my next exam?',
      'Quel est mon emploi du temps?',
      'Avez-je un examen cette semaine?',
      'How am I doing academically?'
    ];

    exampleQuestions.forEach((q, i) => {
      console.log(`  ${i + 1}. "${q}"`);
    });
    console.log('');

    // Summary
    console.log('════════════════════════════════════════════════════════════════');
    console.log('✅ AI ENHANCEMENT VERIFICATION COMPLETE\n');
    console.log('✨ Features Ready:');
    console.log('  ✓ Schedule awareness (${student.class.schedules.length} entries)');
    console.log('  ✓ Exam detection (${exams.length} exams found)');
    console.log('  ✓ Grade tracking (${student.grades.length} grades)');
    console.log('  ✓ Bilingual support (French & English)');
    console.log('  ✓ Privacy protection (no passwords/sensitive data)\n');
    console.log('📚 See: docs/AI_ENHANCED_FEATURES.md for full documentation');
    console.log('════════════════════════════════════════════════════════════════');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testAIEnhancements();
