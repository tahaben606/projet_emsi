#!/usr/bin/env node

const http = require('http');

function testAIChat(message, studentId) {
  const payload = {
    message: message,
    studentId: studentId,
    messages: [
      { role: 'user', content: message }
    ]
  };

  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/ai/chat',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': JSON.stringify(payload).length
      }
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          resolve(response);
        } catch (error) {
          reject(new Error(`Failed to parse response: ${data}`));
        }
      });
    });

    req.on('error', reject);
    req.write(JSON.stringify(payload));
    req.end();
  });
}

const studentId = 'cmmgxi4zm001xfp7sp3kxh467'; // Taha's ID

const testQuestions = [
  "What's my timetable for Monday?",
  "Quel est mon emploi du temps?",
  "When is my next exam?",
  "Avez-je un examen cette semaine?"
];

async function runTests() {
  console.log('🤖 AI CHAT ENHANCEMENT VALIDATION\n');
  console.log('========================================\n');

  for (const question of testQuestions) {
    console.log(`❓ Question: "${question}"\n`);
    try {
      const response = await testAIChat(question, studentId);
      console.log(`📝 Response:\n${response.response}\n`);
      console.log('---\n');
    } catch (error) {
      console.error(`❌ Error: ${error.message}\n`);
    }
  }

  console.log('✅ All validation tests completed!');
}

runTests().catch(console.error);
