# TY Music macOS Desktop

The desktop client uses Tauri 2 and the existing TY Music frontend. The
desktop bundle keeps the visual system and points API/audio requests at the
deployed Render service.

## Requirements

- macOS 12 or later
- Xcode Command Line Tools
- Rust stable (`rustup default stable`)
- Node.js 18 or later

## Development

Run the existing web server on port `8899`, then start Tauri:

```sh
npm install
npm run desktop:dev
```

## Build DMG

```sh
npm run desktop:build
```

The Apple Silicon installer is written to:

`src-tauri/target/release/bundle/dmg/TY Music_1.0.0_aarch64.dmg`

The current native bridge exposes `platform_info`, `set_window_title`,
`minimize_window`, and `close_window`. Media-key and Now Playing integration
will be added in the next desktop phase without changing the web UI contract.
