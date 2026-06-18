#!/usr/bin/env python3
"""MelodyBox Audio Proxy — Meting API audio + YouTube search/stream via yt-dlp.
Usage:
  python3 proxy.py                        # listen on :9999
  python3 proxy.py --proxy socks5://127.0.0.1:1080   # with proxy for YouTube
Set env YT_PROXY to configure the proxy without CLI args.
"""

import http.server
import urllib.request
import urllib.parse
import ssl
import re
import sys
import json
import time
import subprocess
import os
import threading

PORT = 9999
CACHE_TTL = 300  # 5 min for resolved URLs
YT_CACHE_TTL = 3600  # 1 hour for YouTube URLs
PREVIEW_THRESHOLD = 1_200_000  # < 1.2MB = preview

# --- Proxy config ---
YT_PROXY = None  # e.g. "socks5://127.0.0.1:1080"

# --- Caches ---
_url_cache = {}       # meting_url -> (final_url, content_length, is_preview, ts)
_yt_search_cache = {} # query -> (results_json, ts)
_yt_url_cache = {}    # video_id -> (stream_url, expiry_ts)

# --- SSL ---
_ssl_ctx = ssl.create_default_context()

# --- Paths ---
YT_DLP = '/Users/futaiyi/.workbuddy/binaries/python/envs/default/bin/yt-dlp'


def resolve_meting_url(meting_url):
    """Follow meting API redirect to get actual mp3 URL."""
    now = time.time()
    if meting_url in _url_cache:
        cached_url, cl, is_pv, ts = _url_cache[meting_url]
        if now - ts < CACHE_TTL:
            return cached_url, cl, is_pv

    req = urllib.request.Request(meting_url, method='HEAD', headers={
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        'Referer': 'https://music.163.com/',
    })
    resp = urllib.request.urlopen(req, timeout=10, context=_ssl_ctx)
    final_url = resp.geturl()
    content_length = resp.headers.get('Content-Length')
    resp.close()

    cl = int(content_length) if content_length else 0
    is_preview = 0 < cl < PREVIEW_THRESHOLD

    _url_cache[meting_url] = (final_url, cl, is_preview, now)
    if is_preview:
        print(f'[proxy] ⚠ Preview detected: {cl} bytes (~{cl * 8 // 128000}s @ 128kbps)', file=sys.stderr)
    return final_url, cl, is_preview


def yt_search(query, limit=10):
    """Search YouTube using yt-dlp flat playlist mode."""
    now = time.time()
    cache_key = f'{query}_{limit}'
    if cache_key in _yt_search_cache:
        results, ts = _yt_search_cache[cache_key]
        if now - ts < CACHE_TTL:
            return results

    cmd = [YT_DLP, f'ytsearch{limit}:{query}', '--flat-playlist',
           '--print', '%(id)s|||%(title)s|||%(duration)s|||%(channel)s', '--no-warnings']
    if YT_PROXY:
        cmd.extend(['--proxy', YT_PROXY])

    print(f'[proxy] 🔍 YouTube search: {query[:60]}', file=sys.stderr)
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=20)
        lines = result.stdout.strip().split('\n')
        results = []
        for line in lines:
            if '|||' not in line:
                continue
            parts = line.split('|||')
            if len(parts) < 3:
                continue
            vid, title, dur = parts[0], parts[1], parts[2]
            channel = parts[3] if len(parts) > 3 else ''
            try:
                duration = int(float(dur)) if dur and dur != 'None' else 0
            except:
                duration = 0
            results.append({
                'id': 'yt_' + vid,
                'videoId': vid,
                'title': title,
                'artist': channel,
                'album': '',
                'cover': f'https://i.ytimg.com/vi/{vid}/hqdefault.jpg',
                'coverSmall': f'https://i.ytimg.com/vi/{vid}/mqdefault.jpg',
                'duration': duration,
                'previewUrl': f'/youtube/stream?id={vid}',
                'lyricsUrl': '',
                'source': 'youtube',
            })
        _yt_search_cache[cache_key] = (results, now)
        print(f'[proxy] ✅ YouTube found {len(results)} results', file=sys.stderr)
        return results
    except Exception as e:
        print(f'[proxy] ❌ YouTube search error: {e}', file=sys.stderr)
        return []


def yt_get_stream_url(video_id):
    """Get a direct streamable audio URL for a YouTube video."""
    now = time.time()
    if video_id in _yt_url_cache:
        url, expiry = _yt_url_cache[video_id]
        if now < expiry:
            return url

    # Get best audio URL
    cmd = [YT_DLP, '-f', 'bestaudio[ext=m4a]/bestaudio/best',
           '--get-url', '--no-warnings',
           f'https://www.youtube.com/watch?v={video_id}']
    if YT_PROXY:
        cmd.extend(['--proxy', YT_PROXY])

    print(f'[proxy] 🎵 Extracting audio URL for: {video_id}', file=sys.stderr)
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
        url = result.stdout.strip()
        if not url or 'ERROR' in result.stderr:
            # Fallback: try piping audio through yt-dlp
            print(f'[proxy] ⚠ Direct URL failed, will stream via yt-dlp', file=sys.stderr)
            return None

        _yt_url_cache[video_id] = (url, now + YT_CACHE_TTL)
        print(f'[proxy] ✅ Got audio URL: {url[:80]}...', file=sys.stderr)
        return url
    except Exception as e:
        print(f'[proxy] ❌ yt-dlp extract error: {e}', file=sys.stderr)
        return None


def yt_pipe_stream(video_id, wfile):
    """Stream YouTube audio by piping yt-dlp output directly."""
    cmd = [YT_DLP, '-f', 'bestaudio[ext=m4a]/bestaudio/best',
           '-o', '-', '--no-warnings',
           f'https://www.youtube.com/watch?v={video_id}']
    if YT_PROXY:
        cmd.extend(['--proxy', YT_PROXY])

    print(f'[proxy] 🎵 Piping YouTube audio: {video_id}', file=sys.stderr)
    proc = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    try:
        while True:
            chunk = proc.stdout.read(65536)
            if not chunk:
                break
            try:
                wfile.write(chunk)
            except (BrokenPipeError, ConnectionResetError):
                break
        proc.wait(timeout=5)
    except Exception as e:
        print(f'[proxy] Pipe error: {e}', file=sys.stderr)
        proc.kill()
    finally:
        try:
            proc.kill()
        except:
            pass


def yt_download_and_serve(video_id, wfile):
    """Download YouTube audio to temp file and stream it with proper headers."""
    import tempfile
    tmp_path = os.path.join(tempfile.gettempdir(), f'yt_{video_id}.m4a')

    if not os.path.exists(tmp_path):
        cmd = [YT_DLP, '-f', 'bestaudio[ext=m4a]/bestaudio/best',
               '-o', tmp_path, '--no-warnings',
               f'https://www.youtube.com/watch?v={video_id}']
        if YT_PROXY:
            cmd.extend(['--proxy', YT_PROXY])
        print(f'[proxy] ⬇ Downloading YouTube audio: {video_id}', file=sys.stderr)
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=120)
        if result.returncode != 0:
            print(f'[proxy] ❌ Download failed: {result.stderr[:200]}', file=sys.stderr)
            return False
        print(f'[proxy] ✅ Downloaded: {os.path.getsize(tmp_path)} bytes', file=sys.stderr)

    # Stream from temp file
    try:
        with open(tmp_path, 'rb') as f:
            while True:
                chunk = f.read(65536)
                if not chunk:
                    break
                try:
                    wfile.write(chunk)
                except (BrokenPipeError, ConnectionResetError):
                    break
        return True
    except Exception as e:
        print(f'[proxy] Stream error: {e}', file=sys.stderr)
        return False


class AudioProxyHandler(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        global YT_PROXY
        parsed = urllib.parse.urlparse(self.path)

        # Health check
        if parsed.path == '/health':
            self._json_reply({'status': 'ok', 'yt_proxy': YT_PROXY, 'ytdlp': os.path.exists(YT_DLP)})
            return

        # Proxy config endpoint
        if parsed.path == '/config':
            qs = urllib.parse.parse_qs(parsed.query)
            if 'proxy' in qs:
                YT_PROXY = qs['proxy'][0]
                os.environ['YT_PROXY'] = YT_PROXY
                print(f'[proxy] 🔧 Proxy set to: {YT_PROXY}', file=sys.stderr)
                # Clear caches when proxy changes
                _yt_search_cache.clear()
                _yt_url_cache.clear()
            self._json_reply({'yt_proxy': YT_PROXY, 'ytdlp': os.path.exists(YT_DLP)})
            return

        # YouTube search
        if parsed.path == '/youtube/search':
            qs = urllib.parse.parse_qs(parsed.query)
            query = qs.get('q', [''])[0]
            limit = int(qs.get('limit', ['10'])[0])
            if not query:
                self._error(400, 'Missing q parameter')
                return
            results = yt_search(query, limit)
            self._json_reply(results)
            return

        # YouTube stream (direct URL method)
        if parsed.path == '/youtube/stream':
            qs = urllib.parse.parse_qs(parsed.query)
            video_id = qs.get('id', [''])[0]
            if not video_id:
                self._error(400, 'Missing id parameter')
                return

            # Try direct URL first
            stream_url = yt_get_stream_url(video_id)
            if stream_url:
                try:
                    req = urllib.request.Request(stream_url, headers={
                        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
                        'Accept': '*/*',
                    })
                    resp = urllib.request.urlopen(req, timeout=15, context=_ssl_ctx)
                    content_type = resp.headers.get('Content-Type', 'audio/mp4')
                    content_length = resp.headers.get('Content-Length')

                    self.send_response(200)
                    self.send_header('Content-Type', content_type)
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.send_header('Accept-Ranges', 'bytes')
                    if content_length:
                        self.send_header('Content-Length', content_length)
                    self.end_headers()

                    while True:
                        chunk = resp.read(65536)
                        if not chunk:
                            break
                        try:
                            self.wfile.write(chunk)
                        except (BrokenPipeError, ConnectionResetError):
                            break
                    resp.close()
                    return
                except Exception as e:
                    print(f'[proxy] ⚠ Direct stream failed: {e}, falling back to pipe', file=sys.stderr)

            # Fallback: download and serve
            self.send_response(200)
            self.send_header('Content-Type', 'audio/mp4')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Accept-Ranges', 'bytes')
            self.end_headers()
            success = yt_download_and_serve(video_id, self.wfile)
            if not success:
                print(f'[proxy] ❌ All stream methods failed for {video_id}', file=sys.stderr)
            return

        # Check endpoint: returns preview status
        if parsed.path == '/check':
            qs = urllib.parse.parse_qs(parsed.query)
            meting_url = qs.get('url', [None])[0]
            if not meting_url:
                self._error(400, 'Missing url parameter')
                return
            try:
                _, cl, is_preview = resolve_meting_url(meting_url)
                est_duration = (cl * 8) // 128000 if cl > 0 else 0
                self._json_reply({
                    'is_preview': is_preview,
                    'size': cl,
                    'est_duration': est_duration,
                    'size_mb': round(cl / 1048576, 2) if cl > 0 else 0,
                })
            except Exception as e:
                print(f'[proxy] Check error: {e}', file=sys.stderr)
                self._error(502, f'Failed to check: {e}')
            return

        # Audio proxy: /audio?url=<encoded_meting_url>
        if parsed.path == '/audio':
            qs = urllib.parse.parse_qs(parsed.query)
            meting_url = qs.get('url', [None])[0]
            if not meting_url:
                self._error(400, 'Missing url parameter')
                return

            try:
                real_mp3_url, cl, is_preview = resolve_meting_url(meting_url)
                mp3_req = urllib.request.Request(real_mp3_url, headers={
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
                    'Referer': 'https://music.163.com/',
                })
                mp3_resp = urllib.request.urlopen(mp3_req, timeout=15, context=_ssl_ctx)

                content_type = mp3_resp.headers.get('Content-Type', 'audio/mpeg')
                content_length = mp3_resp.headers.get('Content-Length')

                self.send_response(200)
                self.send_header('Content-Type', content_type)
                self.send_header('Access-Control-Allow-Origin', '*')
                self.send_header('Accept-Ranges', 'bytes')
                self.send_header('X-Audio-Size', str(cl) if cl else (content_length or '0'))
                self.send_header('X-Is-Preview', 'true' if is_preview else 'false')
                if content_length:
                    self.send_header('Content-Length', content_length)
                self.end_headers()

                while True:
                    chunk = mp3_resp.read(65536)
                    if not chunk:
                        break
                    self.wfile.write(chunk)
                mp3_resp.close()

            except Exception as e:
                print(f'[proxy] Audio error: {e}', file=sys.stderr)
                self._error(502, f'Failed to fetch audio: {e}')
            return

        # Fallback
        self._error(404, 'Not Found')

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, X-Proxy')
        self.end_headers()

    def _json_reply(self, data):
        body = json.dumps(data, ensure_ascii=False).encode('utf-8')
        self.send_response(200)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _error(self, code, msg):
        body = json.dumps({'error': msg}).encode('utf-8')
        self.send_response(code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, format, *args):
        if '/youtube' in self.path or '/audio' in self.path or '/check' in self.path:
            print(f'[proxy] {args[0]}', file=sys.stderr)


if __name__ == '__main__':
    # Parse CLI args for --proxy
    import argparse
    ap = argparse.ArgumentParser()
    ap.add_argument('--proxy', help='Proxy for YouTube, e.g. socks5://127.0.0.1:1080')
    ap.add_argument('--port', type=int, default=PORT)
    args = ap.parse_args()

    if args.proxy:
        YT_PROXY = args.proxy
        os.environ['YT_PROXY'] = YT_PROXY
    elif os.environ.get('YT_PROXY'):
        YT_PROXY = os.environ['YT_PROXY']

    print(f'🎵 MelodyBox Audio Proxy on http://localhost:{args.port}', file=sys.stderr)
    if YT_PROXY:
        print(f'🌐 YouTube proxy: {YT_PROXY}', file=sys.stderr)
    else:
        print(f'⚠️  No YouTube proxy configured — YouTube search won\'t work', file=sys.stderr)
        print(f'   Start with: python3 proxy.py --proxy socks5://127.0.0.1:1080', file=sys.stderr)
        print(f'   Or set proxy via: curl http://localhost:{args.port}/config?proxy=socks5://127.0.0.1:1080', file=sys.stderr)

    server = http.server.HTTPServer(('127.0.0.1', args.port), AudioProxyHandler)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print('\nShutting down...', file=sys.stderr)
