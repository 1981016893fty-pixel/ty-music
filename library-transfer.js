/* TY Music personal-library transfer. Native APIs only; no network requests. */
(function () {
  'use strict';
  const FORMAT = 'ty-music-library';
  const MAX_BYTES = 512 * 1024 * 1024;
  const KEYS = ['melodybox_fav', 'melodybox_pl', 'melodybox_rec', 'melodybox_tracks', 'melodybox_album_fav'];
  const albumKey = key => key.startsWith('melodybox_album_') && key !== 'melodybox_album_fav';
  const allowedKey = key => KEYS.includes(key) || albumKey(key);
  const fail = message => { throw new Error(message); };
  const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
  function checkJSON(value, depth = 0) {
    if (depth > 20) fail('备份数据嵌套过深');
    if (value === null || typeof value === 'string' || typeof value === 'boolean') return;
    if (typeof value === 'number' && Number.isFinite(value)) return;
    if (!object(value) && !Array.isArray(value)) fail('备份含不支持的数据类型');
    for (const [key, item] of Object.entries(value)) {
      if (['__proto__', 'prototype', 'constructor'].includes(key)) fail('备份含不安全的对象字段');
      if (/^(cover|coverSmall|picUrl|previewUrl|lyricsUrl|avatar)$/.test(key) && typeof item === 'string' && item &&
          (!/^(https?:\/\/|\/(?!\/)|data:image\/[a-z0-9.+-]+;base64,)/i.test(item) || /["'<>\u0000-\u0020]/.test(item))) fail('备份含无效的媒体地址');
      checkJSON(item, depth + 1);
    }
  }
  function checkId(id) {
    if (!['string', 'number'].includes(typeof id) || !String(id).trim() || String(id).length > 2048 ||
        typeof id === 'number' && !Number.isFinite(id) || /["'<>\\&\u0000-\u001f\u007f]/.test(String(id))) fail('备份含无效的项目 ID');
  }
  function checkIds(ids) { if (!Array.isArray(ids)) fail('备份 ID 列表格式无效'); ids.forEach(checkId); }
  function checkTrack(track) { if (!object(track)) fail('歌曲信息格式无效'); checkId(track.id); }
  function validateStorage(storage) {
    if (!object(storage)) fail('浏览器曲库格式无效');
    checkJSON(storage);
    for (const [key, value] of Object.entries(storage)) {
      if (!allowedKey(key)) fail('备份包含曲库以外的浏览器数据');
      if (key === 'melodybox_fav' || key === 'melodybox_album_fav') checkIds(value);
      else if (key === 'melodybox_pl') {
        if (!Array.isArray(value)) fail('歌单格式无效');
        value.forEach(playlist => { if (!object(playlist) || typeof playlist.name !== 'string') fail('歌单格式无效'); checkId(playlist.id); checkIds(playlist.tracks ?? playlist.songs ?? []); });
      } else if (key === 'melodybox_rec') {
        if (!Array.isArray(value)) fail('最近播放格式无效'); value.forEach(checkTrack);
      } else if (key === 'melodybox_tracks') {
        if (!object(value)) fail('歌曲缓存格式无效');
        for (const [id, track] of Object.entries(value)) { checkId(id); checkTrack(track); if (String(track.id) !== id) fail('歌曲缓存 ID 不一致'); }
      } else if (!object(value)) fail('专辑信息格式无效');
    }
    return storage;
  }
  function bytesToBase64(bytes) {
    let text = '';
    for (let offset = 0; offset < bytes.length; offset += 32768) text += String.fromCharCode(...bytes.subarray(offset, offset + 32768));
    return btoa(text);
  }
  async function serializeBackup(storage, localTracks) {
    validateStorage(storage);
    if (!Array.isArray(localTracks)) fail('本地音频列表格式无效');
    const records = [];
    let encodedSize = 0;
    const seen = new Set();
    for (const track of localTracks) {
      checkTrack(track);
      if (seen.has(String(track.id))) fail('本地音频包含重复 ID，无法生成完整备份');
      seen.add(String(track.id));
      const { audioData, objectURL, ...metadata } = track;
      checkJSON(metadata);
      const buffer = audioData instanceof Blob ? await audioData.arrayBuffer() : audioData;
      if (!(buffer instanceof ArrayBuffer)) fail('本地歌曲缺少可备份的音频数据');
      encodedSize += Math.ceil(buffer.byteLength / 3) * 4;
      if (encodedSize > MAX_BYTES) fail('备份超过 512 MiB，请保留原始音频并在新站重新添加');
      records.push({ ...metadata, audioData: { encoding: 'base64', byteLength: buffer.byteLength, data: bytesToBase64(new Uint8Array(buffer)) } });
    }
    const json = JSON.stringify({ format: FORMAT, version: 1, createdAt: new Date().toISOString(), storage, localTracks: records });
    if (new Blob([json]).size > MAX_BYTES) fail('备份超过 512 MiB，请保留原始音频并在新站重新添加');
    return json;
  }
  function parseBackup(text) {
    if (typeof text !== 'string' || new Blob([text]).size > MAX_BYTES) fail('备份文件过大或格式无效');
    let backup;
    try { backup = JSON.parse(text); } catch (_) { fail('无法读取 JSON 备份'); }
    if (!object(backup) || backup.format !== FORMAT || backup.version !== 1 || !Array.isArray(backup.localTracks)) fail('不是支持的 TY Music 曲库备份（版本 1）');
    validateStorage(backup.storage);
    const seen = new Set();
    const localTracks = backup.localTracks.map(track => {
      checkTrack(track);
      const { audioData, ...metadata } = track;
      checkJSON(metadata);
      if (seen.has(String(track.id))) fail('备份包含重复的本地歌曲 ID'); seen.add(String(track.id));
      if (!object(audioData) || audioData.encoding !== 'base64' || !Number.isSafeInteger(audioData.byteLength) || audioData.byteLength < 0 ||
          typeof audioData.data !== 'string' || (/[^A-Za-z0-9+/=]/.test(audioData.data) || /=(?!={0,1}$)/.test(audioData.data)) ||
          audioData.data.length !== Math.ceil(audioData.byteLength / 3) * 4) fail('本地音频编码无效');
      const raw = atob(audioData.data);
      if (raw.length !== audioData.byteLength) fail('本地音频长度不完整');
      const bytes = Uint8Array.from(raw, char => char.charCodeAt(0));
      if (btoa(raw) !== audioData.data) fail('本地音频编码不规范');
      return { ...metadata, audioData: bytes.buffer };
    });
    return { storage: backup.storage, localTracks };
  }
  const union = (a, b, identity = value => value) => {
    const seen = new Set();
    return [...a, ...b].filter(value => { const id = String(identity(value)); if (seen.has(id)) return false; seen.add(id); return true; });
  };
  function mergeStorage(existing, incoming) {
    validateStorage(existing); validateStorage(incoming);
    const merged = structuredClone(existing);
    for (const [key, value] of Object.entries(incoming)) {
      const old = merged[key];
      if (old === undefined) { merged[key] = structuredClone(value); continue; }
      if (key === 'melodybox_fav' || key === 'melodybox_album_fav') merged[key] = union(old, value);
      else if (key === 'melodybox_rec') merged[key] = union(old, value, track => track.id);
      else if (key === 'melodybox_tracks') merged[key] = { ...value, ...old };
      else if (key === 'melodybox_pl') {
        merged[key] = union(old, value, playlist => playlist.id).map(playlist => {
          const other = value.find(item => String(item.id) === String(playlist.id));
          return { ...playlist, tracks: union(playlist.tracks ?? playlist.songs ?? [], other?.tracks ?? other?.songs ?? []) };
        });
      }
    }
    return structuredClone(merged);
  }
  function readStorage(adapter) {
    const result = {};
    for (let i = 0; i < adapter.length; i++) {
      const key = adapter.key(i);
      if (key && allowedKey(key)) {
        try { result[key] = JSON.parse(adapter.getItem(key)); } catch (_) { fail('当前曲库数据损坏：' + key + '；请保留原资料后排查'); }
      }
    }
    return validateStorage(result);
  }
  function writeStorage(adapter, merged) {
    validateStorage(merged);
    const plans = Object.entries(merged).map(([key, value]) => ({key, before: adapter.getItem(key), after: JSON.stringify(value)}));
    const written = [];
    try {
      for (const plan of plans) {
        if (adapter.getItem(plan.key) !== plan.before) fail('曲库在导入期间发生变化，请关闭其他播放器标签后重试');
        if (plan.before === plan.after) continue;
        adapter.setItem(plan.key, plan.after); written.push(plan);
      }
    } catch (error) {
      let rollbackFailed = false;
      for (const plan of written.reverse()) {
        try { if (adapter.getItem(plan.key) === plan.after) { if (plan.before === null) adapter.removeItem(plan.key); else adapter.setItem(plan.key, plan.before); } }
        catch (_) { rollbackFailed = true; }
      }
      if (rollbackFailed) fail(error.message + '；部分合并已写入且回滚受阻，原有项目未主动删除。请保留备份并检查曲库。');
      throw error;
    }
  }
  async function withLocalDatabase(run) {
    const db = await LocalMusicDB.open();
    try { return await run(db); }
    finally { db.close(); }
  }
  function counts(storage, tracks) {
    return `收藏 ${(storage.melodybox_fav || []).length} · 歌单 ${(storage.melodybox_pl || []).length} · 最近播放 ${(storage.melodybox_rec || []).length} · 专辑收藏 ${(storage.melodybox_album_fav || []).length} · 本地音频 ${tracks.length} 首（${(tracks.reduce((n,t)=>n+(t.audioData?.byteLength ?? t.audioData?.size ?? t.fileSize ?? 0),0)/1048576).toFixed(1)} MiB）`;
  }
  function setupPage() {
    const byId = id => document.getElementById(id);
    const status = byId('status'), preview = byId('preview'), file = byId('backup-file'), importButton = byId('import-button'), exportButton = byId('export-button');
    if (!status) return;
    let pending = null, busy = false;
    const controls = value => { busy = value; file.disabled = value; exportButton.disabled = value; importButton.disabled = value || !pending; };
    exportButton.addEventListener('click', async () => {
      controls(true); status.textContent = '正在读取并编码曲库，请保持页面打开…';
      try {
        const storage = readStorage(localStorage), tracks = await withLocalDatabase(LocalMusicDB.exportTracks);
        const json = await serializeBackup(storage, tracks);
        const url = URL.createObjectURL(new Blob([json], {type:'application/json'}));
        const link = document.createElement('a'); link.href = url; link.download = 'ty-music-library-' + new Date().toISOString().slice(0,10) + '.json'; link.click();
        setTimeout(() => URL.revokeObjectURL(url), 60000);
        status.textContent = '已发起下载：' + counts(storage, tracks) + '。请确认文件已保存后再离开旧站。';
      } catch (error) { status.textContent = '导出失败：' + error.message; }
      finally { controls(false); }
    });
    file.addEventListener('change', async () => {
      if (busy) return;
      pending = null; preview.textContent = ''; controls(true);
      try {
        const selected = file.files[0]; if (!selected) return;
        if (selected.size > MAX_BYTES) fail('文件超过 512 MiB');
        const parsed = parseBackup(await selected.text());
        const current = readStorage(localStorage), tracks = await withLocalDatabase(LocalMusicDB.list);
        const merged = mergeStorage(current, parsed.storage);
        const combined = union(tracks, parsed.localTracks, track => track.id);
        preview.textContent = '备份：' + counts(parsed.storage, parsed.localTracks) + '\n当前：' + counts(current, tracks) + '\n合并后：' + counts(merged, combined);
        pending = parsed; status.textContent = '校验通过，尚未写入。确认预览后点击“合并导入”。';
      } catch (error) { status.textContent = '读取失败：' + error.message; }
      finally { controls(false); }
    });
    importButton.addEventListener('click', async () => {
      if (!pending || busy) return;
      controls(true); status.textContent = '正在合并，请勿关闭页面…';
      let added = 0;
      try {
        const merged = mergeStorage(readStorage(localStorage), pending.storage);
        // Pre-serialize before starting audio writes; quota errors still require rollback below.
        JSON.stringify(merged);
        added = await withLocalDatabase(db => LocalMusicDB.importTracks(db, pending.localTracks));
        // Re-read after the asynchronous database transaction to preserve intervening changes.
        writeStorage(localStorage, mergeStorage(readStorage(localStorage), pending.storage));
        status.textContent = '合并完成，新增本地音频 ' + added + ' 首。请重新加载播放器检查；保留备份。';
        pending = null;
      } catch (error) { status.textContent = '导入未全部完成：' + error.message + (added ? '；已新增 ' + added + ' 首本地音频，重复导入会保留现有项目。' : ''); }
      finally { controls(false); }
    });
    byId('origin').textContent = location.origin;
  }
  const api = { serializeBackup, parseBackup, mergeStorage, readStorage, writeStorage, MAX_BYTES };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else setupPage();
})();
