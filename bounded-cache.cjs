'use strict';

// Completed values only: never store request promises in a Worker isolate.
function createBoundedCache(maxEntries = 500) {
  if (!Number.isInteger(maxEntries) || maxEntries < 1) throw new RangeError('Invalid cache capacity');
  const entries = new Map();
  return {
    get(key) {
      const entry = entries.get(key);
      if (!entry) return null;
      if (Date.now() >= entry.expiry) { entries.delete(key); return null; }
      entries.delete(key); entries.set(key, entry);
      return entry.data;
    },
    set(key, data, ttl) {
      entries.delete(key);
      if (!(ttl > 0)) return;
      entries.set(key, { data, expiry: Date.now() + ttl });
      while (entries.size > maxEntries) entries.delete(entries.keys().next().value);
    },
  };
}
module.exports = { createBoundedCache };
