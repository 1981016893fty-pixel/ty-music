# TY Music

在浏览器或桌面听歌：搜索歌曲、浏览音乐分类、看全屏歌词，也能整理收藏、歌单和本地音乐。

**[打开网页播放器](https://ty-music.pages.dev/)** · **[下载 Mac / Windows 客户端](https://github.com/1981016893fty-pixel/ty-music/releases/latest)**

[![TY Music 正式站欢迎页实拍：聆听，正在发生。](docs/images/ty-music-welcome.jpg)](https://ty-music.pages.dev/)

## 开始听歌

打开网页，点「开始使用」进入播放器。可以从首页选音乐分类，在「浏览」里搜索歌曲，或在「本地音乐」里导入音频。播放后可打开全屏歌词，在「喜爱」「专辑」「播放列表」里整理曲库。

搜索优先使用 Embeat。它能响应时只显示它的结果，空结果也不会混入网易云；连接失败时自动回退到网易云。在线曲目和封面依赖外部服务，能否访问取决于网络和音源，部分曲目可能不可用。

## 桌面客户端下载

从 [GitHub Releases](https://github.com/1981016893fty-pixel/ty-music/releases/latest) 的 Assets 选择：

| 系统 | 下载 | 安装 |
| --- | --- | --- |
| macOS 12+，Apple Silicon（M 系列） | `aarch64.dmg` | 打开 DMG，把 TY Music 拖入「应用程序」 |
| Windows 10/11，64 位 | `x64-setup.exe` 或 `x64_en-US.msi` | 日常安装用 EXE；有 MSI 部署需求时选 MSI |

客户端用 Tauri 封装同一套播放器界面。签名、构建和验收说明见[桌面指南](DESKTOP-GUIDE.md)。

## 在本地运行

需要 Node.js 22。克隆后在仓库根目录运行：

```sh
npm ci
npm start
```

打开 <http://localhost:8899>。默认使用仓库内的 Node 服务；端口占用时用 `PORT=18899 npm start`。可选配置、健康检查和排障见[部署指南](DEPLOY-GUIDE.md)。

```sh
npm test
npm run test:genre
npm run build:pages
```

线上使用 Cloudflare Pages 和同源 Workers API；桌面包使用同一正式 API。开发与维护入口：[工程维护](docs/maintenance.md) · [桌面构建与发布](DESKTOP-GUIDE.md) · [API 说明](README_API.md) · [工程质量审查](docs/quality-audit.md)。

## 数据与使用范围

收藏、歌单、最近播放保存在当前浏览器或客户端的本地存储；本地音频保存在 IndexedDB，无账号同步。换站点或清除数据前，请先通过「关于 → 个人曲库备份与迁移」导出个人曲库。

项目仅供个人学习与非商业使用。在线媒体由外部服务提供，本项目不授予其内容的使用或分发许可。仓库未声明软件开源许可证。
