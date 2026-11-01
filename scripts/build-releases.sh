#!/usr/bin/env bash
# Сборка трёх релизных архивов «История Даро» (static / source / standalone).
# Не трогает .next основного проекта — там живёт dev-сервер площадки:
# клонирует репозиторий в /tmp/build и собирает в клоне.
set -euo pipefail

PROJ=/home/z/my-project
REL=/tmp/rel
BUILD="$PROJ/_archive/build"

rm -rf "$REL" "$BUILD"
mkdir -p "$REL"

echo "=== 1/6 Клон репозитория ==="
git clone --quiet "$PROJ" "$BUILD"

echo "=== 2/6 node_modules (жёсткие ссылки) ==="
cp -al "$PROJ/node_modules" "$BUILD/node_modules" 2>/dev/null || cp -a "$PROJ/node_modules" "$BUILD/node_modules"

echo "=== 3/6 Статический экспорт (out/) ==="
cd "$BUILD" && npm run build:static > /tmp/build-static.log 2>&1 || { tail -25 /tmp/build-static.log; exit 1; }
tail -3 /tmp/build-static.log

echo "=== 4/6 zip статики ==="
( cd "$BUILD/out" && find . -type f -printf '%P\n' | zip -qX "$REL/daro-site-static.zip" -@ )

echo "=== 5/6 Серверная сборка (standalone) ==="
cd "$BUILD" && npm run build > /tmp/build-server.log 2>&1 || { tail -25 /tmp/build-server.log; exit 1; }
tail -3 /tmp/build-server.log
( cd "$BUILD/.next/standalone" && find . -type f -printf '%P\n' | grep -v '^public/releases/' | zip -qX "$REL/daro-site-standalone.zip" -@ )

echo "=== 6/6 Исходники (tracked files, без релизных zip) ==="
( cd "$BUILD" && git ls-files | grep -v '^public/releases/' | zip -qX "$REL/daro-site-source.zip" -@ )

echo "=== Проверка целостности ==="
unzip -t "$REL/daro-site-static.zip" > /dev/null && echo "static ZIP OK: $(unzip -l "$REL/daro-site-static.zip" | tail -1 | awk '{print $2}') файлов"
unzip -t "$REL/daro-site-standalone.zip" > /dev/null && echo "standalone ZIP OK: $(unzip -l "$REL/daro-site-standalone.zip" | tail -1 | awk '{print $2}') файлов"
unzip -t "$REL/daro-site-source.zip" > /dev/null && echo "source ZIP OK: $(unzip -l "$REL/daro-site-source.zip" | tail -1 | awk '{print $2}') файлов"

echo "=== manifest.json ==="
python3 - <<'PY'
import hashlib, json, os
rel = "/tmp/rel"
def info(name):
    p = os.path.join(rel, name)
    h = hashlib.sha256()
    with open(p, "rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return {"file": name, "size": os.path.getsize(p), "sha256": h.hexdigest()}
m = {
    "generated": "2026-11-01",
    "static": info("daro-site-static.zip"),
    "source": info("daro-site-source.zip"),
    "standalone": info("daro-site-standalone.zip"),
}
with open(os.path.join(rel, "manifest.json"), "w") as f:
    json.dump(m, f, indent=2, ensure_ascii=False)
print("готово:", ", ".join(f"{k}={v['size']}" for k, v in m.items() if isinstance(v, dict)))
PY

echo "=== Раскладка по каналам ==="
cp "$REL"/daro-site-*.zip "$REL/manifest.json" "$PROJ/public/releases/"
mkdir -p "$PROJ/download"
cp "$REL"/daro-site-*.zip "$PROJ/download/"
ls -la "$PROJ/public/releases/"
echo "=== ВСЁ ==="
