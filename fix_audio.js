const fs = require('fs');
const path = '/Users/futaiyi/WorkBuddy/2026-06-16-13-40-38/music-player/player.js';
let c = fs.readFileSync(path, 'utf8');

// 1. 在 togglePlay 的 else 分支中，audio.play() 之前加入 initAudioContext 调用
const oldToggle = `function togglePlay() {
  if (!state.currentTrack) return;
  if (state.isPlaying) {
    audio.pause();
    state.isPlaying = false;
    updatePlayBtn();
  } else {
    audio.play().then(() => {
      state.isPlaying = true;
      updatePlayBtn();
    }).catch(() => showToast('播放失败'));
  }
}`;

const newToggle = `function togglePlay() {
  if (!state.currentTrack) return;
  if (state.isPlaying) {
    audio.pause();
    state.isPlaying = false;
    updatePlayBtn();
  } else {
    // 关键：在用户手势中初始化/恢复 AudioContext，否则浏览器会 blocked
    if (typeof initAudioContext === 'function') initAudioContext();
    if (typeof resumeAudioContext === 'function') resumeAudioContext();
    audio.play().then(() => {
      state.isPlaying = true;
      updatePlayBtn();
    }).catch(() => showToast('播放失败'));
  }
}`;

if (!c.includes(oldToggle)) {
  console.error('ERROR: oldToggle not found!');
  // Try alternate pattern
  const altOld = 'function togglePlay() {';
  const idx = c.indexOf(altOld);
  console.log('togglePlay found at:', idx);
  if (idx > 0) console.log('Context:', JSON.stringify(c.substring(idx, idx + 350)));
  process.exit(1);
}

c = c.replace(oldToggle, newToggle);

// 2. 从 audio 'play' 事件监听器里移除 initAudioContext/resumeAudioContext 调用
//    因为它们已经在 togglePlay 的用户手势中调用了
const oldPlayHandler = `audio.addEventListener('play', () => {
  state.isPlaying = true;
  updatePlayBtn();
  // 尽早初始化 AudioContext，避免全屏后才初始化导致音频断开
  if (typeof initAudioContext === 'function') initAudioContext();
  if (typeof resumeAudioContext === 'function') resumeAudioContext();
  if (ampIsShowing) { updateAmpPlayBtn(); startVisualizer(state.currentTrack); }
});`;

const newPlayHandler = `audio.addEventListener('play', () => {
  state.isPlaying = true;
  updatePlayBtn();
  // AudioContext 已在 togglePlay 用户手势中初始化，这里只管全屏可视化
  if (ampIsShowing) { updateAmpPlayBtn(); startVisualizer(state.currentTrack); }
});
`;

if (!c.includes(oldPlayHandler)) {
  console.warn('WARN: oldPlayHandler not found, trying alternate...');
  // The play handler might have different whitespace - find and replace by pattern
  const playIdx = c.indexOf("audio.addEventListener('play'");
  if (playIdx > 0) {
    const endIdx = c.indexOf('});', playIdx) + 3;
    console.log('Found play handler at:', playIdx, 'ending at:', endIdx);
    console.log('Current content:', JSON.stringify(c.substring(playIdx, endIdx)));
  }
} else {
  c = c.replace(oldPlayHandler, newPlayHandler);
  console.log('Replaced play handler');
}

// 3. 检查 initAudioContext 中 createMediaElementSource 成功后是否正确连接
//    确保 _sourceNode.connect(_analyser) 和 _analyser.connect(_audioCtx.destination) 都存在
const sourceConnectIdx = c.indexOf('_sourceNode = _audioCtx.createMediaElementSource(audio)');
console.log('createMediaElementSource location:', sourceConnectIdx);
if (sourceConnectIdx > 0) {
  const snippet = c.substring(sourceConnectIdx, sourceConnectIdx + 300);
  console.log('Connection code:', snippet);
  // 确认有 connect 调用
  if (!snippet.includes('_sourceNode.connect(_analyser)')) {
    console.error('ERROR: _sourceNode.connect(_analyser) not found after createMediaElementSource!');
  } else {
    console.log('OK: sourceNode.connect(analyser) found');
  }
  if (!snippet.includes('_analyser.connect(_audioCtx.destination)')) {
    console.error('ERROR: _analyser.connect(_audioCtx.destination) not found!');
  } else {
    console.log('OK: analyser.connect(destination) found');
  }
}

// Write back
fs.writeFileSync(path, c, 'utf8');
console.log('File written successfully');

// Verify syntax
try {
  new Function(c);
  console.log('Syntax check: PASS');
} catch(e) {
  console.error('Syntax check: FAIL -', e.message);
}
