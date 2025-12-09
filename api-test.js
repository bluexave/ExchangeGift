const http = require('http');

// Test data
const testData = {
  families: [
    {
      name: 'Smith Family',
      members: ['Alice', 'Bob']
    },
    {
      name: 'Johnson Family',
      members: ['Charlie', 'Diana']
    },
    {
      name: 'Williams Family',
      members: ['Edward', 'Fiona']
    }
  ]
};

const jsonData = JSON.stringify(testData);

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/match',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(jsonData)
  }
};

console.log('=== Testing Gift Exchange API ===\n');
console.log('Endpoint: POST /api/match');
console.log('\nRequest Body:');
console.log(JSON.stringify(testData, null, 2));

const req = http.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('\n--- Response ---\n');
    console.log('Status Code:', res.statusCode);
    console.log('\nResponse Body:');
    try {
      const parsed = JSON.parse(data);
      console.log(JSON.stringify(parsed, null, 2));
    } catch (e) {
      console.log(data);
    }
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});

req.write(jsonData);
req.end();

// Test health endpoint
setTimeout(() => {
  console.log('\n\n=== Testing Health Check ===\n');
  console.log('Endpoint: GET /health');

  const healthOptions = {
    hostname: 'localhost',
    port: 3000,
    path: '/health',
    method: 'GET'
  };

  const healthReq = http.request(healthOptions, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      console.log('\nStatus Code:', res.statusCode);
      console.log('\nResponse Body:');
      try {
        const parsed = JSON.parse(data);
        console.log(JSON.stringify(parsed, null, 2));
      } catch (e) {
        console.log(data);
      }
    });
  });

  healthReq.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
  });

  healthReq.end();
}, 500);
