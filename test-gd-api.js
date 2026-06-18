const https = require('https');

console.log('[Test] Connecting to GD API directly...');

const req = https.get(
  'https://music-api.gdstudio.xyz/api.php?types=search&source=netease&name=test&count=2',
  { timeout: 10000, headers: { 'User-Agent': 'Mozilla/5.0' } },
  (res) => {
    let data = '';
    res.on('data', chunk => { data += chunk; });
    res.on('end', () => {
      console.log('[Test] Status:', res.statusCode);
      console.log('[Test] Response:', data.substring(0, 200));
      process.exit(0);
    });
  }
);

req.on('error', (e) => {
  console.error('[Test] Error:', e.message);
  process.exit(1);
});

req.on('timeout', () => {
  console.error('[Test] Timeout after 10s');
  req.destroy();
  process.exit(1);
});
