# TY Music

浏览器音乐播放器，提供在线搜索、播放、收藏、歌单与本地音频管理。原生 HTML/CSS/JavaScript 负责播放器，React 与 WebGL 组件负责部分视觉场景；仓库也包含 Tauri 桌面构建入口。

默认搜索接入 Embeat 综合搜索，无需手动切源；旧曲库保留。音频和歌词使用搜索结果的原始资源 ID，不做同名歌曲模糊替换；目前不提供 Embeat 下载或专辑目录。接入使用 `music.gdstudio.xyz` 网站当前非文档协议，公开的 GD music-api 接口不支持 Embeat；这不是官方稳定 API，也不是完整网站源码。

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

修改 `src/` 后运行 `npm run build:aurora`，一同提交 `soft-aurora-react.js`、`soft-aurora-react.css` 和整个 `assets/aurora/` 生成目录。重型动效仅在对应页面打开时加载，构建清单用于离线外壳预缓存核心模块；不可只上传入口脚本。桌面端命令见 `package.json` 的 `desktop:*` 入口及 `.github/workflows/` 中现有平台工作流；本次搜索修复未验证桌面安装包。

## 数据与限制

收藏、歌单和最近播放保存在当前浏览器的本地存储，本地音频保存在 IndexedDB；没有账号同步。清除站点数据会影响这些内容，请先参考[维护说明](docs/maintenance.md)。搜索、歌曲信息和在线播放依赖外部音乐服务，可能受版权、地域、限流、提供方规则及 Render 冷启动影响。第三方服务与媒体的分发授权尚未在本仓库建立，本项目不代表对其作出授权承诺；仓库未声明软件开源许可证。

2026-11-17 本地已实测 Embeat 搜索、原曲歌词、封面和浏览器播放，拖动后播放位置与歌词同步。校时和歌曲时长兼容上游秒／毫秒差异；播放不使用同名异曲模糊替换。Render Free 控制台确认存在闲置休眠：缓存过的返访界面优先显示，但后端搜索／播放仍需等待唤醒。实际 CI、部署与性能验收状态见[维护说明](docs/maintenance.md)，不据此承诺 Safari 60fps 或消除平台冷启动。

详细的接口契约、排障、数据位置、验证状态和回退步骤见[维护说明](docs/maintenance.md)。[API 入口说明](README_API.md)提供常用请求示例。
