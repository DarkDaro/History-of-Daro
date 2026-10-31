# История Даро — сайт литературного цикла

Официальный сайт-портфолио серии романов **«История Даро»** в жанре киберпанк-дистопии, боевика и неонуара. Атмосфера — *Blade Runner*, *Ghost in the Shell*, *Cyberpunk 2077*.

Лендинг: обложки томов, справочник по миру (Персонажи / Импланты / Вооружение), подписка на сигнал.

## Стек

- **Next.js 16** (App Router) + **TypeScript**
- **Tailwind CSS 4** (`@theme inline`) — неоновая палитра: циан `#00f0ff`, маджента `#ff2a6d`, фон `#05050a`
- **framer-motion** — анимации, **lucide-react** — иконки
- **shadcn/ui** — UI-примитивы (toast и т.д.)
- Шрифты с кириллицей: Russo One (дисплейный), Play (основной), JetBrains Mono (моно)

## Структура

```
src/app/
  page.tsx          — лендинг (NAV, HERO, BOOKS, WORLD, справочник, AUTHOR, SUBSCRIBE, FOOTER)
  layout.tsx        — шрифты + SEO-метаданные (metadataBase, OG, Twitter, canonical)
  globals.css       — киберпанк-тема: glitch, scanlines, neon-border, cyber-grid, marquee…
  robots.ts         — динамический robots.txt (с Sitemap)
  sitemap.ts        — динамическая карта сайта (/sitemap.xml)
  icon.svg          — фавикон
  api/route.ts      — health-check API
src/components/     — cyber.tsx, ambient-audio.tsx, ui/* (shadcn)
src/lib/site.ts     — центральная SEO-конфигурация (SITE_URL, имя, описание)
public/covers/      — обложки книг и hero-фон (сгенерированы ИИ)
scripts/            — gen_images.sh (генерация изображений), city_ru.json
_archive/           — архив: всё старое не удаляется, а переносится сюда (в git не попадает)
```

## Команды

```bash
bun install        # установка зависимостей
bun run dev        # dev-сервер → http://localhost:3000
bun run lint       # ESLint
bun run build      # production-сборка
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
