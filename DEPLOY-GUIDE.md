# TY Music 部署与排障

当前网站是已有 Render Web Service，入口为 `https://ty-music.onrender.com`。沿用该服务，不新建付费资源。源码、测试与运行时约定见 [README](README.md)，数据、协议与回退风险见[维护指南](docs/maintenance.md)。

## 构建和发布

1. 使用 Node.js 22，本地运行 `npm ci --include=dev`、`npm test`、`npm run build:aurora`，确认生成资源无遗漏。
2. 将修复提交至独立任务分支，创建 PR，等待 `Web checks` 完成。本轮部署分支为 `codex/deploy-embeat-search`；主分支的合并单独处理。
3. 在既有 Render 服务的 Settings 核对仓库、部署分支与启动命令；环境变量设置 `NODE_VERSION=22.22.2`。构建命令为 `npm ci --include=dev && npm test && npm run build:aurora`，启动命令为 `node server-simple.js`。`esbuild` 是构建所需开发依赖，不能在构建前省略。
4. 网络无法直连音乐台时，可设置 `GD_EMBEAT_CONNECT_HOST=music-api.gdstudio.xyz`。该选项只启用到 GD 官方主机的 HTTP/2 连接路由，网站 authority 与签名仍为 `music.gdstudio.xyz`，来源仍为 Embeat；公开 API 自身不支持 Embeat。该路由依赖 GD 当前托管配置，不能保证未来稳定。本地与 Render 的出口和 CDN 节点不同，不应直接照搬本地连接设置；当前 Render 使用 `music.gdstudio.xyz`，校时故障正在通过安全诊断区分 HTTP 状态和格式。未设置时使用网站默认连接方式；不支持任意代理主机，不禁用 TLS 校验。
5. 当前既有服务 Auto-Deploy 为 Off，按此流程手动发布，避免未经验收的任务分支更新自动替换线上。部署已通过检查的具体提交，等待 Render 显示 Live，并对照实际提交哈希。不要把推送、触发构建或健康检查成功当成完整上线验收。

仅修改 `render.yaml` 不会自动更改所有既有手动创建服务的设置，必须在控制台核对实际值。回退前保留原分支、运行时和部署提交，不覆盖其他项目或环境变量。

## 上线验收

```sh
curl 'https://ty-music.onrender.com/api/health'
curl --get 'https://ty-music.onrender.com/api/music/search' \
  --data-urlencode 'keywords=晴天 周杰伦' --data 'limit=20'
```

健康响应的 `commit` 应与目标部署一致，`node` 应为 Node 22，`searchSource` 应为 `embeat`；非 Render 本地环境 `commit` 可以为 `null`。搜索应返回真实 Embeat 歌曲及原始资源 ID，不能只检查 HTTP 200 或伪造总数。然后在网页搜索并播放，核对歌名/歌手、封面、歌词、音频起播与拖动；失败、无结果、连续切词和再次搜索应正常结束加载。不要删除真实收藏、歌单或浏览器站点数据来完成验收。

Render 控制台已确认当前为 Free 实例，明确提示闲置休眠后的请求可能延迟 50 秒以上。代码无法关闭平台休眠；本轮仅确认该机制，未测一次完整闲置→唤醒耗时。新 service worker 让已有完整缓存的返访外壳先显示，但搜索／音频仍需网络。首次访客无缓存时仍会等待唤醒；本任务不升级付费、不添加后台保活。

## 本地搜索失败

服务默认监听 `8899`，隔离预览使用 `18899`。网站直连超时的网络可用：

```sh
GD_EMBEAT_CONNECT_HOST=music-api.gdstudio.xyz PORT=18899 npm start
```

排查顺序：本地健康检查 → 搜索 HTTP 状态与 `code` → GD 校时/连接 → 网站签名或限流。校时同时支持秒和毫秒，不能写死为 13 位；单次请求总预算 12 秒，含最多 4 秒校时。`GD_TIMEOUT` 是超时，不能解释成无歌曲或账号授权失败。搜索不走缓存；静态资源按需异步加载，前端 `src/` 修改后重新构建并同步上传入口脚本、样式与整个 `assets/aurora/` 生成目录。服务端源码修改后重启。

HTTP 测试子进程必须清空 `GD_EMBEAT_CONNECT_HOST`，由夹具控制传输；否则继承生产变量会绕过夹具，CI 可通过而 Render 构建测试失败。发布前运行 `GD_EMBEAT_CONNECT_HOST=music-api.gdstudio.xyz npm test`；不要删测试或绕过构建门禁。

## 回退

部署前记录 Render 当前 Live 提交。若新版本搜索、播放或资源出现回归，在该服务的 Deploys 中重新部署已记录的上一个成功提交，并复核健康和核心流程。需要撤销代码时使用 `git revert` 保留历史，不强推、不硬重置或清空浏览器个人数据。先在控制台核对回退提交支持的 Node 版本，再决定是否恢复原运行时配置。
