'use strict';

// Share the inspected protocol with the browser; only server transport policy
// and environment configuration live here.
const protocol = require('./gd-embeat-core.js');
function createEmbeatClient({
  fetchImpl = process.env.GD_EMBEAT_CONNECT_HOST
    ? require('./gd-transport.cjs').createEmbeatTransport({ connectHost: process.env.GD_EMBEAT_CONNECT_HOST })
    : globalThis.fetch,
  version = process.env.GD_EMBEAT_VERSION || '2026.11.11',
  headers = { Accept: 'application/json', Referer: 'https://music.gdstudio.xyz/', 'User-Agent': 'Mozilla/5.0', 'X-Requested-With': 'XMLHttpRequest' },
} = {}) {
  return protocol.createEmbeatClient({ fetchImpl, version, headers });
}
module.exports = { createEmbeatClient, modifiedMD5: protocol.modifiedMD5 };
