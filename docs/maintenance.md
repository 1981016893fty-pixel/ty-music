# TY Music 维护指南

## 歌曲封面加载

旧版正式站的「爵士」首屏封面在歌名出现后再等约 3.4–6 秒。请求在歌名出现后约 15 毫秒已发出。相同浏览器直接读取网易云 CDN 的「华语」样本，7 张 300px 封面在约 0.22–0.23 秒内完成解码。

`player.js#trackCoverMarkup` 为分类、歌曲列表、搜索建议、队列、收藏和歌单复用同一套封面渲染逻辑。对同源封面接口中已有地址且通过域名校验的网易云图片，浏览器按原尺寸直接加载，失败后回到同源接口。播放器与迷你播放器也复用该地址选择，切歌会清除上一首的回退状态。全屏封面优先展示直链，取色继续使用原同源接口。直接加载的网易图片使用浏览器 HTTP 缓存。

普通搜索通过 `browser-provider.js#search` 优先查询 `/api/music/search`。该接口优先使用网易云目录，首批结果通常已包含封面 CDN 地址。站内请求最多等待 12.5 秒，失败后尝试从浏览器直连 GD 网易云目录，整页搜索由 `search-session.js` 以 15 秒为上限。Embeat 仍经访客网络独立补充。切换网易云回退路径时结果排序可能有差异，页面按来源与歌曲 ID 去重。

只提供封面 ID 的结果仍由 API 解析图片地址。Cloudflare Workers 用原生 `fetch` 下载并校验封面，失败响应不进入边缘缓存。外部目录、只有 ID 的封面和直连失败后的回退仍受上游网络影响。检查搜索首屏时记录歌名出现和封面显示两个时间点，分别定位目录查询和图片下载。

验证时运行 `npm test`、`npm run test:genre`、`npm run build:pages`，再用 Wrangler Pages 运行 `node scripts/verify-deployment.mjs <URL> --network`。从首页点分类、搜索歌曲并尝试播放，检查前几张图片、切歌及全屏封面。使用 [部署指南](../DEPLOY-GUIDE.md#回退) 退回上一版。

## 流派首批加载与发布验收

主页的 12 个流派保留原有搜索词、卡片与网易云来源。点开后最多同时查两个关键词，先返回的歌曲立即可点播，后续仅追加未显示的歌曲，最多 80 首。切换流派、关闭详情或离开发现页会取消剩余请求，失败结果不当作完整列表缓存。总耗时仍取决于上游响应，第一批之后的歌曲按批次完成顺序追加。

2026-11-18 用 ego lite 点击「流行乐」：v54 正式站约 10.4 秒后一次显示 80 首；新版本本地 Pages 连真实音源约 0.28 秒出现首批 20 首。两个运行环境不同，用于验证显示行为，不能当作生产提速倍数。

修改 `player.js` 的流派详情时，运行 `npm run test:genre` 和 `npm test`。浏览器验收从实际流派卡片进入，确认首批先出现、快速切换只显示当前流派、歌曲可播放。Pages 构建把同一个 Git SHA 写入首页和 API；`scripts/verify-deployment.mjs` 同时核对正式首页、预缓存首页、API 和既有网络检查，命令与回退见[部署指南](../DEPLOY-GUIDE.md#验收与排障)。Safari 真机验收另行记录。

## 封面与图片加载优化（v54）

首页 12 个流派卡片此前请求艺人全尺寸原图。同一张 IU 照片的 2500px 原图约 453,907 bytes，网易云 `640y640` 版本约 51,737 bytes，卡片图片字节减少约 88.6%；卡片仍使用原有裁切和样式。详情入口不带 `size` 时继续返回源分辨率。

`src/ChromaGrid.jsx` 为卡片请求 640px 并启用异步解码；`server-simple.js#/api/artist-photo` 只在收到尺寸参数时应用网易云 CDN 尺寸。在线 API 仍以 302 交付艺人图。Cloudflare Cache API 仅缓存白名单图片路由的有效图片响应和发往网易云图片 CDN 的艺人图 302，读写失败时回源。各变体按完整请求 URL 区分；搜索、播放、歌词和目录 JSON 不进入此缓存。

`service-worker.js` 将 `/api/cover`、`/api/music/cover`、`/api/artist-photo` 从目录 stale-while-revalidate 分流，不再命中后后台刷新。CacheStorage 仅保存带正 `public, max-age` 和 `Date` 的同源图片，按期限命中并回源；opaque 艺人图 302 和无期限的默认 SVG 不存入本地缓存，艺人图重复请求由 Worker 边缘缓存处理。冷请求先返回图片，缓存写入失败不会挡住网络响应。`index.html` 更新 Service Worker 注册版本以安装该策略，同时复用既有缓存，不删除本机缓存或个人资料。

本地验证：`npm test`（175 项 Node 测试、Pages 构建检查及播放器／动效脚本）；`node scripts/verify-deployment.mjs http://localhost:8793 --network`；Wrangler 本地 Worker 对同一封面复测显示 111ms→5ms、同一艺人 640px 图片 232ms→7ms，第二次 `CF-Cache-Status: HIT`；搜索连续两次未缓存。ego lite 本地 Pages 页面 12 张流派图全部解码为 640px 宽；CacheStorage 只留有明确期限的图片，艺人图重复加载由边缘缓存命中。这些时间来自本机，不代表生产环境或所有网络的延迟承诺。

后续更改：卡片像素预算从 `src/ChromaGrid.jsx` 的 `size=640` 修改；URL 尺寸上限及 CDN 主机验证在 `server-simple.js#sizedNeteaseCoverUrl`；Worker 缓存路由在 `cloudflare/worker.mjs#artworkPaths`；浏览器策略在 `service-worker.js` 图片 API 分支。运行 `npm test`、`npm run build:pages` 与真实 Wrangler Pages 网络检查。回退可还原这些文件及 `index.html` 注册版本；不需要数据迁移、环境变量或依赖安装。剩余风险：首次下载仍受用户网络、图片 CDN 与 Workers 冷启动影响；Cloudflare 每个边缘位置的缓存需该位置首次请求后预热；Safari 真机尚未单独验收。

| 阶段 | 状态 |
| --- | --- |
| 实现与本地验证 | 完成；`npm test` 175 项及真实 Wrangler 网络、ego lite 页面检查通过 |
| GitHub PR 与 CI | [PR #8](https://github.com/1981016893fty-pixel/ty-music/pull/8) 的 Web checks（push 和 pull_request）均通过，合并提交为 `4e406d0` |
| 生产发布 | 2026-11-18 已部署至 [ty-music.pages.dev](https://ty-music.pages.dev)，部署 ID 为 `97845808-f7ef-4e13-b7e3-13c355b190e8` |
| 线上验证 | 健康检查、并发网易云搜索、封面和音频 Range 206 通过。LAX 边缘实测艺人图 302 与封面 200 均命中缓存。ego lite 从旧版缓存刷新后进入主页，12 张流派图均以 640px 解码。Safari 实测待补。 |

生产回退版本为 v53，Pages 部署 ID 为 `ffec1ee8-a47b-4a20-a2e5-94dcbe501712`。按 [部署指南](../DEPLOY-GUIDE.md#回退) 操作。

## 工程质量审查入口

[2026-11-18 工程质量审查与最小整改候选](quality-audit.md)记录基线 `e109377` 的已复现缺陷、维护风险、验证边界及候选 A–E。候选 A–D 已按用户授权实施并通过本地验证；候选 E（F10 发布／页面契约）仍是后续维护风险。不能把局部审查和测试通过表述为全仓库认证。

## 工程质量修复（v53）

本轮实施审查候选 A–D（F1–F9），保留原首页 12 个分类、网易云保底＋Embeat 自动补充和原有动效参数，无新增依赖。

- 曲库：`player.js#libraryTrackSnapshot` 保护收藏／歌单引用元数据，仅裁剪最近 500 条非引用浏览资料；存储额度不足时仅重试必要资料，仍失败保留原快照并提示先导出。沿用旧 localStorage 格式，不清空或迁移用户数据；不能恢复已不存在的历史元数据。
- 播放：`beginPlaybackSelection` 统一取消、代次和音频所有权；本地数据库和播放 Promise 迟到不能覆盖新选择。探测、切歌、结束、错误和删除提交成功时释放 Blob，单曲循环／权限重试保留正在使用的资源。播放本地曲目追加而不覆盖既有队列，删除后同步移除普通及随机队列；切换随机后以当前歌曲 ID 定位。
- 本地资料：自动封面使用内嵌占位图，自动歌词不向在线服务发送文件名、歌手或专辑；手动点击歌手／专辑入口仍可能发起在线查询，不将其宣称为全离线模式。
- 传输：`buffered-request.cjs` 承担响应头、重定向和完整 body 的总截止时间，最多 5 次相对／绝对跳转，JSON 4 MiB、封面 8 MiB；超时、取消、截断及时销毁。长音频保持独立流式和 Range 路径。封面只接收受支持图片类型（含上游实际 `image/jpg`）及非空响应；歌词业务错误不缓存为空歌词，明确空歌词仍成功。
- 缓存：`bounded-cache.cjs` 仅缓存已完成值，LRU 最多 500 条；Workers 仍不共享跨请求进行中 I/O。
- Cover Flow：原弹簧／几何／倒影保留，收敛停 RAF，拖动／键盘／尺寸／数据／可见性变化唤醒；缓存脊节点，只更新可见及刚离开范围，退出释放监听和指针捕获。

维护这些入口后运行 `npm test`、`npm run build:pages`；本地真实 Worker 启动后执行 `node scripts/verify-deployment.mjs http://localhost:8788 --network`。后者联网检查并发搜索、封面、302 和 Range 206，受第三方网络影响；故障夹具不访问真实音源。新增回归入口为 `scripts/verify-player-lifecycle.mjs`、`verify-coverflow-lifecycle.mjs`、`verify-upstream-resilience.mjs`（后两者同目录）。缓存标记为 `20261118-quality-v53`／`ty-music-v53-quality`。

本地完整 `npm test` 通过 164 项 node:test、另 1 项 Pages 构建检查及既有播放器／动效脚本；真实 Workers 网络检查通过。独立复审发现并修正本地自动封面查询、队列覆盖与删除残留，补齐无 Content-Length 大响应和合法类型空图片夹具；聚焦复审 42 项通过且无新阻塞项。ego lite 通过首页 12 分类与网易云 Blinding Lights 实际起播（200.046 秒）。欢迎入口高层点击仍受工具节点失效影响，使用 DOM click 进入，不记作物理点击验收。

| 阶段 | 已核实状态 |
| --- | --- |
| 实现与本地验证 | 应用提交 `87739b7189f4b95eadf06abc5f26a0667c33d8e9`；完整测试及真实 Worker 网络检查通过 |
| 远端 Web CI | [分支 push](https://github.com/1981016893fty-pixel/ty-music/actions/runs/44278417711)、[PR](https://github.com/1981016893fty-pixel/ty-music/actions/runs/44278422406)、[合并后 main](https://github.com/1981016893fty-pixel/ty-music/actions/runs/44278691129) 均通过 |
| 已合并 | [PR #7](https://github.com/1981016893fty-pixel/ty-music/pull/7)，合并提交 `303ce37ae8a2e1e1b4cb566a3cfd768e4cb39444` |
| 已部署 | [ty-music.pages.dev](https://ty-music.pages.dev)，生产部署 `ffec1ee8-a47b-4a20-a2e5-94dcbe501712`；`/api/health` 确认合并提交，真实并发搜索、封面、音频 302／Range 206 通过 |
| 正式域名浏览器 | ego lite 保留旧 v52 缓存后正常刷新升级至 v53，12 个分类仍在；搜索返回 20 首基础结果，Blinding Lights／The Weeknd 实际播放 200.046 秒，封面加载、全屏双语歌词显示通过。此网络下未取得 Embeat 追加成功证据，基础搜索保持可用 |
| 桌面与 Safari | 本轮未安装测试新桌面包；构建状态见 [macOS](https://github.com/1981016893fty-pixel/ty-music/actions/runs/44278691133)／[Windows](https://github.com/1981016893fty-pixel/ty-music/actions/runs/44278691203)。Safari 真机和个人曲库迁移未验收 |

本次发布后的维护记录属于文档更新，不改变生产应用提交。回退可使用此前 v52 部署 `d9c14ce5-ad93-45ec-b23d-0c7055e6c466`，步骤见 [DEPLOY-GUIDE](../DEPLOY-GUIDE.md#回退)。

剩余范围：F10 清单／HTML 场景契约及桌面 CI 输入尚未统一；Safari 个人曲库迁移、真机帧率／温升和全部第三方目录未验证。Cover Flow 静止零调度是计算边界证据，不能据此保证整站零发热。Render 保留至 Safari 资料迁移验收完成，不将旧服务留存当作新站仍依赖 Render。

## Cloudflare 迁移（2026-11-18）

当前方案：Pages 静态前端＋同源 API Worker，不接入 InsForge，无服务端数据库。`scripts/build-pages.mjs` → `pages-dist/`，仅白名单公开文件，`cloudflare/worker.mjs` 复用 `server-simple.js#createServer({staticFiles:false})`。本地 Node 启动方式保留。部署、数据迁移与回退的权威步骤见 [DEPLOY-GUIDE](../DEPLOY-GUIDE.md)。

Workers 不跨请求共享进行中 I/O；仅保留已完成结果缓存，Embeat clock client 按独立操作创建。普通 Node 继续复用已有去重。音频默认302，`stream=1`保留 Range，断连销毁上游。构建使用 `process.getBuiltinModule` 避免 Pages 打包器的 HTTP shim，并以真实 runtime CI 防回归。此适配未引入新的运行时依赖。

`library-transfer.html/js` 为独立曲库备份入口，覆盖 localStorage 收藏／歌单／近期／专辑／歌曲来源元数据，以及 IndexedDB 中的本地音频。只读导出，导入预览后合并；旧条目优先，音频事务只添加。文件最多512MiB；大曲库保留原音频重新添加。localStorage 与音频数据库不是一个事务，部分失败会明确报告，不能声称全库原子迁移。各用户仍需在原浏览器执行迁移，ego lite 验收不代表 Safari 个人数据已迁移。

| 阶段 | 状态 |
| --- | --- |
| 已实现 | API-only 工厂、Worker、Pages 白名单构建、桌面 API 地址、迁移工具、v50 缓存标记 |
| 本地验证 | npm test：125项node:test、1项Pages构建检查与播放器／动效脚本通过；真实workerd搜索、302、Range206通过 |
| 远端CI | 应用提交2726f89的[Web checks](https://github.com/1981016893fty-pixel/ty-music/actions/runs/44239616058)通过，含真实Workers运行检查 |
| 正式部署 | [ty-music.pages.dev](https://ty-music.pages.dev)，部署502707f8，应用提交2726f89ff3ac1a6b5afb2565a4c08555ae0bd34e；生产并发搜索／封面／302／Range206通过；ego lite真实Blinding Lights起播，时长200.046秒；歌词API返回原词及译词，歌词UI未完成验证 |
| PR／合并 | [PR #6](https://github.com/1981016893fty-pixel/ty-music/pull/6) 已建立，合并状态以 PR 为准；文档提交735f463的 [Web checks](https://github.com/1981016893fty-pixel/ty-music/actions/runs/44242736241)通过。生产应用提交与文档提交分开记录 |
| Render／Safari曲库 | 旧站工具已随2726f89发布，[Render部署](https://dashboard.render.com/web/srv-d8psc5jsq97s738eemk0/deploys/dep-dbuitoojo6nc73a84h50)成功；[旧站导出](https://ty-music.onrender.com/library-transfer.html)可用。服务仍保留，AutoDeploy为Off；待Safari导入新站验收后退役 |

独立复审发现并已修复大音频Base64重复正则耗尽栈的问题，5MiB真实字节往返通过。浏览器下载、跨测试origin预览不写入、IndexedDB导入后音频字节一致已验证。Workers生产CPU／内存完整指标、Safari个人曲库和全部第三方目录尚未验证。

新运行时不再有 Render 的闲置休眠唤醒，但不能承诺零延迟、无限额度或所有音源均可用。当前迁移沿用v49动效修复，未新增整机温度或Safari帧率结论。已安装的旧桌面包仍引用旧 API，源码更新只影响后续构建。

## 首页流派入口修复（v51）

此前场景生命周期优化把 `chromaGridMount` 错绑到 `search`，而实际容器位于 `page-discover`，因此首页只显示“BROWSE BY GENRE”标题、12个分类被卸载。`src/mount.jsx` 已将该入口改回 `discover`，保留原有分类、视觉及 `loadGenreDetail` 回调，不将功能入口标为装饰元素。其余固定场景绑定已对照 HTML 所属页面复核，未发现第二处同类错配。

`scripts/verify-scenes.mjs` 执行真实挂载入口及分类组件，检查12个分类、切页／隐藏后恢复、减少动态效果下保留入口及详情回调；回归先出现0／12失败，修复后通过。完整 `npm test` 为126项node:test、Pages构建检查及既有播放器／动效脚本通过。缓存版本同步为 `20261118-genres-v51`／`ty-music-v51-genres`，升级后正常刷新即可，不清除个人曲库。PR和线上发布状态以本次交付链接及 `/api/health` 的实际提交为准，不能仅凭构建通过声称生产恢复。

## 正式入口导航修复（v52）

正式域名复现浏览器导航 `ERR_FAILED`，绕过Service Worker后HTTP首页正常。Pages将旧预缓存地址 `/index.html?v=…` 308到根路径，缓存实际 `redirected=true`；导航请求使用manual模式时，该响应会被浏览器拒绝。`service-worker.js` 改为预存canonical根路径、仅读取当前版本缓存、跳过已重定向响应，并在缓存或网络不可用时保留网络／离线HTML兜底。不清理localStorage、IndexedDB或用户曲库。

`verify-cache-policy.mjs` 检查重定向缓存、缓存不可用、网络不可用和双方不可用；`verify-deployment.mjs` 检查线上预缓存URL必须直接200。回归已先验证旧代码失败，再验证修复通过；完整测试128项node:test及Pages构建检查、既有播放器／动效脚本通过。操作入口和回退边界见 [部署与排障](../DEPLOY-GUIDE.md#验收与排障)。

应用提交 `20bc03d3f2e0b4807a6d20434e05c75e92502c33` 已部署至生产 `d9c14ce5`；[push CI](https://github.com/1981016893fty-pixel/ty-music/actions/runs/44261515903) 与 [PR CI](https://github.com/1981016893fty-pixel/ty-music/actions/runs/44261521721) 通过。ego lite在正式域名保留旧缓存复现失败后，验证自动升级至v52、根路径及带查询参数导航、普通刷新和进入主页、12分类与爵士80首；预缓存响应为200且 `redirected=false`。线上并发搜索、封面、音频302与Range206检查通过。Safari设备本身尚未复测；[PR #7](https://github.com/1981016893fty-pixel/ty-music/pull/7) 已推送修复，合并状态以PR为准。

## 入口与修改位置

默认 HTTP 服务为 `server-simple.js`，监听 `PORT`（默认 8899）。本地与其他服务隔离可用 `PORT=18899 npm start`。`npm start` 先运行 `build.mjs`，再启动服务；直接运行 `node server-simple.js` 只适合已经完成构建的场景。静态资源由 `static-files.cjs` 按需异步读取／压缩，不再于启动前同步预载。小文件原始字节与 gzip 共用 8 MiB LRU，上限 2 MiB 的单文件可进入缓存，较大文件带背压流式发送；相同文件首次并发请求合并，stat 版本变化会失效缓存。服务端源码修改后重启，前端源码修改后重新构建。

| 行为 | 维护入口 |
| --- | --- |
| 搜索上游、分页及 HTTP 状态 | `server-simple.js` |
| 静态资源、压缩、ETag 与路径边界 | `static-files.cjs` |
| 共用 Embeat 协议、时钟与签名 | `gd-embeat-core.js`；Node wrapper `gd-embeat.cjs` |
| 浏览器直连搜索、音频、歌词和封面 | `browser-provider.js` |
| GD 官方 HTTP/2 连接路由与会话释放 | `gd-transport.cjs` |
| 双源游标、取消、超时及去重 | `search-session.js` |
| 搜索 UI、队列与播放 | `player.js` |
| 离线资源、网络缓存 | `service-worker.js`、`index.html` |
| 场景生命周期 | `src/Scene.jsx`、`src/sceneStore.mjs`、`src/mount.jsx` |
| 动效帧调度、离屏与隐藏暂停 | `src/renderLoop.mjs` |
| 动效实现 | `src/ElectricBorder.jsx`、`src/GridDistortion.jsx` 等组件 |
| 按需动效模块与容错 | `src/sceneEffects.jsx` |
| 生成资源 | `build.mjs` → 入口脚本、样式、`assets/aurora/` 分块与清单 |

## 搜索契约与排障

两个搜索入口 `/api/search`、`/api/music/search` 接收 `keywords`、`limit`、`offset`、`source`，默认网易云。网页同时独立请求 `source=netease` 与 `source=embeat`，先展示网易首批，再追加成功的 Embeat；无手动切源。`search-session.js` 为每源保存独立游标、请求及 15 秒截止时间；补充失败只结束自身，不影响基础结果或下一页。Embeat 早到先暂存，基础首批成功或失败后释放，后续页只追加不重新排序。来源+原始 providerId 去重，不能仅凭标题或跨来源相同数字 ID 合并。

基础网易云按两个官方端点→GD 公开网易云目录顺序尝试，共用 12 秒预算、每次最多 4 秒；官方合法空结果直接返回，不以别的歌曲替换。GD 分页将 offset 换算为页与页内偏移，未知总数保持 `null`。Embeat 每次网站请求总预算 12 秒，含最多 4 秒校时与一次 401 后刷新重试；校时兼容 10 位 Unix 秒与 13 位毫秒，用单调时钟推进。新查询与清空同时取消两路，旧响应、异常与 finally 均不得修改新会话。补充失败下一次查询会重新尝试，不把一次不可用永久锁死。

这套规则按实际请求可用性运行，不检测 VPN。网页搜索优先从浏览器直连 GD，使用访问者当前网络；VPN 可能改变补充结果。网易直连失败回退服务端；Cloudflare 生产站的回退使用 Workers 出口。不能把本地“开 VPN 成功”当作线上可用证据，也不自动添加第三方代理或付费资源。

成功返回 `{songs,total,hasMore,nextOffset}`；Embeat `total` 保持 `null`，前端使用 `hasMore` 和 `nextOffset`，不能伪造总数。有效空结果为 200；无效参数为 400，上游错误通常为 502，限流可为 429，超时为 504。错误体使用适用的 `error`/`code`，不要绑定旧网易云错误码。封面和时长缺失不应丢弃真实歌曲，也不能把故障伪装成“无歌曲”。

搜索绕过前端内存缓存、桌面持久 API 缓存以及 service worker 缓存，响应使用 `no-store`。当前资源 URL 标记是 `20261118-quality-v53`，service worker 名称是 `ty-music-v53-quality`；`search-session.js` 在 `player.js` 前 defer 加载，已纳入静态路由、预缓存及桌面复制清单。以后更新须同步这些位置，并运行缓存与真实静态 HTTP 回归检查。

遇到故障先查看 `/api/health`，再查看请求状态、部署提交和日志的上游类别/耗时。健康检查通过不代表提供方可访问；分别核对 Workers 响应与上游状态。确认部署提交与 service worker 更新后重试，勿把清空整个浏览器缓存或站点数据作为默认修复。日志和共享材料不要包含原始用户查询、Cookie 或个人曲库。

## Embeat 协议维护与残余风险

GD 公开 `music-api.gdstudio.xyz` 接口不支持 Embeat；本项目使用 `music.gdstudio.xyz` 网站当前非文档协议，不代表官方稳定 API 或完整网站源码。默认网站版本为 `2026.11.11`；`GD_EMBEAT_VERSION` 只能覆盖网站版本字符串，不能替代签名器维护。当前修改版 MD5 的 `T[49]` 为 `0xB893382C`，所核对网站 `crc32.min.js` 的 SHA-256 为 `ed8dac33e9e79d70c5701bb9602cb66a0841c1fbfb0e46038579ba3dc6576da0`，来源保留在 `gd-embeat-core.js` 头部。

维护时先核对网站版本、脚本哈希和时钟接口变化；签名器修改须通过固定向量回归和独立实时验收，不能只改版本字符串就声明恢复。不记录或共享凭据、Cookie。夹具测试只能证明可控边界，不替代联网结果。

Embeat 搜索响应保留原始 `id` / `providerId`；客户端内部身份为 `embeat:` + 严格 URI 编码。`source`、`providerId`、`urlId`、`lyricId`、`picId`、`isrc` 随收藏/队列/最近播放保存，资源请求恢复原始 ID。维护标准化、序列化和旧曲库恢复时，应检查这些字段完整往返，不清空旧曲库规避兼容问题。

音频使用原始 `urlId` 请求网站 `types=url&source=embeat&br=999`，由提供方返回该曲最高可用音质；URL 缓存在服务端内存 5 分钟并合并并发请求。歌词独立使用原始 `lyricId` 请求 `types=lyric&source=embeat`，不等待音频。2026-11-17 实测 autosource 可能把“晴天 — 周杰倫”替换为其他同名歌曲，因此播放器不再调用该路径；不可用音频明确失败，不用模糊结果充数。Embeat 不提供下载或专辑目录；旧曲库保留。

Embeat 封面仅接受资源 ID，当前允许已核对的 `resources.tidal.com` 和网易图片主机；其他主机返回错误，扩展前先核对真实提供方回包。音频 URL 仅消费固定 GD 端点的返回值，不提供用户自定义远程 URL 代理；当前仍信任 GD 返回的公共音频域名，其 DNS 与重定向不是本次完整安全审计的覆盖范围。

本机直连网站域名出现 DNS 答案不一致及连接超时；不修改系统 DNS、代理或 TLS 校验。可设置 `GD_EMBEAT_CONNECT_HOST=music-api.gdstudio.xyz` 启用原生 HTTP/2 连接路由：TLS 连接到 GD 的官方主机，HTTP authority、路径、签名和资源来源仍为 `music.gdstudio.xyz` 网站。仅允许该值和 `music.gdstudio.xyz`；不允许自定义主机或 IP，也不跟随 API 重定向。该方式依赖 GD 当前同站点路由，若上游不再支持需重新核对；不能把它描述成公开 API 已支持 Embeat。

HTTP/2 同一客户端复用会话；gzip、br、deflate 响应先流式解压，再由现有响应上限检查解压后字节数。取消只关闭对应流，不中断其他请求；校时 HTTP 失败也必须取消响应体。校时故障日志仅记录状态、类型、编码和格式分类／长度，不记录响应正文、用户查询或签名。连接在响应头之前断开时最多重连一次，受原有总截止时间约束。空闲会话不阻止进程退出，30 秒空闲后关闭。2026-11-17 本地真实搜索“晴天 周杰伦”约 2.7 秒返回 Embeat 原曲，歌词及封面 200，音频地址 302；本地浏览器已验证原曲实际起播、时长约 269.747 秒、进度拖动至约 134.88 秒和歌词同步。

## 场景与流畅度

### 2026-11-17 动效负载修复

以下为新实现及本地测量，不代表线上已更新。远端 CI、合并与部署状态分别记录于“验证与交付状态”；既有生产搜索阻塞见后文。

| 问题 | 当前实现与维护位置 | 验证结果 |
| --- | --- | --- |
| 浏览页 Prism 全屏 Retina 画布持续运行 100 步光线步进 | `src/Prism.jsx` 在初始化和 resize 将实际画布限制在 500,000 像素、DPR 不超过 1；保留柔光背景的 CSS 尺寸、颜色及时间速度 | 同一 ego lite 窗口 1048×696、DPR 2：原画布 2096×1392，GPU timer 28 样本平均 40.319ms、p95 51.397ms；新画布 867×576，暖机后 45 样本平均 7.407ms、p95 12.110ms；均无 GPU disjoint。均值约减 82%，只代表该效果的 GPU 绘制耗时 |
| 小屏 `timeScale=0` 被 `|| 1` 转为持续动画 | 保留合法零值；静态模式初始化、resize 各按需重绘 | 真实组件夹具由 500 次绘制降为一次，resize 不再清空后停止显示 |
| 封面 ElasticMesh 静止仍做物理、法线、上传和绘制 | `src/ElasticMesh.jsx` 收敛后停止；指针、resize、图片完成和视觉参数可唤醒，归零阈值低于可见像素；迟到图片回调不访问已卸载资源 | 自动回归覆盖静置与交互收敛；真实浏览器静置 1 秒不再有 mesh draw 或属性上传 |
| 电流边框重复计算随机格点 | `src/ElectricBorder.jsx` 复用确定性格点值，缓存最多 8192 项；保持原噪声公式、640 段路径、颜色及速度 | 1800×500 夹具首帧全部 641 点与旧版完全相同；`Math.sin` 调用 51,304→2,096。真实浏览器后续 34 回调合计 87.4ms、平均约 2.57ms；旧版一次观测约 5.49ms，环境浮动，因此不将该 CPU 对照当作通用基准 |
| 局部动效离屏后仍运行、各自调度规则容易漂移 | `src/renderLoop.mjs` 为 Mesh、Prism、边框共用单 pending 帧、IntersectionObserver 与 document visibility 暂停／恢复；不引入新依赖 | 15 项真实组件行为回归覆盖离屏 invalidation、隐藏恢复、无 IntersectionObserver 兼容、卸载及迟到回调；恢复不重复订阅 |
| 紧凑布局仅降低一组 FloatingLines 线数 | `src/mount.jsx` 使用组件已支持的数字参数，三组均为 4；桌面仍各 6 | 使用现有组件取值契约；桌面视觉配置不变 |

继续添加局部图形效果时复用 `createRenderLoop(element, draw)`：`draw` 返回 `true` 才继续，`request()` 合并指针、尺寸或资源变化；卸载必须 `dispose()`，迟到异步回调先检查资源是否有效。静止画布 resize 后会丢失像素，必须请求重绘。背景像素预算与 CSS 尺寸分开维护，不通过缩小交互目标或统一限帧掩盖开销。

新缓存标记为 `20261117-motion-v46`／`ty-music-v46-motion`。新增验证入口已纳入 `npm test`，并保留原播放器、搜索、缓存、分包检查。完整本地 `npm test` 通过 92 项 node:test 及播放器／交互／旧动效检查；真实浏览器重测20首 Embeat 结果，晴天／周杰倫原曲起播、时长269.747秒。该成功仅属于本地连接配置。

**测量边界：** 当前只使用 ego lite，未对 Safari 做实机帧率认证。暖机后的浏览页测到 55 帧／约 2.1 秒、p95 帧间隔约 66.7ms；首页也仍有较低帧率，尽管静置网格绘制已停止且观察窗口无长任务。局部 GPU 耗时下降不能证明整站稳定 60fps。历史对照中仅 CSS 旋转色块也约 30fps，验收环境存在限制；仍需在实际使用设备上确认滚动、输入和音频交互。一次旧资源页面导航出现 renderer 无响应，同 Space 新页加载新资源后恢复，尚未明确归因，不能宣称已彻底修复。

本次独立审查覆盖新增调度器、三个相关效果及实际挂载点，未发现当前调用模式的新阻断问题。Prism 的未使用 `hover + noise=0` 模式仍有既有 leave/blur 不请求复位的风险；将来启用该模式前应补复位唤醒和对应测试。该提醒不影响当前 rotate 模式，不代表全仓库质量认证。


`Scene` 只挂载当前活动场景；页面隐藏时卸载场景，恢复显示后重新挂载。减少动态效果偏好会关闭标为装饰性的场景，保留功能界面。导航监听仅观察 `.page`、欢迎屏和全屏播放器的 class，不观察整个动画子树。全屏 GridDistortion 在波纹收敛到亚像素阈值后停止帧循环和纹理上传，实际指针位移、resize 或图片加载可唤醒；卸载后迟到的图片回调只释放资源。添加场景或动效时必须释放帧循环、GPU 资源、事件和观察器；指针动画只在相关区域激活，电流边框计算保持有界。

本轮进一步将场景资源改成 ESM 分包，`src/sceneEffects.jsx` 仅在活动场景首次打开时加载相应重型引擎，未打开场景不请求；局部错误边界隔离装饰模块加载失败，切离再进入场景会新建 lazy 实例尝试恢复。核心入口静态 import graph 从 2,139,169 字节降至556,727 字节（原始构建大小，约减 74%，不包含页面打开后按需下载的效果，不是 gzip 传输量或帧率指标）；测试预算为 900 KB。`assets/aurora/manifest.json` 必须与所有分块同步部署，CI 核对生成结果。播放器拖动使用操作时查询的滑块节点，避免模块晚加载时捕获空节点；晚挂载标题和音量／进度从现有状态回读。

service worker 返访导航优先返回已缓存外壳，并通过 `waitUntil` 等待后台刷新及缓存写入；搜索、音频、歌词与健康检查绕过缓存。安装时预缓存整个核心 ESM 图，未成功安装新缓存则保留可用旧 worker。返访外壳快显不等于后端免唤醒；首次访问无缓存时仍受平台休眠影响。2026-11-17 Render 控制台确认既有实例为 Free，并提示闲置后唤醒可能延迟 50 秒以上；本轮未等待一次完整闲置周期测量实际冷唤醒，不创建保活定时器，不升级付费。

2026-11-17 本轮 ego lite 搜索页 4 轮首页↔浏览切换后画布均稳定为 3；3 秒观测 88 帧、p95 帧间隔约 50.1ms，长任务为零。该结果未证明总体帧率提高。全屏仅保留其场景画布，原曲歌词与拖动同步可用；新 GridDistortion 在真实浏览器两次 450ms 静置窗口均无绘制，指针移动后观测到 10 次绘制并最终再次停止。一次浏览器全屏操作后出现渲染器无响应，刷新后可恢复，暂未复现和归因；不能将其当作已解决。

自动测试能验证状态切换和资源循环边界，不能代替实际设备上的视觉或帧率测量；本次文档不承诺 60fps。以下为切换 Embeat 前的 2026-11-16 历史 ego lite 实测（1060×708、DPR 2），其中 60 条结果/截图不能作为新 Embeat 20 条搜索验收：首页隐藏的 GridScan/全屏背景已无画布或 draw call；此前 GridScan 约 2538 次 draw/5 秒。边框回调从约 15.4ms/次降至约 2.2ms/次（6 秒合计约 364ms）；浮动线条与 aurora 背景限制为 1× 像素密度、最高 30 次绘制/秒；aurora 仅用于收藏/详情页，首页原本由 CSS 隐藏此图层，因此不挂载。搜索“周杰伦”显示 60 首，连续切词不被旧响应覆盖；搜索时隐藏探索介绍区，结果直接出现在输入框下方。开启减少动态效果后画布为零，关闭后恢复。最终独立审查发现并修正了 aurora 场景与 CSS 可见性不匹配，浏览器复核确认首页没有该画布、收藏页背景可见、搜索仍返回 60 首。修复复审未发现新的可执行问题。

本机首页总体 rAF 多次测量约 26–29 次/秒、p95 间隔约 50ms，未验证到总体帧率提高；暂停全部脚本动画、画布及滤镜的隔离测量仍约 29 次/秒，空白页约 60 次/秒，但仅有一个 CSS 旋转色块的独立对照页也约 29.8 次/秒，显示当前验收环境对有视觉更新页面存在约 30 帧限制；不能从该环境认证 Safari 的实际帧率。3 秒追踪中主线程帧回调合计约 239ms，合成 Draw 合计约 1079ms；这只用于指明下一轮分析方向，不等于证明某一滤镜是根因。不可用局部 CPU 改善宣称卡顿完全解决。用户主要使用 Safari，本次只有 Chromium/ego lite 浏览器验证，Safari 实机帧率与线上完整交互效果尚未验证。

### v49 持续运行负载优化（2026-11-17）

保持现有颜色、光效形状、运动速度及电流边框最多 640 段采样。本轮只修改 `SpecularButton.jsx`、`ShinyText.jsx`、`ElectricBorder.jsx` 和 `electricBorderNoise.mjs` 的计算／生命周期；没有引入依赖，也未降低背景分辨率或迭代次数。

- 电流边框在 resize 时缓存静态路径、空间格点及 smoothstep 权重，每帧只推进相邻的时间行；时间跳变和反向播放重新取正确行，格点缓存仍有 8192 项上限。路径与噪声分开维护，修改噪声公式时先运行数值和闭合回归。旧新真实组件的一次差分覆盖不同尺寸、速度及多个时间点，坐标最大绝对差约 `2.28e-13`；独立复审另对照 32,494 个噪声值，误差约 `1.11e-16`。同一个 1800×500 测试窗口 60 ticks 内，重复 floor 操作由 512,800 降为 320，绘制次数一致；这不是总 CPU／功耗降幅。
- 按钮复用 `renderLoop.mjs`，离屏／隐藏暂停，非自动高光收敛后停止；颜色、半径等静态 uniform 仅在尺寸／属性变化时重算。关闭 `followMouse` 只关闭角度跟随，保留接近亮度响应。卸载释放 GPU context、观察器和事件。
- 文字扫光改用原生 Web Animations 时间轴，保留方向、往返、末端停留及 hover 暂停；隐藏、离屏、减少动态效果时暂停，恢复保留进度。文字与高光颜色相同时不创建视觉上无变化的动画。`background-position` 仍需浏览器绘制，不能称为纯 GPU 合成。卸载取消时间轴并忽略迟到观察器回调；修改 keyframes 时检查 150%→-50% 端点、往返和 delay 时序。

本地 ego lite 同一页面观测：首页 6 秒回调 CPU 合计约 404ms→247ms，两个按钮分别绘制 99→107 次，背景均为 96 次；搜索页 5 秒回调合计约 183ms→28ms，新版本该次两个 WebGL 元素各绘制 144 次。该计数带相同探针开销，时刻和外部 GPU 负载不同，只证明当次脚本负担减少，不代表系统温度、功耗或总体帧率同比改善。Prism GPU 代数试验的耗时收益不稳定，因此保留原 shader。本机其它应用同时占用 GPU；Safari 实机温度／帧率未测，不承诺消除全部发热。

生命周期回归新增高光静置／唤醒、离屏／隐藏、原生扫光时序、同色跳过和卸载迟到回调等边界；将旧源码字符串匹配改为实际缓存采样器的周期闭合检查。完整本地 `npm test` 118/118 node:test 以及播放器／交互／边框／网格检查通过，前端构建通过。本地真实页面仍显示网易云20首＋Embeat20首，Embeat 晴天原曲 readyState=4、paused=false、duration=269.747秒。连续切换首页／浏览页10轮，再静置约60秒，四次观察均保持首页5个画布及2个有效原生扫光，没有观察到数量增长；这不是完整的内存或温度长测。工程复审修复角度跟随与迟到回调两项回归后，直接相关模块未发现新的阻断问题；不代表全仓库认证。

当前阶段：已实现、本地验证通过，应用提交 `7824f265fae6c0cdc9eb79224c403086fe8acb72` 的 [push CI](https://github.com/1981016893fty-pixel/ty-music/actions/runs/44079563111) 与 [PR CI](https://github.com/1981016893fty-pixel/ty-music/actions/runs/44079952839) 均通过。[Render 部署 dep-dbu47eu7bikc7388ln1g](https://dashboard.render.com/web/srv-d8psc5jsq97s738eemk0/deploys/dep-dbu47eu7bikc7388ln1g) 已确认 Live，生产 `/api/health` 返回上述应用提交与 Node 22.22.2。[PR #5](https://github.com/1981016893fty-pixel/ty-music/pull/5) 记录维护说明的后续检查与实际合并状态；应用部署与文档提交分开记载，AutoDeploy 保持关闭。

生产页面未绕过 service worker 或清除资料，普通刷新更新至 `20261117-thermal-v49`。实际搜索仍返回网易云20首＋Embeat20首，点击 Embeat 晴天原曲起播，readyState=4、paused=false、duration=269.747秒；验收后暂停。阻断 `music.gdstudio.xyz` 后搜索林俊杰仍返回20首网易云，基础及补充加载结束、无错误；随后解除阻断。首页实际文字扫光为原生 `Animation`，同色桌面入口无文字时间轴。欢迎页原生自动点击发生工具节点断开／坐标命中偏移，程序化按钮点击可正常进入，因此不把该入口的完整原生点击链路记为通过。Safari 发热与帧率、长时间功耗仍未实测。回退可部署上一应用提交 `e4f4e9421b6bc7697a35824be16c694f2b6e9395`；保留浏览器曲库，正常 service worker 更新后刷新，不清除站点数据。

## 数据、备份与删除边界

网页搜索与资源优先直连固定 GD 主机，失败时使用适用的同源兼容路径；当前 `server-simple.js` 没有应用账号系统或持久曲库数据库。基础关键词先发送至 GD 公开网易云目录，失败时发送至本站及网易云／GD；补充关键词直接发送至 GD 音乐台，第三方可见访问者出口 IP；Embeat 音频、歌词、封面向 GD 发送对应的原始资源 ID，不再向 autosource 发送标题等元数据。音频 URL 缓存在服务端内存，收藏等个人数据仍在本地。其他封面、歌词、音频由各自路径请求外部服务。外部服务自己的访问日志、保留期限及授权规则未核实。

当前浏览器 origin 的 `localStorage` 使用 `melodybox_fav`（收藏）、`melodybox_pl`（歌单）、`melodybox_rec`（最近播放）、`melodybox_album_fav`、`melodybox_tracks` 与 `melodybox_album_<ID>`；布局还有 `ty-sidebar-collapsed`、`ty-player-collapsed`。桌面目录缓存前缀为 `ty-music-api-cache:`。本地音频存储在 IndexedDB 数据库 `melodybox_local` 的 `tracks` 对象仓库，不是服务器备份。端口或域名变化会改变浏览器存储 origin。

升级通常保留这些数据；回归测试不应删除真实浏览器资料。清除站点数据、删除 IndexedDB 或卸载桌面端可能丢失个人内容。需要迁移/备份时先保留原始音频，并单独导出/备份相关浏览器存储，再验证恢复。当前 `library-transfer.html` 工具可导出上述曲库元数据和完整本地音频，经预览后合并导入；布局、离线缓存及桌面目录缓存不迁移。工具已通过合成曲库与5MiB音频往返测试，个人 Safari 曲库仍需实际验收。不得把删除全部浏览器资料当成缓存排障步骤。

## 验证与交付状态

### 当前双源版本（2026-11-17）

网易云保底与 Embeat 自动补充已实现；本地完整测试为 105/105 node:test，加播放器、来源身份、交互及既有动效检查通过，前端构建、静态分发与 README 链接审计通过。独立复审覆盖双源会话、GD 网易云备用链路及失败响应体释放，未发现本次改动的阻断问题。新脚本没有引入依赖；搜索状态集中在 `search-session.js`，资源身份与播放保持现有入口。

ego lite 的 v47 真实页面搜索“周杰伦”返回网易云 20 条与 Embeat 20 条，先基础后补充；本次网络资源耗时约 255ms 与 3.3s，仅代表该次本地网络。快速从“陈奕迅”切换“晴天 周杰伦”后显示最后查询，Embeat 原曲“晴天／周杰倫／葉惠美”保留独立身份，网易同名翻唱未被替换。欢迎页高层点击受验收工具节点失效影响，本轮以应用已有入口进入，不能将其记为欢迎按钮点击验收通过。

同一页面通过 CDP 阻断 `source=embeat` 后搜索“林俊杰”，仍显示 20 条网易云结果、补充为零且加载结束；解除阻断后新查询恢复 40 条双源结果。此前尝试在页面替换 fetch 未覆盖已捕获的会话传输，因此不把那次尝试作为失败隔离证据。分页、15 秒截止与忽略 abort 的传输边界另由自动测试覆盖。

PR #2 已合并为 `84b2e2b`，[push CI](https://github.com/1981016893fty-pixel/ty-music/actions/runs/44051046088) 与 [PR CI](https://github.com/1981016893fty-pixel/ty-music/actions/runs/44053169845) 通过。Render 部署 `dep-dbu1lh6c6qcc73esubu0` 已 Live，健康提交 `66c00e6`；但实际服务端搜索仍失败：官方网易云 code=-462、GD 网易云403、Embeat 校时403。部署成功不代表搜索恢复。

v48 浏览器直连修复已通过 [PR #3 的两项 CI](https://github.com/1981016893fty-pixel/ty-music/pull/3/checks)，[PR #3](https://github.com/1981016893fty-pixel/ty-music/pull/3) 已合并为 `4183bc3`。Render 部署 `dep-dbu31e0u01pc73dh6gp0` 于 2026-11-17 18:48:41 GMT+8 显示 Live；健康检查确认运行提交 `e4f4e9421b6bc7697a35824be16c694f2b6e9395`、Node `22.22.2`、基础源 `netease` 与补充源 `embeat`。后续仅文档更新不触发重新部署，应用提交与文档提交分别记录。

浏览器与 Node 共用签名核心，不新增依赖；直连使用 `credentials: 'omit'` 与 `cache: 'no-store'`，只请求固定 GD 主机。音频在用户点击内同步启动原同源代理路径，以保持 Safari 播放许可；网页同时按原 urlId 直连解析，代理尚未实际播放时切到直连结果。代理已实际播放则不打断；桌面保持同步 stream=1。歌词按 lyricId 独立解析，字面换行规范化；封面代理失败按同源 picId 直连解析。切歌取消旧解析，并以递增代次保护同一首重复点击；旧播放回调不再清空新歌词。复审发现的 Embeat CDN 图片失败后跨目录猜封面已修复，失败仅显示默认图标；同步媒体调用与图片二次失败都有回归覆盖。Safari 真机首次点击仍待实际验证。

本轮111/111 node:test 与播放器、交互、拖动和动效检查通过；前端构建与桌面复制通过。ego lite 真实 v48 页面搜索周杰伦返回20条网易云加20条Embeat，资源记录确认两路均从浏览器直接请求。阻断音乐台后搜索林俊杰仍返回20条网易云、加载结束；解除阻断后可重新尝试。此前一次校时超时及网易直连失败后回退20条也已观察到，故不保证上游持续可用。另实测 Embeat 晴天／周杰倫原曲资源：歌词1061字、封面解析为 Tidal 图片，点击后 audio.readyState=4、paused=false、duration=269.747秒，已暂停。只证明当次网络与该曲，不代表全目录可用。

**生产 v48 已通过当次真实页面搜索和媒体验收。** 未绕过 service worker、未清除站点资料，普通刷新更新至 v48 后，搜索“晴天 周杰伦”返回网易云20首与Embeat20首；两路浏览器请求耗时约1.90秒与1.82秒，仅代表当次网络。点击 Embeat 原曲 `5pIcwtJYNJx93l420oR2Vm` 后实际起播，`readyState=4`、`paused=false`、时长269.747秒；原曲 Tidal 封面已加载。通过应用已有全屏入口加载39行歌词，拖动进度到166.55秒后仍可播放，对应高亮“消失的下雨天 我好想再淋一遍”。阻断 `music.gdstudio.xyz` 后搜索“林俊杰”仍返回20首网易云，基础及补充加载均结束、无错误；验收后已解除阻断并暂停音频。欢迎按钮及全屏入口的完整点击链路未在此次自动化中验证；Safari 实机首次点击、帧率、无 VPN 的真实网络及全目录可用性仍未认证。

```sh
npm ci
npm test
npm run build:aurora
git diff --exit-code -- soft-aurora-react.js soft-aurora-react.css assets/aurora
test -z "$(git ls-files --others --exclude-standard -- assets/aurora)"
```

最后一个命令应在生成资源已提交且与源码同步时无差异退出；首次更新源码后应先审阅并提交预期的生成资源。默认测试不访问真实音乐上游，fork 子进程显式清空 `GD_EMBEAT_CONNECT_HOST`，避免继承 Render 配置后绕开夹具。发布前另以 `GD_EMBEAT_CONNECT_HOST=music-api.gdstudio.xyz npm test` 验证生产变量不会污染测试；`npm run test:data` 另行验证联网数据。CI 在 PR 与分支推送上使用 Node.js 22，依次安装锁定依赖、测试、构建及检查生成资源同步；既有桌面工作流独立保留。

### 历史排障记录（以下不代表当前线上状态）

Embeat 默认搜索与资源路由曾在本地实现；2026-11-16 完整 `npm test` 通过（49 个 node:test 用例、Embeat 身份与交互回归及三项既有检查），构建与生成资源同步通过。已修复外部元数据 HTML 属性引号转义、歌手页面/分页/头像简介的过期响应覆盖，以及协议响应取消等待和深分页边界。Embeat 歌词单次前端预算 25 秒，失败后不会模糊查询其他目录；歌手页使用搜索相关性顺序，不将其宣称为发行时间排序。此前搜索/性能版本已完成本地自动测试与构建；8 轮导航搜索页画布稳定为 3，3 轮全屏进出和 Cover Flow 生命周期通过，强制 502 后恢复 60 首。这些是旧版本历史证据，不代表新 Embeat 音频、歌词或 20 条搜索界面已验收。Safari 帧率仍待验收。

本次 Embeat 版本另经 ego lite 页面检查：本地页面可打开，搜索请求超时时结束加载并显示失败，不显示为零结果；探索区正确收起，默认标签为 Embeat，无手动切源控件。一次刷新报告渲染器无响应，关闭该任务页并在同一 Space 新建页面后，正常动效模式加载/刷新成功，尚未确定单次异常根因。这不能替代真实成功结果、音频、歌词或 Safari 流畅度验收。独立审查发现的问题由主代理修复并回归验证，审查范围限本次改动与直接调用方。

动效提交 `7496567` 已通过两项 [Web checks](https://github.com/1981016893fty-pixel/ty-music/actions/runs/44043737345)，[PR #1](https://github.com/1981016893fty-pixel/ty-music/pull/1) 已合并为 `efaef0d`。后续双源搜索变更沿用部署分支 `codex/deploy-embeat-search`，本地验证与远端发布分别确认。此前初版 `2ac858d` 在 Render 因测试继承生产传输变量而构建失败，隔离问题已修复。性能提交 `a4e8dfa` 的 [CI](https://github.com/1981016893fty-pixel/ty-music/actions/runs/44022861429) 与部署通过；传输修复 `4f513a0582b60c8ffde4f447e7694af6d4a0be13` 已通过 [CI](https://github.com/1981016893fty-pixel/ty-music/actions/runs/44024742320)，Render 部署 `dep-dbtue1m7bikc73fp4rp0` 已 Live。后续标准 fetch 配置部署 `dep-dbtugb3l550s739d6mu0` 也已 Live，健康检查确认同一提交、Node 22.22.2 和旧默认 Embeat。

**当时的服务端生产搜索未通过验收。** 本地同代码返回20首；Render 经网站主机 HTTP/2 的校时日志明确为 HTTP 403、`text/html; charset=UTF-8`、无内容编码。切换 API 连接主机及标准 fetch 后仍有 `GD_CLOCK_ERROR`；不能把这一错误解释为 Render 冷启动、压缩错误或无歌曲。已确认并修复的压缩处理与失败响应流释放问题是独立缺陷，77个 node:test、播放器／动效检查和生产构建均通过，独立复审未发现阻止提交的问题，但并未消除生产上游拒绝。后续 v48 网页直连的生产成功证据见上方当前状态；服务端回退的可用性仍受 Render 出口与上游规则影响。

线上静态清单及3个核心模块、v45 worker 均可访问；hash 分块为 JavaScript MIME 和 immutable 缓存，条件请求返回304。浏览器搜索失败会结束加载并显示错误，不伪装为空结果。线上原曲播放、拖动和歌词同步因搜索阻塞尚未完成本轮验收，本地成功证据不能替代生产结果。

此前确认 GD 网站校时对该 Render 运行环境 HTTP 拒绝；是否连带拒绝 `/api.php` 尚未取得探针结果，不能扩大为“GD 封禁所有 Render IP”。一次临时探针配置保存报 `Failed to fetch (api.render.com)`，没有取得探针结果。2026-11-17 后续控制台恢复，重新读取实际 Start Command 为 `node server-simple.js`，Auto-Deploy 为 Off，无需修复启动命令。新规则将网易云作为基础、Embeat 按实际可用性补充；仍不得引入第三方代理、付费升级或新建资源。

既有 Render Free 服务部署分支已设为上述任务分支，Auto-Deploy 为 Off（手动发布），`NODE_VERSION=22.22.2` 已保存；最后确认上线的 `GD_EMBEAT_CONNECT_HOST` 为空，使用标准 fetch。生产连接入口需在生产环境单独验证，不可直接套用本机网络绕行配置。构建命令为 `npm ci --include=dev && npm test && npm run build:aurora`；启动 `node server-simple.js`，健康检查 `/api/health`。健康响应包含 `commit`、`node`、`searchSource`，自身不访问 GD。操作步骤及后续真实发布状态见[部署指南](../DEPLOY-GUIDE.md)。

回退时由维护者使用 `git revert <本次PR提交>` 保留历史，再运行测试和构建、提交生成资源；部署所有者按既有授权流程重新部署并核对健康、搜索、播放和个人曲库。不要使用强推或硬重置覆盖其他改动。第三方服务、媒体及依赖的授权/分发条件需要各自核实，当前没有替代权利人的许可声明。
