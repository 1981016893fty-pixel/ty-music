# TY Music 部署与排障

生产站部署在 [Cloudflare Pages](https://ty-music.pages.dev)，前端静态文件与 `/api/*` Worker 同源。项目没有独立常驻服务器或账号数据库；收藏与歌单保存在浏览器，本地音频在 IndexedDB。选型与免费额度见 [hosting-choice](docs/hosting-choice.md)。

## 本地与发布

使用 Node.js 22，构建时保留开发依赖：

```sh
npm ci
npm test
npm run build:pages
npx --yes wrangler@4.164.0 pages dev pages-dist --port 8788 --inspector-port 0
```

另一个终端运行：

```sh
node scripts/verify-deployment.mjs http://localhost:8788
# 可选的真实联网验收，受上游可用性影响
node scripts/verify-deployment.mjs http://localhost:8788 --network
```

普通 Node 本地预览仍可 `PORT=18899 npm start`。Workers 由 `cloudflare/worker.mjs` 调用 API-only server factory；不会加载文件系统静态服务，也不使用 Node HTTP/2 特殊连接。`wrangler.jsonc` 固定兼容日期和 Node HTTP 标志。Pages 打包器当前会把直接 Node HTTP 导入替换为不完整的 shim，构建脚本通过官方 `process.getBuiltinModule()` 加载原生模块；改打包方式后务必跑真实 runtime 检查。

已登录且有 Pages 权限的账号发布预览：

```sh
npx --yes wrangler@4.164.0 pages deploy pages-dist --project-name ty-music --branch codex/cloudflare-migration --commit-dirty false
```

首次项目已建立，不重复创建。仅首次创建旧版 Pages 项目时需要 `pages project create ty-music --production-branch main --force`；不要把 `--force` 用在后续发布。独立任务分支 → PR → CI → 已授权合并后，重新从目标提交构建并发布生产：

```sh
npm run build:pages
npx --yes wrangler@4.164.0 pages deploy pages-dist --project-name ty-music --branch main --commit-dirty false
node scripts/verify-deployment.mjs https://ty-music.pages.dev --network
```

构建把 `git rev-parse HEAD` 写入健康检查 `commit`。工作树未提交时此值仅是基点，不证明改动已经提交；正式部署前核对工作区及哈希。发布不需要提交 `pages-dist/`。不能上传仓库根目录，其中含服务端及用户数据文件。构建显式白名单发布，`_routes.json` 仅让 `/api/*` 进入 Worker，静态文件不占用函数调用额度；无哈希入口重新验证，哈希分块长期缓存。

## 验收与排障

若浏览器提示“无法打开页面”而 HTTP 首页为200，核对 Service Worker 的预缓存导航响应。Pages 会把 `/index.html?v=…` 308到 `/?v=…`，缓存中的 `redirected=true` 响应不能直接用于手动重定向模式的顶层导航。v52使用 `/?v=20261118-navigation-v52` 直接预存200首页，只读取当前版本缓存并跳过重定向响应；缓存读取失败时走网络，二者均失败时显示离线提示。正常刷新会检查新 Worker，不以清空站点数据作为修复步骤。发布后须在正式域名验证旧Worker升级、普通刷新及带查询参数的导航，不能只验证独立部署网址。`verify-deployment.mjs` 同时检查实际预缓存URL无重定向。

验收脚本核对 API、首页和 Service Worker 预缓存首页是否属于同一目标提交，默认使用当前 checkout 的完整 SHA。若构建时用 `TY_MUSIC_COMMIT` 指定提交，验收应传入相同的 `--commit=<完整SHA>`。旧版首页没有构建标记，不能用新版检查脚本验收旧版回退；回退时按目标版本的说明复核。联网验收另测并发搜索、封面、音频跳转和 Range 206；真实浏览器还需检查首页 12 个流派、首批歌曲可点播、搜索、歌词及正常刷新。

每次发布更新 `service-worker.js` 中的 `APP_SHELL` URL，避免两个 Worker 共用同一个预缓存键。导航优先读取当前 Worker 安装的首页；该版本键只在安装时写入，普通访问不能用其它版本覆盖。HTML 始终注册同一个 `/service-worker.js` URL，让浏览器检查脚本更新。离线回退与封面缓存沿用原策略。回归命令：`node --test scripts/verify-cache-policy.mjs`。

网页优先请求同源 API 获取网易云结果和封面地址，失败时由访问者网络直连 GD 网易云。Embeat 由访问者网络直连；首批成功时独占显示（含空列表），首批失败或超过 6 秒时回退网易云。已选源的分页不会混用另一个目录。Workers 出口也可能被音源限流。遇到 `GD_CLOCK_ERROR` 或 `GD_TIMEOUT` 时，检查上游连接与请求耗时。

Pages 首次新域名或预览证书可能需要等待；握手失败时先核对部署状态再重试，不能禁用 TLS。Workers 的初始化、网络与上游可能带来延迟。免费额度属于账号共享，有请求及 CPU 上限；音频默认以 302 跳转至提供方。详情见选型说明。

## 曲库备份与迁移

新旧域名不共享 localStorage／IndexedDB。用原来收藏音乐的同一浏览器（用户主要为 Safari），在旧站 `/library-transfer.html` 下载完整备份，再到新站同名页面预览并合并导入，最后重载播放器检查。现有条目优先保留，音频只追加，文件与存储上限、部分失败见工具页面。备份包含个人曲库及完整音频，不能提交到 Git。

桌面版 v1.0.5 及后续构建使用 Pages API；更早的安装包需要升级才能更新 API 地址。退役旧站前，先确认所需曲库已从原浏览器导出，并在新站导入后检查收藏及本地音频。网站部署无法迁移浏览器本地数据。

## 回退

保留上一个成功 Pages deployment ID 与提交。生产回归时在 Cloudflare Pages 的 Deployments 选择已验证的生产版本回退，或从已记录的提交重建后 `pages deploy --branch main`；随后重新验证 `/api/health` 与核心流程。代码用 `git revert` 保留历史。不要删除或覆盖个人曲库，功能回退不等于数据回滚。
