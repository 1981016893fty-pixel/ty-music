# TY Music 免费部署选型

核对日期：2026-11-18。本文记录选型与迁移验收条件；不代表迁移已实现、检查已通过或新站已部署。当前生产状态仍以[维护指南](maintenance.md)为准。

## 决定

当前首选 **Cloudflare Pages 静态前端＋仅处理 `/api/*` 的 Workers/Pages Functions**，使用 `pages.dev` 域名，暂不引入 InsForge。先完成真实运行验收，再退出 Render。

这是针对当前项目的工程判断，不是所有免费服务器的通用排名：本站没有应用账号或服务端曲库数据库，个人收藏、歌单和最近播放使用浏览器 `localStorage`，本地音频使用 IndexedDB；已有后端主要提供音乐目录与媒体 API。为这些接口额外运行数据库、认证与存储平台会增加维护工作。数据边界见[维护指南](maintenance.md#数据备份与删除边界)。

InsForge 的 GitHub [生产 Compose 配置](https://github.com/InsForge/InsForge/blob/main/docker-compose.prod.yml)包含 PostgreSQL、PostgREST、后端及 Deno 服务，其[自建说明](https://github.com/InsForge/InsForge#self-hosted-docker-compose)要求 Docker Compose。Workers 免费运行时不能直接托管这套服务。未来确实需要账号、跨设备曲库或共享数据时，再评估 InsForge，届时属于新的数据与认证设计。

GitHub 的 [workerd 项目](https://github.com/cloudflare/workerd)是 Workers 使用的开源运行时，并支持 HTTP 代理用途；源码开源不等于 GitHub 提供免费常驻服务器。生产选型仍必须依据托管平台的实际额度和限制。

## 免费额度与适用边界

| 项目 | 官方规则及本项目的处理 |
| --- | --- |
| 静态前端 | Pages 不调用函数的静态请求免费且不限请求数；只让 `/api/*` 进入函数，避免静态资源占用函数额度。[计费说明](https://developers.cloudflare.com/pages/functions/pricing/) |
| 动态 API | Workers Free 每天 100,000 次请求、每次 10ms CPU、128MB 内存；Pages Functions 与其他 Workers 共享账户免费请求额度，不能把全部额度都当成本项目独享。[限制](https://developers.cloudflare.com/workers/platform/limits/)、[Pages 计费](https://developers.cloudflare.com/pages/functions/pricing/) |
| 上游请求 | Free 每次最多 50 个子请求、最多 6 个等待响应头的并发连接；网络等待不计 CPU，但 JSON 解析、签名与数据处理计入 CPU。必须测量实际 API 的 CPU，不能仅凭接口以网络为主就断言 10ms 足够。[限制](https://developers.cloudflare.com/workers/platform/limits/) |
| 长响应 | HTTP 请求在客户端保持连接时可继续流式返回，不能把音频完整缓冲进内存；断开后工作可能被取消。[限制](https://developers.cloudflare.com/workers/platform/limits/)、[Streams](https://developers.cloudflare.com/workers/runtime-apis/streams/) |
| 费用 | 免费额度不是无限量，也不是可用性保证。付费 Workers 最低 $5/月；本次不自动升级。超限时应按免费计划实际失败行为处理。[价格](https://developers.cloudflare.com/workers/platform/pricing/) |

Pages Free 还有每站最多 20,000 个文件、单文件 25MiB、每月 500 次平台构建等限制；当前发布应仅包含网站所需静态文件，不能把仓库根目录整体公开。[Pages 限制](https://developers.cloudflare.com/pages/platform/limits/)

## 最小迁移路径

Cloudflare 已提供 `node:http` 和原生 `httpServerHandler`，可先复用已有 Node 路由与 `ServerResponse` 流接口，而非立即重写全部业务。它不是完整 Node 虚拟机：部分 Agent 行为、底层 socket、连接管理和事件不同；`node:http2` 在兼容模块表中仍是 stub，不能照搬特殊 HTTP/2 连接路由。[HTTP 兼容文档](https://developers.cloudflare.com/workers/runtime-apis/nodejs/http/)、[Node 兼容表](https://developers.cloudflare.com/workers/runtime-apis/nodejs/)

迁移应隔离静态文件系统与本地监听入口，按兼容日期使用原生适配器；特殊 GD HTTP/2 transport 不得在 Workers 路径初始化。保留网页“网易云保底＋Embeat 可用时补充”的访问者直连策略，服务端回退再由新运行时处理。健康检查仅证明本站入口，不证明 GD/网易云接受 Cloudflare 出口。

默认网页音频继续使用提供方直链或 302，减少不必要的中转。需要 `stream=1` 的兼容调用必须保持流式输出、Range、206/416、Content-Range、二进制及取消处理，不应宣称迁移即获得无限音频 CDN。平台[应用服务条款](https://www.cloudflare.com/service-specific-terms-application-services/)与[开发者平台条款](https://www.cloudflare.com/service-specific-terms-developer-platform/)另有适用边界；音乐服务、资源版权与分发授权也不会因换服务器自动获得。

## 上线门槛与未验证部分

1. 核对现有 25 个 API 地址的状态码、别名、响应及调用方；保留搜索分页、来源身份、错误隔离和无结果的区别。二进制封面不能统一替换为跨域 302。
2. 用真实 Workers/Pages 运行时验证构建加载、健康检查、上游请求与错误，记录 CPU、子请求和内存；本地 Node 测试通过不能代替这一步。
3. 在实际 `pages.dev` 页面验证网易云基础结果、Embeat 成功追加及失败隔离、播放、歌词、封面、榜单、专辑、艺人和 Range 拖动；不承诺每个音源或 Cloudflare 出口均可用。
4. 域名从 Render 改为 `pages.dev` 会改变浏览器 origin，原站收藏、歌单和 IndexedDB 不会自动出现在新站。必须先明确并验证保留或迁移办法，不清除旧站数据，不把新域名空曲库称作数据已迁移。
5. 核对静态缓存、service worker 更新、同源 `/api/*`、桌面 API 地址、发布文件与秘密暴露边界；所有关键路径通过后才切换入口并退出 Render，保留可操作回退。

生产搜索、封面、音频跳转及Range已验证；CPU／内存完整测量、Safari曲库与全目录验收未完成。当前部署与合并状态见[维护指南](maintenance.md#cloudflare-迁移2026-11-18)。上游拒绝、区域网络差异、免费额度增长以及浏览器动效发热仍是独立风险；更换后端不会自动修复 GPU 动画负载，也不能保证零延迟或完全无冷初始化。
