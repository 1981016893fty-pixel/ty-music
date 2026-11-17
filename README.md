# TY Music

浏览器音乐播放器，提供在线搜索、播放、收藏、歌单与本地音频管理。原生 HTML/CSS/JavaScript 负责播放器，React 与 WebGL 组件负责部分视觉场景；仓库也包含 Tauri 桌面构建入口。

搜索先显示网易云基础结果，Embeat 可访问时异步追加，无需手动切源；Embeat 失败不影响基础列表与分页。网易云直连失败时使用 GD 公开 API 的同一网易云目录。各歌曲保留来源及原始资源 ID，不按同名合并或替换；旧曲库保留。Embeat 不提供下载或专辑目录，其接入使用 `music.gdstudio.xyz` 网站当前非文档协议；GD 公开 music-api 不支持 Embeat，这不是官方稳定 API 或完整网站源码。

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

```sh
npm test
npm run build:aurora
```

`npm test` 覆盖搜索 HTTP 边界、客户端请求竞态、缓存策略、场景生命周期和已有播放器/动效回归检查，外部搜索传输由测试夹具控制。`npm run test:data` 是单独的联网音乐数据检查，会受外部服务限制。CI 使用 Node.js 22，并检查入口脚本、样式及 `assets/aurora/` 分块与已提交文件一致。测试子进程显式隔离生产连接主机变量，避免误请求真实音源。

双源请求、独立游标、取消和超时集中在 `search-session.js`，`player.js` 负责显示及播放；新增的脚本必须随静态路由、service worker 与桌面复制清单一起更新。音源是否可用由实际请求决定，不检测 VPN。线上请求由 Render 转发，访问者开启 VPN 通常不会改变服务器的上游出口；本地 Node 服务则受本机网络影响。

动效采用按场景加载和按需绘制：封面网格收敛后停止，离屏或隐藏的局部动效暂停；浏览页柔光背景设有独立于 Retina 密度的 50 万像素上限。`scripts/verify-effect-lifecycle.mjs` 检查静置、指针／尺寸唤醒、离屏、隐藏和卸载行为，实际设备表现及测量边界见[维护指南](docs/maintenance.md#场景与流畅度)。

修改 `src/` 后运行 `npm run build:aurora`，一同提交 `soft-aurora-react.js`、`soft-aurora-react.css` 和整个 `assets/aurora/` 生成目录。重型动效仅在对应页面打开时加载，构建清单用于离线外壳预缓存核心模块；不可只上传入口脚本。桌面端命令见 `package.json` 的 `desktop:*` 入口及 `.github/workflows/` 中现有平台工作流；本次搜索修复未验证桌面安装包。

## 数据与限制

收藏、歌单和最近播放保存在当前浏览器的本地存储，本地音频保存在 IndexedDB；没有账号同步。清除站点数据会影响这些内容，请先参考[维护说明](docs/maintenance.md)。搜索、歌曲信息和在线播放依赖外部音乐服务，可能受版权、地域、限流、提供方规则及 Render 冷启动影响。第三方服务与媒体的分发授权尚未在本仓库建立，本项目不代表对其作出授权承诺；仓库未声明软件开源许可证。

2026-11-17 本地已实测双源追加，以及 Embeat 原曲歌词、封面和浏览器播放，拖动后播放位置与歌词同步。校时和歌曲时长兼容上游秒／毫秒差异；播放不使用同名异曲模糊替换。Render Free 控制台确认存在闲置休眠：缓存过的返访界面优先显示，但后端搜索／播放仍需等待唤醒。此前生产 Embeat 受 GD 校时 HTTP 403 阻塞；本地成功不能代替新双源版本的生产验收。最新 PR、CI、部署及实际可用性以[维护说明的当前状态](docs/maintenance.md#当前双源版本2026-11-17)为准，不据此承诺 Safari 60fps 或消除平台冷启动。

详细的接口契约、排障、数据位置、验证状态和回退步骤见[维护说明](docs/maintenance.md)。[API 入口说明](README_API.md)提供常用请求示例。
