# Подключение к своему GitHub · деплой на GitHub Pages

Сайт полностью готов к переезду: коммит чист, workflow настроен, архивы в репозитории.

## Путь A — поручить (быстро)

1. Создайте на GitHub **пустой** репозиторий (без README и .gitignore).
2. Передайте исполнителю: ссылку на репозиторий + fine-grained токен
   (GitHub → Settings → Developer settings → Fine-grained tokens →
   доступ только к этому репозиторию, право **Contents: Read and write**).
3. Исполнитель добавит remote, запушит `main` — workflow соберёт
   и выложит сайт сам. Токен после пуша можно сразу отозвать.

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

Включать Pages вручную не нужно: workflow делает это сам
(`configure-pages` с `enablement: true`). Если Pages всё же выключен —
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

## Чеклист перед пушем

1. Контент менялся? — локально `npm run build:static`: сборка должна
   пройти без ошибок. Линтер контента (слаги, ссылки, sitemap)
   запускается в CI автоматически перед сборкой и уронит деплой
   до публикации, если что-то не так.
2. Архивы в `public/releases/` менялись? — пересобрать их заранее
   (`scripts/build-releases.sh`), иначе на Pages останутся старые.
3. После пуша смотреть зелёный прогон: **Actions → Deploy static site**.
   Через ~3 минуты проверить живую страницу и Ctrl+K.

## Локальный запуск (Node.js 20+)

```bash
npm install        # один раз
npm run dev        # http://localhost:3000
npm run build:static   # готовый сайт в out/
npm run build          # серверная версия (.next/standalone, запуск: npm start)
```
