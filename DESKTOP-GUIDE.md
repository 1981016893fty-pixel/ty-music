# TY Music 桌面客户端

TY Music 用 Tauri 2 打包现有网页播放器。安装包内置界面和资源；在线搜索、封面和音频可访问 [Cloudflare Pages API](https://ty-music.pages.dev/api/health) 或外部音源。macOS 集成系统「正在播放」和媒体控制；两端可使用 `Command/Ctrl + Alt + Space` 切换播放状态。

## 安装和更新

从 [GitHub Releases 的 Assets](https://github.com/1981016893fty-pixel/ty-music/releases/latest) 下载安装包：

| 系统 | 安装包 |
| --- | --- |
| Apple Silicon，macOS 12+ | `TY.Music_<版本>_aarch64.dmg`，拖入「应用程序」 |
| 64 位 Windows 10/11 | `TY.Music_<版本>_x64-setup.exe` 或 `TY.Music_<版本>_x64_en-US.msi` |

GitHub 构建未配置 Developer ID 公证或 Windows Authenticode 签名，系统可能提示未验证开发者。升级通常会沿用同一客户端的数据目录；升级或回退前可通过「关于 → 个人曲库备份与迁移」备份。历史版本仍在 [Releases](https://github.com/1981016893fty-pixel/ty-music/releases)。

## 开发和构建

两端均使用 Node.js 22、Rust stable。构建 macOS 包需要 Xcode 26 和 macOS 26 SDK，原生媒体桥在编译时依赖该 SDK；安装包部署目标仍为 macOS 12。Windows 需要 Visual Studio 的 C++ 桌面构建工具和 WebView2 Runtime。依赖说明见 [Tauri 前置环境](https://v2.tauri.app/start/prerequisites/)。

```sh
npm ci
npm start
```

保持本地端口 `8899` 运行，在另一终端执行 `npm run desktop:dev`。构建 macOS DMG 用 `npm run desktop:build`，Windows EXE/MSI 用 `npm run desktop:build:windows`。换平台时在该平台的系统上构建。输出位于 `src-tauri/target/release/bundle/`。

桌面资源清单及 API 基地址在 [desktop/build.mjs](desktop/build.mjs)。修改前端后先运行 `npm run build:aurora`，一并提交生成文件；运行 `npm run desktop:prepare` 核查打包资源。窗口和原生媒体命令在 [src-tauri/src/lib.rs](src-tauri/src/lib.rs)。

## 发布与验收

1. 保持 npm 清单、Cargo 清单及锁文件、Tauri 配置和下载页版本一致，并准备 `docs/releases/v<版本>.md`。
2. [Desktop installers](.github/workflows/desktop.yml) 在相关 PR 中构建双平台包。确认两个任务成功并检查文件名。合并后给验收过的提交打新 tag；tag 触发同一工作流。只有三个预期安装包都生成并匹配 tag 时，才创建正式 GitHub Release。
3. 核对 Release 下的 DMG、EXE、MSI 均可下载。在真实设备上安装后，检查启动、搜索、播放、拖动进度、切歌、缺图占位、全屏封面和已有曲库。构建成功只证明可以打包。
4. 出现构建或上传错误时，先检查 Actions 的具体失败步骤，修复后重跑同一次工作流；已经发布的 tag 和安装包保留。若需回退，用户可从上一完整 Release 下载安装包并用备份恢复曲库。素材与访问限制见[维护说明](docs/maintenance.md)。
