#!/usr/bin/env node
/* ============================================================
   check-links.mjs — линтер внутренних ссылок статики.
   Перенос практики «Истории Даро» (проверки ДО деплоя ломают
   публикацию раньше, чем пользователь увидит 404).

   Что проверяет во всех *.html:
   1. href/src/srcset/poster, кроме внешних (http/https,//,mailto,
      tel:,data:,javascript:) — файл существует относительно страницы.
   2. Якоря: #id существует в том же или указанном файле
      (id="…" или <a name="…">).
   3. srcset — каждый кандидат из списка.

   Запуск:            node scripts/check-links.mjs [каталог]
   По умолчанию:      текущий каталог
   Исключить каталоги: --ignore out,vendor,node_modules
   Коды выхода:       0 — чисто, 1 — есть ошибки.
   Без зависимостей, plain node.
   ============================================================ */

import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join, dirname, resolve } from "node:path";

/* ---------- аргументы ---------- */

const argv = process.argv.slice(2);
let target = ".";
const ignoreRaw = new Set([
  ".git", "node_modules", "out", ".github", "scripts", "rules", "vendor",
]);
for (let i = 0; i < argv.length; i++) {
  if (argv[i] === "--ignore") {
    for (const d of (argv[i + 1] ?? "").split(",")) {
      const t = d.trim();
      if (t) ignoreRaw.add(t);
    }
    i++;
  } else {
    target = argv[i];
  }
}
const root = resolve(target);

/* ---------- сбор html-файлов ---------- */

const errors = [];
const files = [];
const walk = (dir) => {
  for (const entry of readdirSync(dir)) {
    if (ignoreRaw.has(entry)) continue;
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) walk(full);
    else if (/\.(html?|xhtml)$/i.test(entry)) files.push(full);
  }
};
walk(root);
if (files.length === 0) {
  console.error(`check-links: в ${root} нет *.html — проверять нечего (не тот каталог?)`);
  process.exit(1);
}

/* ---------- регулярки атрибутов ---------- */

const attrRe =
  /\b(href|src|poster)\s*=\s*"([^"]*)"|\b(href|src|poster)\s*=\s*'([^']*)'/gi;
const srcsetRe = /\bsrcset\s*=\s*"([^"]*)"|\bsrcset\s*=\s*'([^']*)'/gi;
const idRe = /\bid\s*=\s*["']([^"']+)["']/gi;
const nameRe = /\bname\s*=\s*["']([^"']+)["']/gi;

const SKIP_RE =
  /^(https?:|\/\/|mailto:|tel:|data:|javascript:|\{\{|\$\{|\?)/i;
const anchorIds = new Map(); // файл -> Set(id)

function safeDecode(ref) {
  try {
    return decodeURIComponent(ref);
  } catch {
    return ref;
  }
}

function idsOf(file) {
  if (!anchorIds.has(file)) {
    const src = readFileSync(file, "utf8");
    const ids = new Set();
    let m;
    while ((m = idRe.exec(src)) !== null) ids.add(m[1]);
    while ((m = nameRe.exec(src)) !== null) ids.add(m[1]);
    anchorIds.set(file, ids);
  }
  return anchorIds.get(file);
}

let checked = 0;

for (const file of files) {
  const src = readFileSync(file, "utf8");
  const rel = file.slice(root.length + 1);

  const scan = (re, getVal) => {
    let m;
    re.lastIndex = 0;
    while ((m = re.exec(src)) !== null) {
      const line = src.slice(0, m.index).split("\n").length;
      const val = getVal(m);
      if (!val) continue;
      for (const cand of val.split(",")) {
        const rawRef = cand.trim().split(/\s+/)[0];
        if (!rawRef || rawRef === "#" || SKIP_RE.test(rawRef)) continue;
        const ref = safeDecode(rawRef);
        checked++;
        const [path, hash] = ref.split("#");
        const targetFile = path
          ? resolve(dirname(file), path)
          : file;
        if (!existsSync(targetFile) || !statSync(targetFile).isFile()) {
          errors.push(`${rel}:${line} — "${ref}" не существует`);
          continue;
        }
        if (hash) {
          let ids;
          try {
            ids = idsOf(targetFile);
          } catch {
            ids = null;
          }
          if (ids && !ids.has(hash)) {
            errors.push(
              `${rel}:${line} — якорь "#${hash}" не найден в ${path || "этом файле"}`
            );
          }
        }
      }
    }
  };

  scan(attrRe, (m) => m[2] ?? m[4]);
  scan(srcsetRe, (m) => m[1] ?? m[2]);
}

/* ---------- итог ---------- */

if (errors.length) {
  for (const e of errors) console.error(`ОШИБКА: ${e}`);
  console.error(`\ncheck-links: ${errors.length} ошибок.`);
  process.exit(1);
}
console.log(
  `check-links: OK — страниц ${files.length}, ссылок/ресурсов проверено ${checked}.`
);
