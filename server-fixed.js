/**
 * TY Music Server - 简化版 GD Studio API
 * 确保GD API正常工作
 */

const http = require('http');
const https = require('https');

const PORT = 8899;
const GD_API = 'https://music-api.gdstudio.xyz/api.php';

// 简单的HTTP GET请求
function simpleGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          console.error('JSON解析失败:', data.substring(0, 200));
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

// 格式化歌曲
function formatSong(s) {
  const artist = Array.isArray(s.artist) ? s.artist.join(', ') : (s.artist || '未知歌手');
  return {
    id: String(s.id || ''),
    name: s.name || '未知歌曲',
    artist: artist,
    album: s.album || '',
    cover: s.pic_id ? `https://picsum.photos/300/300?random=${s.id}` : '',
    duration: 0,
    source: 'netease'
  };
}

// 创建服务器
const server = http.createServer(async (req, res) => {
  const urlObj = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = urlObj.pathname;
  const params = urlObj.searchParams;
  
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  
  console.log(`[${new Date().toISOString()}] ${req.method} ${pathname}`);
  
  try {
    // 健康检查
    if (pathname === '/api/health') {
      res.end(JSON.stringify({ status: 'ok', time: Date.now() }));
      return;
    }
    
    // 搜索
    if (pathname === '/api/music/search') {
      const keywords = params.get('keywords') || '';
      const limit = parseInt(params.get('limit') || '30');
      
      console.log(`[Search] 搜索: ${keywords}, limit=${limit}`);
      
      const apiUrl = `${GD_API}?types=search&source=netease&name=${encodeURIComponent(keywords)}&count=${limit}`;
      console.log(`[Search] 请求GD API: ${apiUrl.substring(0, 100)}...`);
      
      const data = await simpleGet(apiUrl);
      console.log(`[Search] GD API返回: ${Array.isArray(data) ? data.length + '首歌曲' : '空或错误'}`);
      
      if (Array.isArray(data) && data.length > 0) {
        const songs = data.map(formatSong);
        res.end(JSON.stringify({ songs }));
      } else {
        res.end(JSON.stringify({ songs: [], message: '未找到歌曲' }));
      }
      return;
    }
    
    // 404
    res.statusCode = 404;
    res.end(JSON.stringify({ error: 'Not found' }));
    
  } catch (e) {
    console.error('[Error]', e.message);
    res.statusCode = 500;
    res.end(JSON.stringify({ error: e.message }));
  }
});

server.listen(PORT, () => {
  console.log(`✓ TY Music 服务器运行在 http://localhost:${PORT}`);
  console.log('✓ 使用 GD Studio API');
  console.log('✓ 测试: curl http://localhost:8899/api/music/search?keywords=周杰伦&limit=2');
});
