use serde::Serialize;
use tauri::{Emitter, Manager};
use tauri_plugin_global_shortcut::{GlobalShortcutExt, Shortcut, ShortcutState};

#[derive(Debug, Serialize)]
struct PlatformInfo {
    platform: String,
    version: String,
}

#[tauri::command]
fn platform_info() -> PlatformInfo {
    PlatformInfo {
        platform: "macOS".to_string(),
        version: std::env::consts::OS.to_string(),
    }
}

#[tauri::command]
fn set_window_title(window: tauri::Window, title: String) -> Result<(), String> {
    window.set_title(&title).map_err(|error| error.to_string())
}

#[tauri::command]
fn minimize_window(window: tauri::Window) -> Result<(), String> {
    window.minimize().map_err(|error| error.to_string())
}

#[tauri::command]
fn close_window(window: tauri::Window) -> Result<(), String> {
    window.close().map_err(|error| error.to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_global_shortcut::Builder::new().with_handler(|app, shortcut, event| {
            if event.state() != ShortcutState::Pressed { return; }
            if shortcut == &"CommandOrControl+Alt+Space".parse::<Shortcut>().expect("valid media shortcut") {
                if let Some(window) = app.get_webview_window("main") {
                    let _ = window.emit("ty:media-toggle", ());
                }
            }
        }).build())
        .invoke_handler(tauri::generate_handler![platform_info, set_window_title, minimize_window, close_window])
        .setup(|app| {
            if let Some(window) = app.get_webview_window("main") {
                let _ = window.set_title("TY Music");
            }
            let shortcut = "CommandOrControl+Alt+Space".parse::<Shortcut>().map_err(|error| error.to_string())?;
            app.global_shortcut().register(shortcut).map_err(|error| error.to_string())?;
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running TY Music");
}
