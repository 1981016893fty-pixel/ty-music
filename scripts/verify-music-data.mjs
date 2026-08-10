const baseUrl = (process.env.MUSIC_URL || 'http://localhost:18899').replace(/\/$/, '');

const genres = [
  ['流行乐', '热门流行'],
  ['摇滚', '经典摇滚'],
  ['电子', '电子舞曲'],
  ['嘻哈', '嘻哈说唱'],
  ['爵士', '爵士经典'],
  ['古典', '古典音乐'],
  ['R&B', 'R&B节奏蓝调'],
  ['乡村', '乡村音乐'],
  ['K-Pop', 'K-pop韩国流行'],
  ['华语', '华语热门'],
  ['拉丁', '拉丁音乐'],
  ['动漫', '动漫主题曲'],
];

function fail(message) {
  throw new Error(message);
}

async function getJson(path) {
  const response = await fetch(baseUrl + path);
  if (!response.ok) fail(`${path} returned HTTP ${response.status}`);
  return response.json();
}

function assertTrack(track, label) {
  const required = ['id', 'name', 'artist', 'album', 'albumId', 'picId', 'cover', 'coverSmall'];
  for (const field of required) {
    if (!String(track?.[field] || '').trim()) fail(`${label} is missing ${field}`);
  }
  if (!Number.isFinite(Number(track.duration)) || Number(track.duration) <= 0) {
    fail(`${label} has an invalid duration`);
  }
  if (!String(track.cover).includes('size=1000')) fail(`${label} does not use a 1000px cover`);
  if (!String(track.coverSmall).includes('size=300')) fail(`${label} does not use a 300px thumbnail`);
}

async function verifyGenre([name, query]) {
  const data = await getJson(`/api/music/search?keywords=${encodeURIComponent(query)}&source=netease&limit=8`);
  if (!Array.isArray(data.songs) || data.songs.length === 0) fail(`${name} returned no tracks`);
  const ids = new Set();
  data.songs.forEach((track, index) => {
    assertTrack(track, `${name}[${index}]`);
    if (ids.has(track.id)) fail(`${name} contains duplicate id ${track.id}`);
    ids.add(track.id);
  });
  return data.songs[0];
}

async function verifyCover(track, label) {
  const response = await fetch(baseUrl + track.cover);
  const contentType = response.headers.get('content-type') || '';
  if (!response.ok || !contentType.startsWith('image/')) {
    fail(`${label} cover did not resolve to an image`);
  }
  const body = await response.arrayBuffer();
  if (body.byteLength < 10_000) fail(`${label} cover response is unexpectedly small`);
}

const genreSamples = [];
for (const genre of genres) genreSamples.push(await verifyGenre(genre));

const featuredExpected = new Map([
  ['1406633327', { name: 'Blinding Lights', artist: 'The Weeknd' }],
  ['32337668', { name: 'The Hills', artist: 'The Weeknd' }],
  ['442867526', { name: 'Die For You', artist: 'The Weeknd' }],
  ['32507839', { name: "Can't Feel My Face", artist: 'The Weeknd' }],
  ['548785552', { name: 'Call Out My Name', artist: 'The Weeknd' }],
  ['2670864154', { name: 'Timeless', artist: 'The Weeknd' }]
]);
const featured = await getJson('/api/discover/featured?limit=6');
if (featured.collection?.name !== 'The Weeknd' || featured.collection?.type !== 'curated') {
  fail('精选推荐 is not identified as the curated The Weeknd collection');
}
if (!Array.isArray(featured.songs) || featured.songs.length !== featuredExpected.size) {
  fail('精选推荐 did not return the complete curated The Weeknd collection');
}
const featuredIds = new Set();
for (const [index, track] of featured.songs.entries()) {
  assertTrack(track, `精选推荐[${index}]`);
  const expected = featuredExpected.get(String(track.id));
  if (!expected || track.name !== expected.name || track.artist !== expected.artist) {
    fail(`精选推荐 contains an unexpected track: ${track.artist} - ${track.name}`);
  }
  if (featuredIds.has(track.id)) fail(`精选推荐 contains duplicate id ${track.id}`);
  featuredIds.add(track.id);
  const audio = await fetch(`${baseUrl}/api/music/proxy?id=${encodeURIComponent(track.id)}`, { redirect: 'manual' });
  if (audio.status !== 302 || !audio.headers.get('location')) {
    fail(`精选推荐[${index}] has no playable GD proxy URL`);
  }
}

const hot = await getJson('/api/music/hot?source=netease&limit=10');
if (hot.chart?.playlistId !== '3778678') fail('热门排行榜 is not sourced from 网易云热歌榜 (3778678)');
if (!Array.isArray(hot.songs) || hot.songs.length < 10) fail('热门排行榜 returned fewer than 10 tracks');
hot.songs.forEach((track, index) => assertTrack(track, `热门排行榜[${index}]`));

const albumId = String(hot.songs[0].albumId);
const album = await getJson(
  `/api/album?id=${encodeURIComponent(albumId)}&name=${encodeURIComponent(hot.songs[0].album)}&artist=${encodeURIComponent(hot.songs[0].artist)}&songId=${encodeURIComponent(hot.songs[0].id)}`
);
if (!Array.isArray(album.songs) || album.songs.length === 0) fail(`专辑 ${albumId} returned no tracks`);
const albumTrackIds = new Set();
album.songs.forEach((track, index) => {
  assertTrack(track, `专辑 ${albumId}[${index}]`);
  if (String(track.albumId) !== albumId) fail(`专辑 ${albumId} contains a track from album ${track.albumId}`);
  if (albumTrackIds.has(track.id)) fail(`专辑 ${albumId} contains duplicate id ${track.id}`);
  albumTrackIds.add(track.id);
});

await verifyCover(hot.songs[0], '热门排行榜首曲');
await verifyCover(genreSamples[0], '流行乐首曲');

console.log(`Verified ${genres.length} genres, ${featured.songs.length} curated The Weeknd tracks, ${hot.songs.length} chart tracks, and ${album.songs.length} album tracks.`);
