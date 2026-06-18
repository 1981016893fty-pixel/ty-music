const http = require('http');

const server = http.createServer((req, res) => {
  console.log('Received request:', req.url);
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ 
    message: 'Test server is working!',
    url: req.url,
    timestamp: new Date().toISOString()
  }));
});

server.listen(8899, '0.0.0.0', () => {
  console.log('Test server running on http://0.0.0.0:8899');
});

setTimeout(() => {
  console.log('Server is still running after 3 seconds');
}, 3000);
