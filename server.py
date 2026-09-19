#!/usr/bin/env python3
"""
ABC University – Cybersecurity Controls Simulator Local Server
Standalone zero-dependency local HTTP server for coursework evaluation.
"""

import http.server
import socketserver
import os
import sys

DEFAULT_PORT = 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        super().end_headers()

def run_server(port=DEFAULT_PORT):
    for p in range(port, port + 10):
        try:
            socketserver.TCPServer.allow_reuse_address = True
            with socketserver.TCPServer(("", p), Handler) as httpd:
                print("=" * 72)
                print(f"🛡️  ABC UNIVERSITY - CYBERSECURITY CONTROLS SIMULATOR RUNNING")
                print(f"📍 Local URL: http://localhost:{p}")
                print(f"📁 Serving Directory: {DIRECTORY}")
                print(f"⚠️  SIMULATED ACADEMIC ENVIRONMENT - FOR EDUCATIONAL USE ONLY")
                print("=" * 72)
                httpd.serve_forever()
        except OSError as e:
            if "Address already in use" in str(e):
                continue
            else:
                raise e
    print("Error: Could not bind to ports 8080-8089.")
    sys.exit(1)

if __name__ == "__main__":
    p = DEFAULT_PORT
    if len(sys.argv) > 1:
        try:
            p = int(sys.argv[1])
        except ValueError:
            pass
    run_server(p)
