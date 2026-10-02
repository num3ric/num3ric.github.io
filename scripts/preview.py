#!/usr/bin/env python3
"""Serve this static site locally, rewriting production URLs in text responses."""
import argparse
import io
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


class PreviewHandler(SimpleHTTPRequestHandler):
    def send_head(self):
        path = Path(self.translate_path(self.path))
        if path.is_dir():
            # Let the base handler redirect missing trailing slashes.
            if not self.path.split('?', 1)[0].endswith('/'):
                return super().send_head()
            path = path / 'index.html'
        if path.is_file() and path.suffix in {'.html', '.css', '.xml'}:
            content = path.read_bytes().replace(b'https://num3ric.github.io/', b'/')
            content = content.replace(b'http://num3ric.github.io/', b'/')
            self.send_response(200)
            self.send_header('Content-Type', self.guess_type(str(path)) + '; charset=utf-8')
            self.send_header('Content-Length', str(len(content)))
            self.send_header('Cache-Control', 'no-store')
            self.end_headers()
            return io.BytesIO(content)
        return super().send_head()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--port', type=int, default=8000)
    args = parser.parse_args()
    handler = partial(PreviewHandler, directory=str(ROOT))
    with ThreadingHTTPServer(('127.0.0.1', args.port), handler) as server:
        print(f'Preview: http://127.0.0.1:{args.port}/', flush=True)
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            pass


if __name__ == '__main__':
    main()
