import { httpServerHandler } from 'cloudflare:node';
import api from '../server-simple.js';

api.createServer({ staticFiles: false }).listen(8899);
const backend = httpServerHandler({ port: 8899 });

export default {
  async fetch(request, env, context) {
    if (!new URL(request.url).pathname.startsWith('/api/')) return env.ASSETS.fetch(request);
    return backend.fetch(request, env, context);
  },
};
