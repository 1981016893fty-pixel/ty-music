# TY Music 维护指南

## 入口与修改位置

默认 HTTP 服务为 `server-simple.js`，监听 `PORT`（默认 8899）。本地与其他服务隔离可用 `PORT=18899 npm start`。`npm start` 先运行 `build.mjs`，再启动服务；直接运行 `node server-simple.js` 只适合已经完成构建的场景。静态资源由 `static-files.cjs` 按需异步读取／压缩，不再于启动前同步预载。小文件原始字节与 gzip 共用 8 MiB LRU，上限 2 MiB 的单文件可进入缓存，较大文件带背压流式发送；相同文件首次并发请求合并，stat 版本变化会失效缓存。服务端源码修改后重启，前端源码修改后重新构建。

| 行为 | 维护入口 |
| --- | --- |
| 搜索上游、分页及 HTTP 状态 | `server-simple.js` |
| 静态资源、压缩、ETag 与路径边界 | `static-files.cjs` |
| Embeat 网站协议、时钟与签名 | `gd-embeat.cjs` |
| GD 官方 HTTP/2 连接路由与会话释放 | `gd-transport.cjs` |
| 搜索 UI、取消与超时 | `player.js` |
| 离线资源、网络缓存 | `service-worker.js`、`index.html` |
| 场景生命周期 | `src/Scene.jsx`、`src/sceneStore.mjs`、`src/mount.jsx` |
| 动效实现 | `src/ElectricBorder.jsx`、`src/GridDistortion.jsx` 等组件 |
| 按需动效模块与容错 | `src/sceneEffects.jsx` |
| 生成资源 | `build.mjs` → 入口脚本、样式、`assets/aurora/` 分块与清单 |

## 搜索契约与排障

两个搜索入口 `/api/search`、`/api/music/search` 接收 `keywords`、`limit`、`offset`，默认使用 Embeat 综合搜索，无手动切源操作。显式 `source=netease` 仅保留旧精选/新歌内部兼容，不是默认搜索回退。Embeat 每次网站请求的总预算为 12 秒，含最多 4 秒时钟同步与一次 401 后刷新重试；前端搜索预算为 15 秒。校时兼容当前返回的 10 位 Unix 秒与旧 13 位毫秒，归一到毫秒后用单调时钟推进。新增查询取消旧请求，旧响应不得覆盖新查询，翻页绑定当前查询代次。

成功返回 `{songs,total,hasMore,nextOffset}`；Embeat `total` 保持 `null`，前端使用 `hasMore` 和 `nextOffset`，不能伪造总数。有效空结果为 200；无效参数为 400，上游错误通常为 502，限流可为 429，超时为 504。错误体使用适用的 `error`/`code`，不要绑定旧网易云错误码。封面和时长缺失不应丢弃真实歌曲，也不能把故障伪装成“无歌曲”。

搜索绕过前端内存缓存、桌面持久 API 缓存以及 service worker 缓存，响应使用 `no-store`。当前资源 URL 标记是 `20261117-performance-v45`，service worker 名称是 `ty-music-v45-performance`；以后更新须同步 `index.html`、预缓存列表与 `CACHE_NAME`，并运行缓存回归检查。

遇到故障先查看 `/api/health`，再查看请求状态、部署提交和日志的上游类别/耗时。健康检查通过不代表提供方可访问；Render 可能冷启动。确认服务重启与 service worker 更新后重试，勿把清空整个浏览器缓存或站点数据作为默认修复。日志和共享材料不要包含原始用户查询、Cookie 或个人曲库。

## Embeat 协议维护与残余风险

GD 公开 `music-api.gdstudio.xyz` 接口不支持 Embeat；本项目使用 `music.gdstudio.xyz` 网站当前非文档协议，不代表官方稳定 API 或完整网站源码。默认网站版本为 `2026.11.11`；`GD_EMBEAT_VERSION` 只能覆盖网站版本字符串，不能替代签名器维护。当前修改版 MD5 的 `T[49]` 为 `0xB893382C`，所核对网站 `crc32.min.js` 的 SHA-256 为 `ed8dac33e9e79d70c5701bb9602cb66a0841c1fbfb0e46038579ba3dc6576da0`，来源保留在 `gd-embeat.cjs` 头部。

维护时先核对网站版本、脚本哈希和时钟接口变化；签名器修改须通过固定向量回归和独立实时验收，不能只改版本字符串就声明恢复。不记录或共享凭据、Cookie。夹具测试只能证明可控边界，不替代联网结果。

Embeat 搜索响应保留原始 `id` / `providerId`；客户端内部身份为 `embeat:` + 严格 URI 编码。`source`、`providerId`、`urlId`、`lyricId`、`picId`、`isrc` 随收藏/队列/最近播放保存，资源请求恢复原始 ID。维护标准化、序列化和旧曲库恢复时，应检查这些字段完整往返，不清空旧曲库规避兼容问题。

音频使用原始 `urlId` 请求网站 `types=url&source=embeat&br=999`，由提供方返回该曲最高可用音质；URL 缓存在服务端内存 5 分钟并合并并发请求。歌词独立使用原始 `lyricId` 请求 `types=lyric&source=embeat`，不等待音频。2026-11-17 实测 autosource 可能把“晴天 — 周杰倫”替换为其他同名歌曲，因此播放器不再调用该路径；不可用音频明确失败，不用模糊结果充数。Embeat 不提供下载或专辑目录；旧曲库保留。

Embeat 封面仅接受资源 ID，当前允许已核对的 `resources.tidal.com` 和网易图片主机；其他主机返回错误，扩展前先核对真实提供方回包。音频 URL 仅消费固定 GD 端点的返回值，不提供用户自定义远程 URL 代理；当前仍信任 GD 返回的公共音频域名，其 DNS 与重定向不是本次完整安全审计的覆盖范围。

本机直连网站域名出现 DNS 答案不一致及连接超时；不修改系统 DNS、代理或 TLS 校验。可设置 `GD_EMBEAT_CONNECT_HOST=music-api.gdstudio.xyz` 启用原生 HTTP/2 连接路由：TLS 连接到 GD 的官方主机，HTTP authority、路径、签名和资源来源仍为 `music.gdstudio.xyz` 网站。仅允许该值和 `music.gdstudio.xyz`；不允许自定义主机或 IP，也不跟随 API 重定向。该方式依赖 GD 当前同站点路由，若上游不再支持需重新核对；不能把它描述成公开 API 已支持 Embeat。

HTTP/2 同一客户端复用会话；gzip、br、deflate 响应先流式解压，再由现有响应上限检查解压后字节数。取消只关闭对应流，不中断其他请求；校时 HTTP 失败也必须取消响应体。校时故障日志仅记录状态、类型、编码和格式分类／长度，不记录响应正文、用户查询或签名。连接在响应头之前断开时最多重连一次，受原有总截止时间约束。空闲会话不阻止进程退出，30 秒空闲后关闭。2026-11-17 本地真实搜索“晴天 周杰伦”约 2.7 秒返回 Embeat 原曲，歌词及封面 200，音频地址 302；本地浏览器已验证原曲实际起播、时长约 269.747 秒、进度拖动至约 134.88 秒和歌词同步。

## 场景与流畅度

`Scene` 只挂载当前活动场景；页面隐藏时卸载场景，恢复显示后重新挂载。减少动态效果偏好会关闭标为装饰性的场景，保留功能界面。导航监听仅观察 `.page`、欢迎屏和全屏播放器的 class，不观察整个动画子树。全屏 GridDistortion 在波纹收敛到亚像素阈值后停止帧循环和纹理上传，实际指针位移、resize 或图片加载可唤醒；卸载后迟到的图片回调只释放资源。添加场景或动效时必须释放帧循环、GPU 资源、事件和观察器；指针动画只在相关区域激活，电流边框计算保持有界。

本轮进一步将场景资源改成 ESM 分包，`src/sceneEffects.jsx` 仅在活动场景首次打开时加载相应重型引擎，未打开场景不请求；局部错误边界隔离装饰模块加载失败，切离再进入场景会新建 lazy 实例尝试恢复。核心入口静态 import graph 从 2,139,169 字节降至556,727 字节（原始构建大小，约减 74%，不包含页面打开后按需下载的效果，不是 gzip 传输量或帧率指标）；测试预算为 900 KB。`assets/aurora/manifest.json` 必须与所有分块同步部署，CI 核对生成结果。播放器拖动使用操作时查询的滑块节点，避免模块晚加载时捕获空节点；晚挂载标题和音量／进度从现有状态回读。

service worker 返访导航优先返回已缓存外壳，并通过 `waitUntil` 等待后台刷新及缓存写入；搜索、音频、歌词与健康检查绕过缓存。安装时预缓存整个核心 ESM 图，未成功安装新缓存则保留可用旧 worker。返访外壳快显不等于后端免唤醒；首次访问无缓存时仍受平台休眠影响。2026-11-17 Render 控制台确认既有实例为 Free，并提示闲置后唤醒可能延迟 50 秒以上；本轮未等待一次完整闲置周期测量实际冷唤醒，不创建保活定时器，不升级付费。

2026-11-17 本轮 ego lite 搜索页 4 轮首页↔浏览切换后画布均稳定为 3；3 秒观测 88 帧、p95 帧间隔约 50.1ms，长任务为零。该结果未证明总体帧率提高。全屏仅保留其场景画布，原曲歌词与拖动同步可用；新 GridDistortion 在真实浏览器两次 450ms 静置窗口均无绘制，指针移动后观测到 10 次绘制并最终再次停止。一次浏览器全屏操作后出现渲染器无响应，刷新后可恢复，暂未复现和归因；不能将其当作已解决。

自动测试能验证状态切换和资源循环边界，不能代替实际设备上的视觉或帧率测量；本次文档不承诺 60fps。以下为切换 Embeat 前的 2026-11-16 历史 ego lite 实测（1060×708、DPR 2），其中 60 条结果/截图不能作为新 Embeat 20 条搜索验收：首页隐藏的 GridScan/全屏背景已无画布或 draw call；此前 GridScan 约 2538 次 draw/5 秒。边框回调从约 15.4ms/次降至约 2.2ms/次（6 秒合计约 364ms）；浮动线条与 aurora 背景限制为 1× 像素密度、最高 30 次绘制/秒；aurora 仅用于收藏/详情页，首页原本由 CSS 隐藏此图层，因此不挂载。搜索“周杰伦”显示 60 首，连续切词不被旧响应覆盖；搜索时隐藏探索介绍区，结果直接出现在输入框下方。开启减少动态效果后画布为零，关闭后恢复。最终独立审查发现并修正了 aurora 场景与 CSS 可见性不匹配，浏览器复核确认首页没有该画布、收藏页背景可见、搜索仍返回 60 首。修复复审未发现新的可执行问题。

本机首页总体 rAF 多次测量约 26–29 次/秒、p95 间隔约 50ms，未验证到总体帧率提高；暂停全部脚本动画、画布及滤镜的隔离测量仍约 29 次/秒，空白页约 60 次/秒，但仅有一个 CSS 旋转色块的独立对照页也约 29.8 次/秒，显示当前验收环境对有视觉更新页面存在约 30 帧限制；不能从该环境认证 Safari 的实际帧率。3 秒追踪中主线程帧回调合计约 239ms，合成 Draw 合计约 1079ms；这只用于指明下一轮分析方向，不等于证明某一滤镜是根因。不可用局部 CPU 改善宣称卡顿完全解决。用户主要使用 Safari，本次只有 Chromium/ego lite 浏览器验证，Safari 实机帧率与线上完整交互效果尚未验证。

## 数据、备份与删除边界

默认服务转发外部目录/媒体请求；当前 `server-simple.js` 没有应用账号系统或持久曲库数据库。默认搜索关键词发送至服务器与 GD 音乐台网站；Embeat 音频、歌词、封面向 GD 发送对应的原始资源 ID，不再向 autosource 发送标题等元数据。音频 URL 缓存在服务端内存，收藏等个人数据仍在本地。旧网易云兼容目录及其他封面、歌词、音频会由各自路径请求外部服务。外部服务自己的访问日志、保留期限及授权规则未核实。

当前浏览器 origin 的 `localStorage` 使用 `melodybox_fav`（收藏）、`melodybox_pl`（歌单）、`melodybox_rec`（最近播放）、`melodybox_album_fav`、`melodybox_tracks` 与 `melodybox_album_<ID>`；布局还有 `ty-sidebar-collapsed`、`ty-player-collapsed`。桌面目录缓存前缀为 `ty-music-api-cache:`。本地音频存储在 IndexedDB 数据库 `melodybox_local` 的 `tracks` 对象仓库，不是服务器备份。端口或域名变化会改变浏览器存储 origin。

升级通常保留这些数据；回归测试不应删除真实浏览器资料。清除站点数据、删除 IndexedDB 或卸载桌面端可能丢失个人内容。需要迁移/备份时先保留原始音频，并单独导出/备份相关浏览器存储，再验证恢复；当前没有经本次验证的一键完整备份流程。不得把删除全部浏览器资料当成缓存排障步骤。

## 验证与交付状态

```sh
npm ci
npm test
npm run build:aurora
git diff --exit-code -- soft-aurora-react.js soft-aurora-react.css assets/aurora
test -z "$(git ls-files --others --exclude-standard -- assets/aurora)"
```

最后一个命令应在生成资源已提交且与源码同步时无差异退出；首次更新源码后应先审阅并提交预期的生成资源。默认测试不访问真实音乐上游，fork 子进程显式清空 `GD_EMBEAT_CONNECT_HOST`，避免继承 Render 配置后绕开夹具。发布前另以 `GD_EMBEAT_CONNECT_HOST=music-api.gdstudio.xyz npm test` 验证生产变量不会污染测试；`npm run test:data` 另行验证联网数据。CI 在 PR 与分支推送上使用 Node.js 22，依次安装锁定依赖、测试、构建及检查生成资源同步；既有桌面工作流独立保留。

Embeat 默认搜索与资源路由已在本地实现；2026-11-16 完整 `npm test` 通过（49 个 node:test 用例、Embeat 身份与交互回归及三项既有检查），构建与生成资源同步通过。已修复外部元数据 HTML 属性引号转义、歌手页面/分页/头像简介的过期响应覆盖，以及协议响应取消等待和深分页边界。Embeat 歌词单次前端预算 25 秒，失败后不会模糊查询其他目录；歌手页使用搜索相关性顺序，不将其宣称为发行时间排序。此前搜索/性能版本已完成本地自动测试与构建；8 轮导航搜索页画布稳定为 3，3 轮全屏进出和 Cover Flow 生命周期通过，强制 502 后恢复 60 首。这些是旧版本历史证据，不代表新 Embeat 音频、歌词或 20 条搜索界面已验收。Safari 帧率仍待验收。

本次 Embeat 版本另经 ego lite 页面检查：本地页面可打开，搜索请求超时时结束加载并显示失败，不显示为零结果；探索区正确收起，默认标签为 Embeat，无手动切源控件。一次刷新报告渲染器无响应，关闭该任务页并在同一 Space 新建页面后，正常动效模式加载/刷新成功，尚未确定单次异常根因。这不能替代真实成功结果、音频、歌词或 Safari 流畅度验收。独立审查发现的问题由主代理修复并回归验证，审查范围限本次改动与直接调用方。

本轮任务分支为 `codex/deploy-embeat-search`，[PR #1](https://github.com/1981016893fty-pixel/ty-music/pull/1) 保持未合并。初版 `2ac858d` 在 Render 因测试继承生产传输变量而构建失败，该隔离问题已修复。性能提交 `a4e8dfa` 的 [CI](https://github.com/1981016893fty-pixel/ty-music/actions/runs/44022861429) 与部署已通过；进一步的传输修复 `4f513a0582b60c8ffde4f447e7694af6d4a0be13` 已通过 [CI](https://github.com/1981016893fty-pixel/ty-music/actions/runs/44024742320)，Render 部署 `dep-dbtue1m7bikc73fp4rp0` 已 Live。2026-11-17 后续标准 fetch 配置部署 `dep-dbtugb3l550s739d6mu0` 也已 Live，健康检查确认同一提交、Node 22.22.2 和默认 Embeat。

**生产搜索仍未通过验收。** 本地同代码返回20首；Render 经网站主机 HTTP/2 的校时日志明确为 HTTP 403、`text/html; charset=UTF-8`、无内容编码。切换 API 连接主机及标准 fetch 后仍有 `GD_CLOCK_ERROR`；不能把这一错误解释为 Render 冷启动、压缩错误或无歌曲。已确认并修复的压缩处理与失败响应流释放问题是独立缺陷，77个 node:test、播放器／动效检查和生产构建均通过，独立复审未发现阻止提交的问题，但并未消除生产上游拒绝。

线上静态清单及3个核心模块、v45 worker 均可访问；hash 分块为 JavaScript MIME 和 immutable 缓存，条件请求返回304。浏览器搜索失败会结束加载并显示错误，不伪装为空结果。线上原曲播放、拖动和歌词同步因搜索阻塞尚未完成本轮验收，本地成功证据不能替代生产结果。

当前可确认的阻塞是 GD 网站校时对该 Render 运行环境的 HTTP 拒绝；是否连带拒绝网站 `/api.php` 尚未取得运行时探针结果，不能扩大为“GD 封禁所有 Render IP”。曾准备一次只把校时请求映射到 GD 官方 API 主机、搜索仍请求原网站的短探针；Render 控制台保存启动配置报 `Failed to fetch (api.render.com)`，重启也失败，随后控制台无法加载服务设置。未确认该临时启动配置写入，也未取得探针结果。控制台恢复后先核对 Start Command，若含 `node -e` 诊断前缀，恢复为 `node server-simple.js`，再继续验证；不重复执行未知状态的配置写入。网站健康端点仍正常。下一步需要可访问 GD 网站的既有运行出口或由上游确认访问规则；不得默认换源、引入第三方代理、升级付费或新建资源。

既有 Render Free 服务部署分支已设为上述任务分支，Auto-Deploy 为 Off（手动发布），`NODE_VERSION=22.22.2` 已保存；最后确认上线的 `GD_EMBEAT_CONNECT_HOST` 为空，使用标准 fetch。生产连接入口需在生产环境单独验证，不可直接套用本机网络绕行配置。构建命令为 `npm ci --include=dev && npm test && npm run build:aurora`；启动 `node server-simple.js`，健康检查 `/api/health`。健康响应包含 `commit`、`node`、`searchSource`，自身不访问 GD。操作步骤及后续真实发布状态见[部署指南](../DEPLOY-GUIDE.md)。

回退时由维护者使用 `git revert <本次PR提交>` 保留历史，再运行测试和构建、提交生成资源；部署所有者按既有授权流程重新部署并核对健康、搜索、播放和个人曲库。不要使用强推或硬重置覆盖其他改动。第三方服务、媒体及依赖的授权/分发条件需要各自核实，当前没有替代权利人的许可声明。
