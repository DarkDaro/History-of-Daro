#!/usr/bin/env bash
# Аудит горизонтального переполнения на мобильном (390px).
# Для каждого маршрута: открываем, меряем scrollWidth vs viewport,
# ищем элементы, чей bounding box шире viewport.
BASE="https://darkdaro.github.io/History-of-Daro"
ROUTES=(
  "" "/books" "/books/tom-1" "/books/tom-2" "/books/tom-3"
  "/excerpts" "/excerpts/holodnyj-start" "/excerpts/mrachnyj-megapolis-hi-migata"
  "/excerpts/sdelka" "/excerpts/pepel-i-neon"
  "/world" "/corporations" "/timeline" "/characters" "/gallery"
  "/implants" "/armory" "/chronicles" "/chronicles/pobeg-ohotnika"
  "/story" "/author"
)
for r in "${ROUTES[@]}"; do
  agent-browser open "$BASE$r" >/dev/null 2>&1
  agent-browser wait 1200 >/dev/null 2>&1
  out=$(agent-browser eval "
    (() => {
      const vw = document.documentElement.clientWidth;
      const sw = document.documentElement.scrollWidth;
      const over = [];
      if (sw > vw + 1) {
        for (const el of document.querySelectorAll('body *')) {
          const b = el.getBoundingClientRect();
          if (b.right > vw + 2 && b.width > 8 && over.length < 4) {
            const tag = el.tagName.toLowerCase();
            const cls = (el.className && typeof el.className === 'string')
              ? el.className.split(' ').slice(0,3).join('.') : '';
            over.push(tag + '.' + cls + ' r=' + Math.round(b.right));
          }
        }
      }
      return vw + '|' + sw + '|' + over.join(' ;; ');
    })()
  " 2>/dev/null)
  echo "ROUTE [$r] → $out"
done
