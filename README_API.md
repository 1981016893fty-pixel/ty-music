# TY Music - 网易云 API 集成完成

## 修改内容

### 1. 集成本地网易云 API (NeteaseCloudMusicApi)
- 克隆了 NeteaseCloudMusicApi 到 `netease-api/` 目录
- 修改 `server.js` 优先使用本地 API，备用 GD Studio API
- 修改 NCM API 路径从 `node_modules/NeteaseCloudMusicApi/` 到 `netease-api/`

### 2. 修复的问题
- ✅ 修复了 `httpsGetJSON` 函数受系统代理干扰的问题
- ✅ 歌手页面现在使用 Apple Music 风格设计
- ✅ 搜索功能现在使用本地网易云 API，更稳定

### 3. Updated 文件
- `server.js` - 集成了 NCM API，优先使用本地 API
- `index.html` - 更新了版本号到 v127
- `start.sh` - 新增启动脚本

## 如何启动

### 方法 1: 使用启动脚本 (推荐)
```bash
cd /Users/futaiyi/WorkBuddy/2026-06-16-13-40-38/music-player
./start.sh
```

### 方法 2: 手动启动
```bash
# 终端 1: 启动网易云 API
cd /Users/futaiyi/WorkBuddy/2026-06-16-13-40-38/music-player/netease-api
PORT=3001 node app.js

# 终端 2: 启动主服务器
cd /Users/futaiyi/WorkBuddy/2026-06-16-13-40-38/music-player
node server.js
```

## 访问网站
启动后访问: http://localhost:8899

## API 端点
- 搜索: http://localhost:8899/api/music/search?keywords=周杰伦&limit=10
- 音频: http://localhost:8899/api/music/proxy?id=xxxxx&source=netease
- 歌词: http://localhost:8899/api/music/lyric?id=xxxxx&source=netease

## 技术栈
- 主服务器: Node.js (server.js on port 8899)
- 音乐 API: NeteaseCloudMusicApi (port 3001)
- 前端: 原生 HTML/CSS/JS

## 注意事项
- 首次启动时会自动安装网易云 API 的依赖
- 本地 API 更稳定，不需要依赖外部服务
- 如果遇到问题，检查端口 3001 和 8899 是否被占用
