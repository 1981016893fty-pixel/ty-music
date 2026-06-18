# TY Music 公网部署指南

## 目标
让你的 iPhone 和朋友都能通过公网 URL 访问 TY Music，永久免费。

---

## 方案：Render.com 免费部署

Render 提供 **免费的 Node.js Web Service**，每月 750 小时免费额度（够 24×7 运行）。
唯一限制：15 分钟无访问会自动休眠，下次访问时冷启动约 30-60 秒。

---

## 部署步骤（约 5 分钟）

### 1. 注册 Render 账号
- 打开 https://render.com
- 点 "Get Started" → 用 GitHub 账号注册（推荐）
- 如果没有 GitHub 账号，先注册一个

### 2. 将项目上传到 GitHub

#### 方法 A：用 GitHub Desktop（推荐，图形界面）
1. 下载 https://desktop.github.com/
2. 登录你的 GitHub 账号
3. 点 "Add → Add local repository"
4. 选择文件夹：`/Users/futaiyi/WorkBuddy/2026-06-16-13-40-38/music-player`
5. 如果提示不是 git 仓库，点 "create a new repository"
6. 仓库名填 `ty-music`，点 "Create repository"
7. 在左下角填写 commit message："TY Music 初始版本"
8. 点 "Commit to main"
9. 点 "Push origin" 上传到 GitHub

#### 方法 B：用命令行
```bash
cd /Users/futaiyi/WorkBuddy/2026-06-16-13-40-38/music-player
git init
git add -A
git commit -m "TY Music 初始版本"
# 先在 GitHub 网页上创建空仓库 ty-music
git remote add origin https://github.com/你的用户名/ty-music.git
git branch -M main
git push -u origin main
```

### 3. 在 Render 上创建服务
1. 登录 https://dashboard.render.com
2. 点 "New +" → "Web Service"
3. 连接你的 GitHub 账号，选择 `ty-music` 仓库
4. 填写配置：
   - **Name**: `ty-music`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`（实际上没有依赖，会秒过）
   - **Start Command**: `node server-simple.js`
   - **Instance Type**: `Free`
5. 点 "Create Web Service"

### 4. 等待部署完成
- Render 会自动构建和启动
- 约 1-2 分钟后状态变为 "Live"
- 你会获得一个公网 URL，类似：
  `https://ty-music-xxxx.onrender.com`

### 5. 验证
- 在浏览器打开 `https://ty-music-xxxx.onrender.com/api/health`
- 看到 `{"status":"ok",...}` 就说明成功了

---

## 访问你的网站

- **iPhone**: 在 Safari 打开 `https://ty-music-xxxx.onrender.com`
- **朋友**: 把 URL 发给朋友，任何人都能打开
- **添加到主屏幕**（iPhone）:
  1. Safari 打开网站
  2. 点底部分享按钮
  3. 选 "添加到主屏幕"
  4. 像原生 App 一样使用

---

## 常见问题

### Q: 首次打开很慢？
A: Render 免费版 15 分钟无访问会休眠。冷启动需要 30-60 秒，之后正常速度。

### Q: 歌曲播放不了？
A: 检查 `https://你的URL/api/health` 是否正常。如果 GD API 被墙，Render 服务器在海外可以正常访问。

### Q: 如何更新代码？
A: 本地修改代码 → push 到 GitHub → Render 自动重新部署。

### Q: 想要更稳定（不休眠）？
A: Render 付费版 $7/月，不休眠 + 更高性能。或升级到 Railway / Fly.io 等平台。

---

## 文件说明
| 文件 | 作用 |
|------|------|
| `server-simple.js` | 主服务器（API 代理 + 静态文件） |
| `index.html` | 网页 UI |
| `player.js` | 前端播放器逻辑 |
| `style.css` | 样式 |
| `liquid-glass.js` | 液态玻璃特效 |
| `package.json` | Node.js 项目配置 |
| `render.yaml` | Render 部署配置（可选，也可手动配） |
