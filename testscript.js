const http = require('http');
const express = require('express');
const MatchingOrchestrator = require('./src/matchingOrchestrator');

async function testAPI() {
  // Start the server
  const app = express();
  app.use(express.json());

  app.post('/api/match', async (req, res) => {
    try {
      const { families, sendEmails } = req.body;
      const builtFamilies = await MatchingOrchestrator.orchestrate(families, sendEmails);

      const matches = [];
      for (const family of builtFamilies) {
        for (const member of family.getMembers()) {
          matches.push({
            name: member.getName(),
            baby: member.getBaby()
          });
        }
      }

      res.json({
        success: true,
        matches: matches
      });
    } catch (error) {
      res.status(400).json({
        error: error.message
      });
    }
  });

  const server = app.listen(3000, async () => {
    console.log('=== Testing Gift Exchange API ===\n');

    const testData = {
      families: [
        { name: 'Pau', members: ['Paula', 'Xavier', 'Belle', 'Ilysse'], email: 'xavier_baldovino@yahoo.com' },
        { name: 'JC', members: ['JC', 'Kriza', 'King', 'Zion'], email: 'xavier_baldovino@yahoo.com' },
        { name: 'Che', members: ['Cheche', 'Raunchie', 'Aan', 'Lexie', "Wanna"], email: 'xavier_baldovino@yahoo.com' },
        { name: 'Carol', members: ['Carol', 'Aldrin', 'Paul'], email: 'xavier_baldovino@yahoo.com' },
        { name: 'Budil', members: ['Budil', 'Doc', 'Gio'], email: 'xavier_baldovino@yahoo.com' },
        { name: 'Cleng', members: ['Cleng', 'Kat', 'Simon'], email: 'xavier_baldovino@yahoo.com' }
      ],
      sendEmails: true
    };

    console.log('Request: POST /api/match');
    console.log('Body: 6 families, 22 members total\n');

    const jsonData = JSON.stringify(testData);
    
    const options = {
      hostname: '127.0.0.1',
      port: 3000,
      path: '/api/match',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(jsonData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        const response = JSON.parse(data);
        console.log('\n--- Response ---');
        console.log('Status:', res.statusCode);
        console.log('Matches received:', response.matches.length);
        console.log('\nFirst 10 assignments:');
        response.matches.slice(0, 10).forEach(m => {
          console.log(`  ${m.name} → baby index ${m.baby}`);
        });
        
        server.close();
        process.exit(0);
      });
    });

    req.on('error', (e) => {
      console.error('Error:', e.message);
      server.close();
      process.exit(1);
    });

    req.write(jsonData);
    req.end();
  });
}

testAPI();
