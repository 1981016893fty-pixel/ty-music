import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { test } from 'node:test';
import vm from 'node:vm';
const require = createRequire(import.meta.url);
const transfer = require('../library-transfer.js');
const databaseSource = await readFile(new URL('../local-music-db.js', import.meta.url), 'utf8');

function localDatabase(globals = {}) {
  const context = vm.createContext(globals);
  vm.runInContext(databaseSource, context);
  return { context, api: vm.runInContext('LocalMusicDB', context) };
}

test('opening the local list reads only metadata, with zero audio bytes returned', async () => {
  const player = await readFile(new URL('../player.js', import.meta.url), 'utf8');
  const database = {
    transaction(stores) {
      assert.deepEqual(Array.from(stores), ['trackMetadata']);
      return { objectStore(name) {
        assert.equal(name, 'trackMetadata');
        return { getAll() {
          const request = { result: [{ id: 'local_1', title: 'Fixture', fileSize: 5242880 }] };
          queueMicrotask(() => request.onsuccess({ target: request }));
          return request;
        } };
      } };
    },
  };
  const { context } = localDatabase({ localMusicDB: database });
  vm.runInContext(player.slice(player.indexOf('function getAllLocalTracks('), player.indexOf('async function deleteLocalTrack(')), context);
  const list = await context.getAllLocalTracks();
  assert.deepEqual(list, [{ id: 'local_1', title: 'Fixture', fileSize: 5242880 }]);
});

test('upgrading an old library indexes one track at a time and keeps the original audio records', async () => {
  const stored = [
    { id: 'old_a', title: 'Legacy', artist: 'Artist', duration: 25, audioData: new ArrayBuffer(5242880) },
    { id: 'old_b', title: 'Missing optional metadata', audioData: new Blob([new Uint8Array([1, 2, 3])]) },
  ];
  const indexed = [], cursorRequest = {};
  let index = 0;
  const onversionchange = new EventTarget();
  const database = Object.assign(onversionchange, {
    objectStoreNames: ['tracks'],
  });
  database.objectStoreNames.contains = name => database.objectStoreNames.includes(name);
  database.createObjectStore = (name, options) => {
    assert.equal(name, 'trackMetadata');
    assert.equal(options.keyPath, 'id');
    return { add(row) { indexed.push(row); } };
  };
  const upgrade = { result: database, transaction: { objectStore(name) {
    assert.equal(name, 'tracks');
    return { openCursor() { return cursorRequest; } };
  } } };
  const { api } = localDatabase({ indexedDB: { open(name, version) {
    assert.equal(name, 'melodybox_local');
    assert.equal(version, 2);
    return upgrade;
  } } });
  const ready = api.open();
  upgrade.onupgradeneeded();
  const visit = () => {
    cursorRequest.result = index < stored.length ? {
      get value() { return stored[index]; },
      continue() { index++; },
    } : null;
    cursorRequest.onsuccess();
  };
  while (index < stored.length) {
    const visited = index;
    visit();
    assert.equal(index, visited + 1, 'one cursor advance per legacy track');
  }
  visit();
  upgrade.onsuccess();
  assert.equal(await ready, database);
  assert.deepEqual(JSON.parse(JSON.stringify(indexed)), [
    { id: 'old_a', title: 'Legacy', artist: 'Artist', album: '', duration: 25, fileSize: 5242880 },
    { id: 'old_b', title: 'Missing optional metadata', artist: '', album: '', duration: 0, fileSize: 3 },
  ]);
  assert.equal(stored[0].audioData.byteLength, 5242880);
});

test('backup imports use key checks and commit original audio and metadata together', async () => {
  const existing = { id: 'existing', title: 'Do not overwrite', audioData: new ArrayBuffer(2) };
  const newTrack = { id: 'new', title: 'Restored', audioData: new Uint8Array([10, 20, 30]).buffer };
  const checks = [], audioAdds = [], metadataAdds = [];
  const tx = { objectStore(name) {
    return name === 'tracks' ? {
      getKey(id) {
        const request = { result: id === existing.id ? id : undefined };
        checks.push(request);
        return request;
      },
      add(track) { audioAdds.push(track); },
    } : { add(row) { metadataAdds.push(row); } };
  } };
  const { api } = localDatabase();
  const db = { transaction(stores, mode) {
    assert.deepEqual(Array.from(stores), ['tracks', 'trackMetadata']);
    assert.equal(mode, 'readwrite');
    return tx;
  } };
  const imported = api.importTracks(db, [{ ...existing, title: 'Other title' }, newTrack]);
  checks.forEach(request => request.onsuccess());
  let resolved = false;
  imported.then(() => { resolved = true; });
  await Promise.resolve();
  assert.equal(resolved, false);
  assert.deepEqual(audioAdds, [newTrack]);
  assert.equal(metadataAdds[0].title, 'Restored');
  assert.equal(metadataAdds[0].fileSize, 3);
  assert.equal(metadataAdds[0].audioData, undefined);
  tx.oncomplete();
  assert.equal(await imported, 1);
});

test('library backup round-trips favorites, playlists, provider resources, album data and actual audio bytes', async () => {
  const storage = {
    melodybox_fav: ['embeat:abc', '123'],
    melodybox_pl: [{ id: 'list-1', name: '我的歌单', tracks: ['embeat:abc'] }],
    melodybox_rec: [{ id: 'embeat:abc', title: 'Music', source: 'embeat', providerId: 'abc', urlId: 'audio-resource', lyricId: 'lyric-resource', picId: 'cover-resource', isrc: 'ISRC' }],
    melodybox_tracks: { 'embeat:abc': { id: 'embeat:abc', title: 'Music', source: 'embeat', providerId: 'abc', urlId: 'audio-resource', lyricId: 'lyric-resource', picId: 'cover-resource', isrc: 'ISRC' } },
    melodybox_album_fav: ['album-1'],
    'melodybox_album_album-1': { id: 'album-1', name: 'Album', source: 'netease' },
  };
  const bytes = new Uint8Array([0, 255, 128, 1, 10]);
  const localTracks = [{ id: 'local_123_0', title: '本地音乐', fileName: 'track.mp3', fileType: 'audio/mpeg', fileSize: 5, addedAt: 123, audioData: new Blob([bytes], { type: 'audio/mpeg' }) }];
  const json = await transfer.serializeBackup(storage, localTracks);
  const restored = transfer.parseBackup(json);
  assert.deepEqual(restored.storage, storage);
  assert.deepEqual(new Uint8Array(restored.localTracks[0].audioData), bytes);
  assert.equal(restored.localTracks[0].fileType, 'audio/mpeg');
  assert.equal(restored.localTracks[0].fileName, 'track.mp3');
  const second = transfer.parseBackup(await transfer.serializeBackup(restored.storage, restored.localTracks));
  assert.deepEqual(new Uint8Array(second.localTracks[0].audioData), bytes);
});

test('merge preserves existing metadata and unions identities without mutating inputs', () => {
  const existing = { melodybox_fav: [1], melodybox_pl: [{id:'p',name:'Existing',tracks:[1]}], melodybox_tracks: {'1':{id:1,title:'Existing'}}, melodybox_rec:[{id:1,title:'Existing'}] };
  const incoming = { melodybox_fav: ['1',2], melodybox_pl: [{id:'p',name:'Incoming',tracks:[2]}], melodybox_tracks: {'1':{id:1,title:'Incoming'},'2':{id:2}}, melodybox_rec:[{id:'1',title:'Incoming'},{id:2}] };
  const before = JSON.stringify(existing);
  const merged = transfer.mergeStorage(existing,incoming);
  assert.deepEqual(merged.melodybox_fav,[1,2]);
  assert.deepEqual(merged.melodybox_pl,[{id:'p',name:'Existing',tracks:[1,2]}]);
  assert.equal(merged.melodybox_tracks['1'].title,'Existing');
  assert.deepEqual(merged.melodybox_rec,[{id:1,title:'Existing'},{id:2}]);
  assert.equal(JSON.stringify(existing),before);
});

test('failed localStorage write rolls back its own additions and preserves existing data', () => {
  const data = new Map([['melodybox_fav','[1]']]);
  const adapter = {getItem:k=>data.get(k)??null,removeItem:k=>data.delete(k),setItem(k,v){if(k==='melodybox_rec')throw Error('quota');data.set(k,v)}};
  assert.throws(()=>transfer.writeStorage(adapter,{melodybox_fav:[1,2],melodybox_rec:[{id:2}]}),/quota/);
  assert.equal(data.get('melodybox_fav'),'[1]');
  assert.equal(data.has('melodybox_rec'),false);
});

test('rejects malformed audio, versions, unrelated browser keys and dangerous fields', async () => {
  const valid = JSON.parse(await transfer.serializeBackup({},[{id:'local_1',audioData:new Uint8Array([1]).buffer}]));
  for(const mutate of [b=>b.version=2,b=>b.storage.token='secret',b=>b.localTracks[0].audioData.data='AA',b=>b.storage.melodybox_tracks=JSON.parse('{"__proto__":{}}')]) {
    const candidate=structuredClone(valid);mutate(candidate);assert.throws(()=>transfer.parseBackup(JSON.stringify(candidate)));
  }
});

test('ordinary MP3-sized audio round-trips without exhausting the regexp stack', async () => {
  const bytes = new Uint8Array(5 * 1024 * 1024).fill(173);
  const restored = transfer.parseBackup(await transfer.serializeBackup({}, [{id:'local_large_fixture',audioData:bytes.buffer}]));
  assert.deepEqual(new Uint8Array(restored.localTracks[0].audioData), bytes);
});
