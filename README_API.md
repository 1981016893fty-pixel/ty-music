# TY Music API 入口

当前默认启动入口为 `server-simple.js`，使用 `npm start`（先构建再启动），默认端口 `8899`，可用 `PORT` 覆盖。无需启动单独的本地 NeteaseCloudMusicApi 服务。完整环境与安装步骤见 [README](README.md)，接口维护约定见[维护说明](docs/maintenance.md)。

```sh
curl 'http://localhost:8899/api/health'
curl --get 'http://localhost:8899/api/music/search' --data-urlencode 'keywords=周杰伦' --data 'limit=10' --data 'offset=0'
```

搜索别名为 `/api/search` 与 `/api/music/search`。省略 `source` 默认 Embeat，无手动切源操作；显式 `source=netease` 保留旧精选/新歌内部兼容。成功返回 `{songs,total,hasMore,nextOffset}`；Embeat 的 `total` 为 `null`，不伪造总数，继续加载使用 `hasMore` 与 `nextOffset`。有效空结果为 HTTP 200，无效参数为 400，上游错误通常为 502，限流可为 429，超时为 504；错误体可含 `error` 和 `code`，不要绑定旧网易云专属错误码。搜索不可缓存。

搜索响应中的 Embeat `id` / `providerId` 是原始上游 ID；前端内部队列/存储身份为 `embeat:` 加严格 URI 编码。必须持久保留 `source`、`providerId`、`urlId`、`lyricId`、`picId`、`isrc`，不能只保留内部 ID 或标题。

音频代理为 `/api/music/proxy`，歌词为 `/api/music/lyric`。旧网易云曲目可只传 `id`；Embeat 请求须携带 `source=embeat`、对应资源 `id`、原始 `trackId`、`title`、`artist` 及可用的 `isrc`，由 `player.js` 的 `musicResourceQuery` 构造，不能把内部前缀 ID 直接发给上游。音频以 `urlId` 请求 `types=url&source=embeat&br=999`，歌词以 `lyricId` 请求 `types=lyric&source=embeat`；不依赖音频解析，也不做 autosource 同名模糊替换。Embeat 不支持下载或专辑目录。

每次网站请求总预算 12 秒，包含最多 4 秒时钟同步和一次 401 后刷新重试；前端搜索预算 15 秒。校时兼容 Unix 秒与毫秒；`GD_EMBEAT_CONNECT_HOST` 可启用受限的 GD 官方 HTTP/2 连接路由。2026-11-17 本地搜索、歌词、封面返回 200，音频端点返回 302；完整播放和生产环境另行验收。协议版本、签名维护和验收步骤见[维护说明](docs/maintenance.md)。
