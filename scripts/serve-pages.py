#!/usr/bin/env python3
"""Локальный сервер для проверки Pages-сборки (out/ собран с basePath).

Отдаёт содержимое out/ под префиксом /History-of-Daro — так же,
как это делает GitHub Pages. Симлинки в песочнице запрещены, поэтому
префикс снимается в translate_path.

Запуск из корня репозитория:
    python3 scripts/serve-pages.py [порт]     # по умолчанию 8901
Проверка:
    http://localhost:8901/History-of-Daro/
"""
import http.server
import os
import sys

ROOT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "out")
BASE = "/History-of-Daro"


class Handler(http.server.SimpleHTTPRequestHandler):
    def translate_path(self, path):
        if path.startswith(BASE):
            path = path[len(BASE):] or "/"
        return super().translate_path(path)

    def log_message(self, *args):  # тишина в логах
        pass


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8901
    os.chdir(ROOT)
    server = http.server.ThreadingHTTPServer(("127.0.0.1", port), Handler)
    print(f"serving {ROOT} at http://localhost:{port}{BASE}/")
    server.serve_forever()
