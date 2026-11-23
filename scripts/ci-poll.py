#!/usr/bin/env python3
"""Опрос статуса CI-прогона GitHub Actions по SHA.

Токен берётся из DaroSite/.gt и никогда не печатается.
Использование: python3 ci-poll.py <полный-sha> [таймаут-сек]
Репо берётся из CI_REPO (по умолчанию DarkDaro/DaroSite).
Выход: 0 — completed/success; 1 — кривой аргумент; 2 — упал; 3 — таймаут.
"""
import json
import os
import sys
import time
import urllib.request

TOKEN = open("/home/z/my-project/DaroSite/.gt", encoding="utf-8").read().strip()
SHA = sys.argv[1]
TIMEOUT = float(sys.argv[2]) if len(sys.argv) > 2 else 600
if len(SHA) != 40 or not all(c in "0123456789abcdef" for c in SHA.lower()):
    # неполный или мусорный SHA выглядит как «нет прогона» и молча
    # выедает таймаут; правильный брать только через git rev-parse HEAD
    print(f"кривой SHA: длина {len(SHA)}, нужен полный 40-символьный (git rev-parse HEAD)")
    sys.exit(1)
REPO = os.environ.get("CI_REPO", "DarkDaro/DaroSite")
BASE = f"https://api.github.com/repos/{REPO}/actions/runs"
HEADERS = {
    "Authorization": f"Bearer {TOKEN}",
    "Accept": "application/vnd.github+json",
    "User-Agent": "sandbox-ci-poll",
}


def fetch(url):
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.load(r)


def find_run():
    data = fetch(f"{BASE}?head_sha={SHA}")
    runs = data.get("workflow_runs", [])
    if not runs:
        # страховка: если фильтр head_sha у API молча отдал пустоту,
        # берём последние прогоны и сверяем SHA на клиенте
        data = fetch(f"{BASE}?per_page=30")
        runs = [r for r in data.get("workflow_runs", []) if r.get("head_sha") == SHA]
    return runs[0] if runs else None


def status():
    run = find_run()
    if not run:
        return "нет прогона"
    return f"{run['status']}/{run.get('conclusion') or '-'}"


deadline = time.time() + TIMEOUT
prev = None
while time.time() < deadline:
    try:
        cur = status()
    except Exception as e:  # сетевые сбои не роняют опрос
        cur = f"ошибка опроса: {type(e).__name__}"
    if cur != prev:
        print(cur, flush=True)
        prev = cur
    if cur == "completed/success":
        sys.exit(0)
    if cur.startswith("completed/"):
        sys.exit(2)
    time.sleep(30)
print("таймаут ожидания CI")
sys.exit(3)
