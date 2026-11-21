# TY Music

浏览器音乐播放器，提供在线搜索、播放、收藏、歌单与本地音频管理。原生 HTML/CSS/JavaScript 负责播放器，React 与 WebGL 组件负责部分视觉场景；仓库也包含 Tauri 桌面构建入口。

搜索和输入建议优先采用 Embeat；它成功响应时只显示 Embeat，空结果也不混入网易云。连接失败时自动使用网易云。查询命中完整歌手名时，搜索和输入建议保留该歌手及合作曲。网易云优先通过本站接口返回歌曲与封面地址，接口失败时从浏览器直连 GD 网易云目录。各歌曲保留来源及原始资源 ID，旧曲库保留。Embeat 接入使用 `music.gdstudio.xyz` 网站当前非文档协议，支持在线播放。

## 部署

目标站点：[ty-music.pages.dev](https://ty-music.pages.dev)。前端使用 Cloudflare Pages，API 使用同源 Workers 免费额度。构建 `npm run build:pages`，运行、发布、额度与回退说明见[部署指南](DEPLOY-GUIDE.md)。音乐分类优先加载前四张封面；仍在下载的慢图会在页面可见时尝试代理补图，其余封面随滚动加载。全屏在大图无法加载时优先尝试该曲缩略图，缺图时显示占位。最近播放会恢复原曲封面，全屏背景跟随已加载的当前歌曲封面。列表和播放器封面加载策略见[维护指南](docs/maintenance.md#歌曲封面加载)。

换域名不会自动迁移个人曲库。请在原浏览器旧站打开 `/library-transfer.html` 导出，再在新站同名页面预览合并；音频与收藏留在本机，迁移工具不上传资料。旧服务退役以数据导出和新站验收完成为条件。

## 本地运行

使用 Node.js 22 或更高版本；本地、CI 与部署配置统一到 Node.js 22。首次运行：

```sh
npm ci
npm start
```

访问 <http://localhost:8899>。默认服务是 `server-simple.js`，无需另启本地网易云 API。端口被占用时：

```sh
PORT=18899 npm start
```

此时访问 <http://localhost:18899>。`npm start` 会先构建 React 场景资源；静态文件通过异步 IO 按需读取和压缩，小文件使用有容量上限的内存缓存，大文件流式传输。修改服务端代码后重启；修改 `src/` 后先重新构建。健康检查为 `/api/health`。

当前网络无法连接音乐台域名时，可使用已验证的 GD 官方连接主机：

```sh
GD_EMBEAT_CONNECT_HOST=music-api.gdstudio.xyz PORT=18899 npm start
```

此配置只改变 HTTP/2 的连接主机，仍访问 `music.gdstudio.xyz` 的网站服务并使用原始签名与 Embeat 来源；不调用公开 API 的 Embeat 搜索，也不修改系统 DNS 或代理。连接主机仅允许 GD 的两个已核对域名，保持 TLS 校验。详见[部署与排障](DEPLOY-GUIDE.md)。

## 验证与开发

本轮已修复曲库引用元数据裁剪、远端／本地播放竞态、旧请求生命周期与 Cover Flow 静止绘制问题。首页分类图改为请求 640px 艺人照片，Workers 显式缓存成功图片响应；Service Worker 对封面缓存优先并按 `max-age` 到期回源，详情页未指定尺寸时保留原分辨率。维护入口、回归证据和当前发布状态见[维护指南](docs/maintenance.md#封面与图片加载优化v54)及[工程质量审查](docs/quality-audit.md)。

```sh
npm test
npm run test:genre
npm run build:aurora
```

流派详情使用网易云目录，先展示最早返回的一批歌曲，再去重追加。流派回归覆盖首批显示、切换时取消旧请求及失败重试。发布时核对 API、主页和离线预缓存首页的构建提交，并按[部署指南](DEPLOY-GUIDE.md#验收与排障)验证旧浏览器缓存能升级。

`npm test` 覆盖曲库保留与存储额度、播放／随机队列／本地 Blob 生命周期、上游慢流／断流／体积及缓存上限、Cover Flow 静止停帧，以及搜索 HTTP 边界、客户端请求竞态、封面缓存命中与失败兜底、艺人照片尺寸与 Worker 边缘缓存、缓存策略（含 Pages 重定向与导航失败兜底）、场景生命周期、首页 12 个流派入口显示与详情回调，以及已有播放器／动效回归检查；外部搜索传输由测试夹具控制。`npm run test:data` 是单独的联网音乐数据检查，会受外部服务限制。CI 使用 Node.js 22，并检查入口脚本、样式及 `assets/aurora/` 分块与已提交文件一致。测试子进程显式隔离生产连接主机变量，避免误请求真实音源。

音源选择、分页、取消和超时集中在 `search-session.js`。 `browser-provider.js` 负责浏览器搜索和资源解析，`gd-embeat-core.js` 与 Node 共用签名协议，`player.js` 负责显示及播放。脚本必须随静态路由、Service Worker 与桌面复制清单一起更新。站内搜索经 Workers 请求网易云，直连回退和 Embeat 使用访问者的网络。VPN 可能影响 Embeat 的可用性；网站按实际响应选源。

动效采用按场景加载和按需绘制：封面网格收敛后停止，离屏或隐藏的局部动效暂停；浏览页柔光背景设有独立于 Retina 密度的 50 万像素上限。电流边框缓存空间格点和相邻时间行，保留原路径密度；按钮高光离屏暂停，文字扫光使用原生时间轴，同色文字不创建不可见动画。`scripts/verify-effect-lifecycle.mjs` 检查静置、指针／尺寸唤醒、离屏、隐藏和卸载行为，实际设备表现及测量边界见[维护指南](docs/maintenance.md#场景与流畅度)。

修改 `src/` 后运行 `npm run build:aurora`，一同提交 `soft-aurora-react.js`、`soft-aurora-react.css` 和整个 `assets/aurora/` 生成目录。重型动效仅在对应页面打开时加载，构建清单用于离线外壳预缓存核心模块；不可只上传入口脚本。桌面端命令见 `package.json` 的 `desktop:*` 入口及 `.github/workflows/` 中现有平台工作流；本次搜索修复未验证桌面安装包。

## 数据与限制

收藏、歌单和最近播放保存在当前浏览器的本地存储，本地音频保存在 IndexedDB；没有账号同步。清除站点数据会影响这些内容，请先参考[维护说明](docs/maintenance.md)。搜索、歌曲信息和在线播放依赖外部音乐服务，可能受版权、地域、限流、提供方规则及部署平台／网络延迟影响。第三方服务与媒体的分发授权尚未在本仓库建立，本项目不代表对其作出授权承诺；仓库未声明软件开源许可证。

以下为 Render 历史验收记录；当前 Cloudflare 状态以维护指南为准。2026-11-17 v49 动效负载优化已部署，保留现有效果；当次 ego lite 首页动画回调 CPU 约减少39%，不代表整机温度同比下降，详见维护说明的测量边界。此前 v48 已合并并部署至[旧站](https://ty-music.onrender.com)，ego lite 真实页面已验证网易云20首＋Embeat20首、Embeat原曲起播／封面／39行歌词、拖动后歌词高亮，以及补充源阻断时保留20首基础结果。校时和歌曲时长兼容上游秒／毫秒差异；播放不使用同名异曲模糊替换。Render Free 控制台确认存在闲置休眠：缓存过的返访界面优先显示，首次无缓存访问仍可能等待唤醒。此前生产服务端受 GD 校时 HTTP 403 阻塞，v48 网页改从访问者网络直连；上游仍可能波动。最新 PR、CI、部署及验收边界以[维护说明的当前状态](docs/maintenance.md#封面与图片加载优化v54)为准，不据此承诺全目录可用、Safari 60fps 或消除平台冷启动。

详细的接口契约、排障、数据位置、验证状态和回退步骤见[维护说明](docs/maintenance.md)。[API 入口说明](README_API.md)提供常用请求示例。
