#!/usr/bin/env node

const http = require('http');

async function testAIChat() {
  const studentId = 'cmmgxi4zm001xfp7sp3kxh467'; // Taha's ID from our test
  
  const payload = {
    message: "Do I have an exam this week?",
    studentId: studentId,
    messages: [
      { role: 'user', content: "Do I have an exam this week?" }
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

testAIChat()
  .then(response => {
    console.log('\n🤖 AI Response to "Do I have an exam this week?":\n');
    console.log(response.response);
    console.log('\n---\n');
    console.log('✅ Test completed!');
  })
  .catch(error => {
    console.error('❌ Error:', error.message);
    process.exit(1);
  });
