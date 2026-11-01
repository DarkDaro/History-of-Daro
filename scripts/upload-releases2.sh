#!/usr/bin/env bash
# Загрузка релизов: pixeldrain (90 дней) -> gofile -> file.io -> tmpfiles (60 мин).
set -uo pipefail
REL=/tmp/rel

jget() { python3 -c "import sys,json;d=json.load(sys.stdin);print(d$1)" 2>/dev/null; }

upload_pd() {  # pixeldrain
  local r id
  r=$(curl -s --max-time 280 -H "Accept: application/json" -F "file=@$1" https://pixeldrain.com/api/file 2>/dev/null)
  id=$(echo "$r" | jget "['id']")
  [ -n "$id" ] && echo "https://pixeldrain.com/u/$id"
}
upload_gf() {  # gofile (store-сервер напрямую)
  local r page
  r=$(curl -s --max-time 280 -F "file=@$1" https://store1.gofile.io/contents/uploadfile 2>/dev/null)
  page=$(echo "$r" | jget "['data']['downloadPage']")
  [ -n "$page" ] && echo "$page"
}
upload_fio() { # file.io
  local r link
  r=$(curl -s --max-time 280 -F "file=@$1" "https://file.io/?expires=14d&maxDownloads=50" 2>/dev/null)
  link=$(echo "$r" | jget "['link']")
  [ -n "$link" ] && echo "$link"
}
upload_tf() {  # tmpfiles.org — 60 минут, экстренный вариант
  local r u
  r=$(curl -s --max-time 280 -F "file=@$1" https://tmpfiles.org/api/v1/upload 2>/dev/null)
  u=$(echo "$r" | jget "['data']['url']")
  [ -n "$u" ] && echo "${u/tmpfiles.org\//tmpfiles.org/dl/}"
}

for f in daro-site-static.zip daro-site-source.zip daro-site-standalone.zip; do
  echo "--- $f ($(stat -c %s "$REL/$f") байт) ---"
  url=$(upload_pd "$REL/$f")
  host="pixeldrain (90 дней)"
  if [ -z "$url" ]; then url=$(upload_gf "$REL/$f"); host="gofile"; fi
  if [ -z "$url" ]; then url=$(upload_fio "$REL/$f"); host="file.io (14 дней / 50 скачиваний)"; fi
  if [ -z "$url" ]; then url=$(upload_tf "$REL/$f"); host="tmpfiles (60 минут!)"; fi
  if [ -n "$url" ]; then echo "OK [$host] $url"; else echo "ПРОВАЛ: ни один хостинг не принял"; fi
done
