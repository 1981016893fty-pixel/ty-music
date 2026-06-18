const http = require('http');

const server = http.createServer((req, res) => {
  console.log('Request received:', req.url);
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ 
    status: 'ok',
    message: 'Minimal server is working!',
    url: req.url,
    time: new Date().toISOString()
  }));
});

server.on('error', (err) => {
  console.error('Server error:', err);
});

server.listen(8899, '0.0.0.0', () => {
  console.log('Minimal server listening on http://0.0.0.0:8899');
});

process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down...');
  server.close();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('Received SIGINT, shutting down...');
  server.close();
  process.exit(0);
});
