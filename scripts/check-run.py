#!/usr/bin/env python3
"""Диагностика упавшего workflow: шаги job'а + строки ошибок из логов."""
import json
import subprocess
import sys
import zipfile
import io

TOKEN = sys.argv[1]
REPO = "DarkDaro/History-of-Daro"
HDR = ["-H", f"Authorization: Bearer {TOKEN}", "-H", "Accept: application/vnd.github+json"]
BASE = f"https://api.github.com/repos/{REPO}"


def api(path, raw=False):
    out = subprocess.run(
        ["curl", "-s", "--max-time", "30", "-L", *HDR, f"{BASE}{path}"],
        capture_output=True,
    ).stdout
    return out if raw else json.loads(out)


runs = api("/actions/runs?per_page=2")
run = runs["workflow_runs"][0]
print(f"run #{run['run_number']} {run['head_sha'][:7]}: {run['status']} / {run['conclusion']}")

jobs = api(f"/actions/runs/{run['id']}/jobs")
for job in jobs.get("jobs", []):
    print(f"\n== JOB: {job['name']} -> {job['conclusion']}")
    for s in job.get("steps", []):
        print(f"   step: {s['name']:<28} {s['conclusion']}")

logs = api(f"/actions/runs/{run['id']}/logs", raw=True)
try:
    z = zipfile.ZipFile(io.BytesIO(logs))
    for name in z.namelist():
        text = z.read(name).decode("utf-8", "replace")
        hits = [
            ln.split("Z ", 1)[-1]
            for ln in text.splitlines()
            if "##[error]" in ln or "Error:" in ln or "error -" in ln or "npm ERR!" in ln
        ]
        if hits:
            print(f"\n== LOG {name}")
            for ln in hits[:15]:
                print("  ", ln[:240])
except zipfile.BadZipFile:
    print("\nlogs: не удалось скачать (нет прав actions:read или ещё не готовы)")
