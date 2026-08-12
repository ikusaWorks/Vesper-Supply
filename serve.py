#!/usr/bin/env python3
"""Minimal static file server for local preview.

Serves this directory on http://127.0.0.1:4173.

Uses an explicit absolute directory rather than the process working directory,
because os.getcwd() is not permitted for every process context on macOS.

Run it with:  python3 serve.py
Stop it with: Ctrl-C
"""

import functools
import http.server
import os
import socketserver

ROOT = os.path.dirname(os.path.abspath(__file__))
PORT = 4173


class QuietHandler(http.server.SimpleHTTPRequestHandler):
    """SimpleHTTPRequestHandler with no-cache headers so edits show up on reload."""

    def end_headers(self):
        self.send_header("Cache-Control", "no-store, must-revalidate")
        super().end_headers()


def main():
    handler = functools.partial(QuietHandler, directory=ROOT)
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("127.0.0.1", PORT), handler) as httpd:
        print("Vesper Supply preview: http://127.0.0.1:%d" % PORT)
        print("Serving: %s" % ROOT)
        httpd.serve_forever()


if __name__ == "__main__":
    main()
