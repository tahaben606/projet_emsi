#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testChatContext() {
  try {
    // Get Taha's student ID
    const student = await prisma.student.findFirst({
      where: { name: 'taha ben' }
    });

    if (!student) {
      console.log('❌ Student not found');
      process.exit(1);
    }

    console.log(`✅ Found student: ${student.name} (ID: ${student.id})`);
    
    // Simulate what the chat endpoint does
    const testMessage = "Do I have an exam this week?";
    
    console.log(`\n📝 Test Message: "${testMessage}"\n`);
    
    // Get student context like the API does
    const studentData = await prisma.student.findUnique({
      where: { id: student.id },
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
          orderBy: { date: 'desc' },
          take: 20
        },
        attendance: true
      }
    });

    console.log(`📚 Student Context Data:`);
    console.log(`   - Class: ${studentData.class.name}`);
    console.log(`   - Schedules count: ${studentData.class.schedules.length}`);
    
    // Check for exams
    const exams = studentData.class.schedules.filter(s => s.type === 'exam');
    console.log(`   - Exams found: ${exams.length}`);
    
    if (exams.length > 0) {
      console.log(`\n   Exam Details:`);
      exams.forEach(exam => {
        const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
        console.log(`     • ${exam.subject?.name} - ${days[exam.dayOfWeek]} ${exam.startTime}-${exam.endTime} (${exam.room})`);
      });
    }

    console.log(`\n✅ Context is ready for chat endpoint`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testChatContext();
