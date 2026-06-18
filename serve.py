import http.server
import socketserver
import os
import sys

DIR = '/Users/futaiyi/WorkBuddy/2026-06-16-13-40-38/music-player'
os.chdir(DIR)
print(f"DEBUG: CWD={os.getcwd()}", file=sys.stderr)
print(f"DEBUG: DIR exists={os.path.isdir(DIR)}", file=sys.stderr)
print(f"DEBUG: index.html exists={os.path.isfile('index.html')}", file=sys.stderr)
print(f"DEBUG: Files: {os.listdir('.')[:5]}", file=sys.stderr)

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIR, **kwargs)
    
    def translate_path(self, path):
        result = super().translate_path(path)
        print(f"DEBUG translate_path: {path} -> {result}", file=sys.stderr)
        return result

PORT = 8899
with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"Serving {DIR} on port {PORT}")
    httpd.serve_forever()
