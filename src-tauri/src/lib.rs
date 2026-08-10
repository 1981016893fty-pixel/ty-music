use serde::Serialize;
use tauri::Manager;

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
        .invoke_handler(tauri::generate_handler![platform_info, set_window_title, minimize_window, close_window])
        .setup(|app| {
            if let Some(window) = app.get_webview_window("main") {
                let _ = window.set_title("TY Music");
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running TY Music");
}
