use serde::{Deserialize, Serialize};
use tauri::{Emitter, Manager, PhysicalPosition, PhysicalSize, State};
use tauri_plugin_global_shortcut::{GlobalShortcutExt, Shortcut, ShortcutState};

use std::sync::Mutex;

#[cfg(target_os = "macos")]
use mediaplayer::{Artwork, CommandToken, HandlerStatus, NowPlayingInfo, NowPlayingInfoCenter,
    NowPlayingMediaType, PlaybackState, RemoteCommandCenter};

#[cfg(target_os = "macos")]
struct NativeMediaState {
    _tokens: Mutex<Vec<CommandToken>>,
    artwork: Mutex<Option<Artwork>>,
}

struct MiniWindowState {
    active: Mutex<bool>,
    normal_size: Mutex<Option<PhysicalSize<u32>>>,
    normal_position: Mutex<Option<PhysicalPosition<i32>>>,
}

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
struct NowPlayingPayload {
    title: String,
    artist: Option<String>,
    album: Option<String>,
    duration: Option<f64>,
    position: Option<f64>,
    is_playing: bool,
    artwork_data: Option<String>,
}

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

#[tauri::command]
fn toggle_native_mini(window: tauri::Window, state: State<'_, MiniWindowState>) -> Result<bool, String> {
    let mut active = state.active.lock().map_err(|_| "mini window state unavailable".to_string())?;
    if !*active {
        let size = window.outer_size().map_err(|error| error.to_string())?;
        let position = window.outer_position().map_err(|error| error.to_string())?;
        *state.normal_size.lock().map_err(|_| "mini window state unavailable".to_string())? = Some(size);
        *state.normal_position.lock().map_err(|_| "mini window state unavailable".to_string())? = Some(position);

        window.set_min_size(Some(PhysicalSize::new(560, 80))).map_err(|error| error.to_string())?;
        window.set_max_size(Some(PhysicalSize::new(900, 140))).map_err(|error| error.to_string())?;
        window.set_resizable(false).map_err(|error| error.to_string())?;
        let mini_size = PhysicalSize::new(680, 108);
        window.set_size(mini_size).map_err(|error| error.to_string())?;
        let centered_x = position.x + ((size.width as i32 - mini_size.width as i32) / 2).max(0);
        let anchored_y = position.y + (size.height as i32 - mini_size.height as i32).max(0);
        window.set_position(PhysicalPosition::new(centered_x, anchored_y)).map_err(|error| error.to_string())?;
        *active = true;
    } else {
        if let Some(size) = *state.normal_size.lock().map_err(|_| "mini window state unavailable".to_string())? {
            window.set_min_size(Some(PhysicalSize::new(960, 640))).map_err(|error| error.to_string())?;
            window.set_max_size::<PhysicalSize<u32>>(None).map_err(|error| error.to_string())?;
            window.set_size(size).map_err(|error| error.to_string())?;
        }
        if let Some(position) = *state.normal_position.lock().map_err(|_| "mini window state unavailable".to_string())? {
            window.set_position(position).map_err(|error| error.to_string())?;
        }
        window.set_resizable(true).map_err(|error| error.to_string())?;
        *active = false;
    }
    let _ = window.emit("ty:native-mini-mode", *active);
    Ok(*active)
}

#[tauri::command]
fn now_playing_update(
    payload: NowPlayingPayload,
    #[cfg(target_os = "macos")] state: State<'_, NativeMediaState>,
) -> Result<(), String> {
    #[cfg(target_os = "macos")]
    {
        if let Some(encoded) = payload.artwork_data.as_deref() {
            let artwork = (|| {
                use base64::{engine::general_purpose::STANDARD, Engine as _};
                let bytes = STANDARD.decode(encoded).ok()?;
                let path = std::env::temp_dir().join("ty-music-now-playing.jpg");
                std::fs::write(&path, bytes).ok()?;
                Artwork::from_path(path.to_str()?).ok()
            })();
            if let Ok(mut stored) = state.artwork.lock() {
                *stored = artwork;
            }
        }

        let center = NowPlayingInfoCenter::default_center();
        let mut info = NowPlayingInfo::new().title(payload.title);
        if let Some(artist) = payload.artist { info = info.artist(artist); }
        if let Some(album) = payload.album { info = info.album_title(album); }
        if let Some(duration) = payload.duration.filter(|v| v.is_finite() && *v > 0.0) {
            info = info.playback_duration(duration);
        }
        if let Some(position) = payload.position.filter(|v| v.is_finite() && *v >= 0.0) {
            info = info.elapsed_playback_time(position);
        }
        info = info.playback_rate(if payload.is_playing { 1.0 } else { 0.0 })
            .default_playback_rate(1.0)
            .media_type(NowPlayingMediaType::Audio);
        if let Ok(stored) = state.artwork.lock() {
            center.set_now_playing_info_with_artwork(&info, stored.as_ref());
        } else {
            center.set_now_playing_info(&info);
        }
        center.set_playback_state(if payload.is_playing { PlaybackState::Playing } else { PlaybackState::Paused });
    }
    #[cfg(not(target_os = "macos"))]
    let _ = payload;
    Ok(())
}

#[tauri::command]
fn now_playing_clear(
    #[cfg(target_os = "macos")] state: State<'_, NativeMediaState>,
) -> Result<(), String> {
    #[cfg(target_os = "macos")]
    {
        NowPlayingInfoCenter::default_center().clear();
        if let Ok(mut artwork) = state.artwork.lock() { *artwork = None; }
    }
    Ok(())
}

#[cfg(target_os = "macos")]
fn setup_native_media(app: &tauri::AppHandle) -> NativeMediaState {
    let center = RemoteCommandCenter::shared();
    let app_handle = app.clone();
    let mut tokens = Vec::new();
    let emit = |name: &'static str, app: tauri::AppHandle| move |_| {
        let _ = app.emit(name, ());
        HandlerStatus::Success
    };
    tokens.push(center.on_play(emit("ty:media-play", app_handle.clone())));
    tokens.push(center.on_pause(emit("ty:media-pause", app_handle.clone())));
    tokens.push(center.on_toggle_play_pause(emit("ty:media-toggle", app_handle.clone())));
    tokens.push(center.on_next_track(emit("ty:media-next", app_handle.clone())));
    tokens.push(center.on_previous_track(emit("ty:media-previous", app_handle.clone())));
    let seek_app = app_handle.clone();
    tokens.push(center.on_change_playback_position(move |event| {
        if let Some(position) = event.position {
            let _ = seek_app.emit("ty:media-seek", position);
        }
        HandlerStatus::Success
    }));
    NativeMediaState { _tokens: Mutex::new(tokens), artwork: Mutex::new(None) }
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
        .setup(|app| {
            app.manage(MiniWindowState {
                active: Mutex::new(false),
                normal_size: Mutex::new(None),
                normal_position: Mutex::new(None),
            });
            #[cfg(target_os = "macos")]
            app.manage(setup_native_media(app.handle()));
            if let Some(window) = app.get_webview_window("main") {
                let _ = window.set_title("TY Music");
            }
            let shortcut = "CommandOrControl+Alt+Space".parse::<Shortcut>().map_err(|error| error.to_string())?;
            app.global_shortcut().register(shortcut).map_err(|error| error.to_string())?;
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            platform_info, set_window_title, minimize_window, close_window, toggle_native_mini,
            now_playing_update, now_playing_clear
        ])
        .run(tauri::generate_context!())
        .expect("error while running TY Music");
}
