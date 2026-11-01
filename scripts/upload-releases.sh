#!/usr/bin/env bash
# Загрузка релизных архивов на внешний хостинг (прямые ссылки в обход платформы).
# Основной: catbox.moe (постоянное хранение). Резерв: 0x0.st (от 30 дней).
set -uo pipefail

REL=/tmp/rel
up_catbox() {
  curl -s --max-time 280 -F "reqtype=fileupload" -F "fileToUpload=@$1" https://catbox.moe/user/api.php 2>/dev/null
}
up_0x0() {
  curl -s --max-time 280 -F "file=@$1" https://0x0.st 2>/dev/null
}

for f in daro-site-static.zip daro-site-source.zip daro-site-standalone.zip; do
  echo "--- $f ($(stat -c %s "$REL/$f") байт) ---"
  url=$(up_catbox "$REL/$f")
  case "$url" in
    https://*) echo "catbox: $url" ;;
    *)
      echo "catbox не принял файл, пробую 0x0.st…"
      url=$(up_0x0 "$REL/$f")
      case "$url" in
        https*) echo "0x0: $url" ;;
        *) echo "ОШИБКА: ни один хостинг не принял файл. Ответ: ${url:0:120}" ;;
      esac
      ;;
  esac
done
