/* ============================================================
   ИСТОРИЯ ДАРО — главная страница: данные.
   Маркиза и конфиг блоков-из-контента (C2 ROADMAP).
   Главная рендерит HOMEPAGE_BLOCKS: порядок в массиве = порядок
   на странице, правка без кода. content.ts — только ре-экспорт.
   ============================================================ */

import { type Accent } from "./shared";

/** Бегущая строка под первым экраном. */
export const MARQUEE_ITEMS = [
  "НОВЫЙ ФАЙЛ · ХРОНИКА «ПОБЕГ И ОХОТА ЗА ОТВЕТАМИ» РАСШИФРОВАНА",
  "ТОМ I · «КРАСНЫЙ СДВИГ» — ГОТОВ К ПУБЛИКАЦИИ",
  "ТОМ II · «СТЕКЛЯННЫЕ НЕБЕСА» — РЕДАКТУРА",
  "ТОМ III · «ПЕПЕЛ И НЕОН» — В РАБОТЕ",
  "ГОРОД ХИ-МИГАТА · 2147",
  "«ПЕРИМЕТР ЗЕРО» НА СВЯЗИ",
];

/**
 * Блоки-из-контента для главной (C2 ROADMAP). Виды:
 *  - stats    — полоса анимированных цифр из WORLD_STATS (limit — сколько первых);
 *  - timeline — тизер таймлайна из TIMELINE (засекреченные пропускаются);
 *  - arsenal  — превью арсенала из WEAPON_SPECS (limit; group — подгруппа каталога);
 *  - quote    — цитата: текст автора дословно;
 *  - links    — плитки-ссылки на любые разделы сайта.
 * Поля href проверяются линтером контента (check-content.mjs).
 */
export type HomepageBlock =
  | {
      kind: "stats";
      kicker: string;
      title: string;
      accent: Accent;
      limit?: number;
      href?: string;
      linkLabel?: string;
    }
  | {
      kind: "timeline";
      kicker: string;
      title: string;
      accent: Accent;
      limit?: number;
      href?: string;
      linkLabel?: string;
    }
  | {
      kind: "arsenal";
      kicker: string;
      title: string;
      accent: Accent;
      limit?: number;
      group?: string;
      href?: string;
      linkLabel?: string;
    }
  | {
      kind: "quote";
      accent: Accent;
      text: string;
      source: string;
    }
  | {
      kind: "links";
      kicker: string;
      title: string;
      accent: Accent;
      items: { href: string; title: string; text: string; accent: Accent }[];
    };

/** Порядок массива = порядок секций на главной (после хроник, перед подпиской). */
export const HOMEPAGE_BLOCKS: HomepageBlock[] = [
  {
    kind: "stats",
    kicker: "Счёт мира",
    title: "Хи-Мигата в цифрах",
    accent: "cyan",
    href: "/world",
    linkLabel: "Весь мир // подробнее",
  },
  {
    kind: "timeline",
    kicker: "Хронология",
    title: "Что известно о 2147-м",
    accent: "amber",
    limit: 3,
    href: "/timeline",
    linkLabel: "Полный таймлайн // подробнее",
  },
  {
    kind: "arsenal",
    kicker: "Арсенал",
    title: "Технологии войны",
    accent: "magenta",
    limit: 3,
    href: "/armory",
    linkLabel: "Весь арсенал // подробнее",
  },
  {
    kind: "quote",
    accent: "cyan",
    text: "У всякой силы в Хи-Мигате есть владелец. Это не правило — это строка в реестре. Даро — строка, которой нет.",
    source: "Красный сдвиг · пролог",
  },
];
