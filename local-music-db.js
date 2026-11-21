'use strict';

// Keep the original audio records for playback and backup. The listing store
// holds only the fields needed to show rows and summarize storage.
const LocalMusicDB = (() => {
  const TRACKS = 'tracks';
  const METADATA = 'trackMetadata';

  function metadataFor(track) {
    const { id, title, artist, album, duration, fileSize, audioData } = track;
    return {
      id,
      title: typeof title === 'string' ? title : '',
      artist: typeof artist === 'string' ? artist : '',
      album: typeof album === 'string' ? album : '',
      duration: Number.isFinite(duration) ? duration : 0,
      fileSize: audioData?.byteLength ?? audioData?.size ?? (Number.isFinite(fileSize) ? fileSize : 0),
    };
  }

  function open() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('melodybox_local', 2);
      let blocked = false;
      request.onblocked = () => {
        blocked = true;
        reject(new Error('本地曲库正在被旧版页面使用，请关闭旧页面后重试'));
      };
      request.onupgradeneeded = () => {
        if (blocked) { request.transaction.abort(); return; }
        const db = request.result;
        const metadata = db.createObjectStore(METADATA, { keyPath: 'id' });
        if (!db.objectStoreNames.contains(TRACKS)) {
          db.createObjectStore(TRACKS, { keyPath: 'id' });
          return;
        }
        const cursorRequest = request.transaction.objectStore(TRACKS).openCursor();
        cursorRequest.onsuccess = () => {
          const cursor = cursorRequest.result;
          if (!cursor) return;
          metadata.add(metadataFor(cursor.value));
          cursor.continue();
        };
      };
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const db = request.result;
        if (blocked) { db.close(); return; }
        db.addEventListener('versionchange', () => db.close());
        resolve(db);
      };
    });
  }

  function readAll(db, name) {
    return new Promise((resolve, reject) => {
      const tx = db.transaction([name], 'readonly');
      const request = tx.objectStore(name).getAll();
      request.onsuccess = event => resolve(event.target.result);
      tx.onabort = () => reject(tx.error || new Error('读取本地曲库失败'));
    });
  }

  function write(db, update) {
    return new Promise((resolve, reject) => {
      const tx = db.transaction([TRACKS, METADATA], 'readwrite');
      tx.onabort = () => reject(tx.error || new Error('本地曲库事务失败'));
      let result;
      try {
        result = update(tx.objectStore(TRACKS), tx.objectStore(METADATA));
      } catch (error) {
        tx.abort();
        reject(error);
        return;
      }
      tx.oncomplete = () => resolve(result?.());
    });
  }

  function save(db, track) {
    return write(db, (tracks, metadata) => {
      tracks.put(track);
      metadata.put(metadataFor(track));
    });
  }

  function remove(db, id) {
    return write(db, (tracks, metadata) => {
      tracks.delete(id);
      metadata.delete(id);
    });
  }

  function importTracks(db, incoming) {
    return write(db, (tracks, metadata) => {
      let added = 0;
      for (const track of incoming) {
        const request = tracks.getKey(track.id);
        request.onsuccess = () => {
          if (request.result !== undefined) return;
          tracks.add(track);
          metadata.add(metadataFor(track));
          added++;
        };
      }
      return () => added;
    });
  }

  return { open, list: db => readAll(db, METADATA), exportTracks: db => readAll(db, TRACKS), save, remove, importTracks };
})();
