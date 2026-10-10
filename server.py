"""
Alok Video Editor - Local HTTP Server with Clean URLs
Supports extensionless URLs (e.g. /portfolio -> portfolio.html, /product -> product.html)
"""
import http.server
import os
import sys

PORT = 5500

class CleanURLHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # Extract path without query parameters or hash
        url_path = self.path.split('?')[0].split('#')[0]
        query = ('?' + self.path.split('?', 1)[1]) if '?' in self.path else ''

        # 301 Redirects for legacy subpages to unified marketplace on root
        legacy_redirects = {
            '/plugins_and_macros': '/?category=plugin#marketplace',
            '/davinci_scripting_plugin': '/?category=scripting#marketplace',
            '/fusion_expression': '/?category=expression#marketplace',
            '/projects': '/?category=project#marketplace',
        }
        check_path = url_path.lower().rstrip('/')
        if check_path.endswith('.html'):
            check_path = check_path[:-5]
        if check_path in legacy_redirects:
            self.send_response(301)
            self.send_header('Location', legacy_redirects[check_path])
            self.end_headers()
            return

        if url_path != '/':
            _, ext = os.path.splitext(url_path)
            if not ext:
                clean_path = url_path.lstrip('/')
                candidate = clean_path + '.html'
                if os.path.isfile(candidate):
                    self.path = '/' + candidate + query

        return super().do_GET()

def run():
    http.server.ThreadingHTTPServer.allow_reuse_address = True
    try:
        with http.server.ThreadingHTTPServer(("", PORT), CleanURLHandler) as httpd:
            print("=================================================")
            print(f"  Live Preview Server running at:")
            print(f"  http://localhost:{PORT}/portfolio")
            print("  Clean URLs enabled (no .html extensions)")
            print("  Press Ctrl+C in this window anytime to stop.")
            print("=================================================")
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")
        sys.exit(0)

if __name__ == '__main__':
    run()
