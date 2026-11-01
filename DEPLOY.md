# Подключение к своему GitHub · деплой на GitHub Pages

Сайт полностью готов к переезду: коммит чист, workflow настроен, архивы в репозитории.

## Путь A — поручить мне (быстро)

1. Создайте на GitHub **пустой** репозиторий (без README и .gitignore).
2. Пришлите в чат: ссылку на репозиторий + fine-grained токен
   (GitHub → Settings → Developer settings → Fine-grained tokens →
   доступ только к этому репозиторию, право **Contents: Read and write**).
3. Я добавлю remote, запушу `main` — workflow соберёт и выложит сайт сам.
   Токен после пуша можно сразу отозвать.

## Путь B — самостоятельно (пять команд)

Берите файл `daro-site.bundle` (вся история репозитория одним файлом):

```bash
git clone daro-site.bundle сайт && cd сайт
git remote set-url origin https://github.com/<логин>/<репо>.git
git push -u origin main
```

Если бандл не скачался — то же самое из `daro-site-source.zip`:

```bash
cd daro-site
git init -b main
git add -A && git commit -m "История Даро — цикл романов"
git remote add origin https://github.com/<логин>/<репо>.git
git push -u origin main
```

Затем один переключатель в браузере:
**Settings → Pages → Build and deployment → Source: GitHub Actions**.

Через минуту-две сайт живёт на `https://<логин>.github.io/<репо>/`.

## Что уже настроено (править не нужно)

- `.github/workflows/deploy.yml` — сборка статики на каждый push в `main`
  (+ кнопка Run workflow вручную).
- basePath (`/<репо>`) и `NEXT_PUBLIC_SITE_URL` вычисляются автоматически —
  RSS, sitemap и канонические ссылки получат правильные абсолютные адреса.
- Архивы из `public/releases/` попадают на Pages — постоянные прямые ссылки вида
  `https://<логин>.github.io/<репо>/releases/daro-site-static.zip`
  (страница `/download.html` на сайте ссылается на них же).
- Пользовательский домен: basePath станет пустым автоматически, правки не нужны.

## Локальный запуск (Node.js 20+)

```bash
npm install        # один раз
npm run dev        # http://localhost:3000
npm run build:static   # готовый сайт в out/
npm run build          # серверная версия (.next/standalone, запуск: npm start)
```
