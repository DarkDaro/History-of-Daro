# История Даро — сайт литературного цикла

Официальный сайт-портфолио серии романов **«История Даро»** — антиутопия с элементами постапокалипсиса, боевик и неонуар. Атмосфера — *Blade Runner*, *Ghost in the Shell*, *Cyberpunk 2077*.

**Канон цикла:** Даро — мятежный антигерой (не город). Город — **Хи-Мигата**, 2147 год, семь корпораций, сопротивление «Периметр Зеро».

Сайт **многостраничный**:

| Страница | Что там |
| --- | --- |
| `/` | Главная: hero, marquee, суть цикла, полоса томов, разделы, подписка |
| `/books` | Каталог цикла: три тома |
| `/books/tom-1..3` | Детальные страницы томов: аннотации, узлы сюжета, факты |
| `/world` | Мир: Хи-Мигата, 7 корпораций, фракции, технологии, аномалии, повседневность |
| `/characters` | Персонажи: Николас/Даро, Лина, Немезида, Айя, соратники и антагонисты |
| `/implants` | Справочник имплантов (8 записей) |
| `/armory` | Вооружение: арсенал сопротивления и машины противника |
| `/story` | Суть истории: 5 человеческих историй, принципы повествования, влияния |
| `/chronicles` | Хроники: архив восстановленных фрагментов (флешбеки, расшифровки) |
| `/chronicles/pobeg-ohotnika` | Хроника ХР-01 «Побег и охота за ответами»: флешбек Резонансного Охотника |
| `/author` | Автор + подписка |

Все тексты разделов собраны в одном файле канона: `src/lib/content.ts`.
Правила стиля текстов, карта данных и стоп-лист фраз — в [CONTENT.md](CONTENT.md).

> Тексты прошли стилистический проход (Гибсон / Морган / Дик): деталь вместо
> объяснения, цена вместо лозунга. При правке новых текстов держи их в том же голосе.

## Стек

- **Next.js 16** (App Router) + **TypeScript**
- **Tailwind CSS 4** (`@theme inline`) — неоновая палитра: циан `#00f0ff`, маджента `#ff2a6d`, фон `#05050a`
- **framer-motion** — анимации, **lucide-react** — иконки
- **shadcn/ui** — UI-примитивы (toast и т.д.)
- Шрифты с кириллицей: Russo One (дисплейный), Play (основной), JetBrains Mono (моно)

## Структура

```
src/app/
  page.tsx          — главная (hero, marquee, суть, тома, разделы, подписка)
  layout.tsx        — общая обвязка: навигация, футер, эффекты + SEO
  books/page.tsx    — каталог томов
  books/tom-1..3/   — страницы томов
  world/            — Хи-Мигата, корпорации, фракции, технологии, повседневность
  characters/       — персонажи цикла
  implants/         — импланты
  armory/           — вооружение (две стороны войны)
  story/            — суть истории (темы, принципы, влияния)
  chronicles/       — архив хроник + детальная страница хроники
  author/           — автор + подписка
  globals.css       — киберпанк-тема: glitch, scanlines, neon-border, cyber-grid, marquee…
  robots.ts         — динамический robots.txt (с Sitemap)
  sitemap.ts        — карта сайта: все страницы
  icon.svg          — фавикон
  api/route.ts      — health-check API
src/components/     — cyber.tsx (эффекты), site-chrome.tsx (нав/футер), blocks.tsx,
                      book-detail.tsx, codex-card.tsx, chronicle-detail.tsx,
                      subscribe-form.tsx, scroll-top.tsx (кнопка «наверх»),
                      ambient-audio.tsx (звуковой слой), ui/*
src/lib/content.ts  — ЕДИНЫЙ ФАЙЛ КАНОНА: книги, персонажи, корпорации, импланты, оружие
src/lib/sfx.ts      — UI-звуки (hover/click), хранятся локально в localStorage
src/lib/site.ts     — центральная SEO-конфигурация (SITE_URL, имя, описание)
public/covers/      — обложки книг и hero-фон (сгенерированы ИИ)
scripts/            — build-static.mjs, post-build.mjs, gen_images.sh
_archive/           — архив: всё старое не удаляется, а переносится сюда (в git не попадает)
```

## Команды

```bash
bun install         # или npm install — установка зависимостей
bun run dev         # dev-сервер → http://localhost:3000
bun run lint        # ESLint
bun run build       # production-сборка (бэкенд-версия, standalone)
bun run start       # запуск production-версии → http://localhost:3000
bun run build:static  # статический экспорт для GitHub Pages → папка out/
```

## Публикация на GitHub Pages (бесплатно, статическая версия)

Статическая версия собирается командой `npm run build:static` в папку `out/`
(без бэкенда: лендинг, эффекты, справочник — всё работает; API-роут не нужен).

1. Залей репозиторий на GitHub (ветка `main`).
2. В настройках репозитория: **Settings → Pages → Source → GitHub Actions**.
3. Готово: workflow `.github/workflows/deploy.yml` сам соберёт сайт и выложит
   его по адресу `https://<ник>.github.io/<репозиторий>/`. При каждом пуше в
   `main` сайт будет обновляться автоматически.

Посмотреть статическую версию локально:

```bash
npm run build:static
npx serve out        # или любой статический сервер
```

## Правила репозитория

1. **Ничего не удаляем.** Устаревшие файлы переносятся в `_archive/` (игнорируется гитом). История изменений — в git-коммитах.
2. **Секреты в гит не попадают.** `.env` и `db/*.db` исключены из индекса (`git rm --cached`), файлы остаются на диске. Шаблон переменных: `.env.example`.
3. Коммиты — осмысленные, в формате `feat: … / fix: … / docs: …`.

## SEO (минимум)

- `robots.txt` — генерируется из `src/app/robots.ts`, содержит `Sitemap: <домен>/sitemap.xml`
- `sitemap.xml` — из `src/app/sitemap.ts`
- Метаданные: title/description, canonical, Open Graph (`ru_RU`), Twitter Card, `robots: index, follow`, `themeColor`
- `lang="ru"`, фавикон `icon.svg`

## Перед деплоем

1. Создай `.env` по шаблону `.env.example` и укажи боевой домен:
   ```
   NEXT_PUBLIC_SITE_URL=https://твой-домен.ru
   ```
   От него зависят canonical, OG-теги, robots.txt и sitemap.xml.
2. Прогони `bun run build` и проверь `/robots.txt` и `/sitemap.xml`.
