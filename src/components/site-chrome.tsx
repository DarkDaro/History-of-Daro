"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Images, Menu, Radio, Search, X } from "lucide-react";
import { CyberAmbientButton } from "@/components/ambient-audio";
import { SearchPalette } from "@/components/search-palette";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { sfx } from "@/lib/sfx";
import { asset } from "@/lib/content";

/* ============================================================
   Общая «обвязка» сайта: навигация + футер.

   Структура навигации (намеренно короткая):
   • основная строка (lg+) — 4 ключевых раздела, без перегруза;
   • «Галерея» — отдельная неоновая кнопка (маджента) рядом с
     основной строкой; первая в мобильном меню;
   • «Ещё» — кнопка с панелью-индексом, сгруппированным по
     темам (панель 2×2, те же группы в мобильном меню);
   • справа — поиск, «Эфир», подписка: без лишних слов на узких
     десктопах (подписи всплывают только на xl+).
   ============================================================ */

/** Основная строка (lg+): курс — от книг к героям. */
export const NAV_MAIN: { href: string; label: string }[] = [
  { href: "/books", label: "Книги" },
  { href: "/story", label: "Суть" },
  { href: "/world", label: "Мир" },
  { href: "/characters", label: "Персонажи" },
];

/** Панель «Ещё»: сгруппированный индекс остальных разделов. */
export const NAV_MORE: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "Читать",
    links: [
      { href: "/excerpts", label: "Фрагменты" },
      { href: "/chronicles", label: "Хроники" },
    ],
  },
  {
    title: "Мир",
    links: [
      { href: "/corporations", label: "Корпорации" },
      { href: "/map", label: "Карта города" },
      { href: "/timeline", label: "Таймлайн 2147" },
    ],
  },
  {
    title: "Кодекс",
    links: [
      { href: "/implants", label: "Импланты" },
      { href: "/armory", label: "Вооружение" },
      { href: "/glossary", label: "Глоссарий" },
    ],
  },
  {
    title: "Автор",
    links: [
      { href: "/author", label: "Об авторе" },
      { href: "/support", label: "Поддержать" },
    ],
  },
];

/** Мобильное меню: все 15 маршрутов, сгруппированные по темам. */
const NAV_MOBILE_GROUPS: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "Цикл",
    links: [
      { href: "/books", label: "Книги" },
      { href: "/excerpts", label: "Фрагменты" },
      { href: "/story", label: "Суть" },
      { href: "/chronicles", label: "Хроники" },
    ],
  },
  {
    title: "Мир",
    links: [
      { href: "/world", label: "Мир" },
      { href: "/corporations", label: "Корпорации" },
      { href: "/characters", label: "Персонажи" },
      { href: "/map", label: "Карта города" },
      { href: "/timeline", label: "Таймлайн 2147" },
    ],
  },
  {
    title: "Кодекс",
    links: [
      { href: "/implants", label: "Импланты" },
      { href: "/armory", label: "Вооружение" },
      { href: "/glossary", label: "Глоссарий" },
    ],
  },
  {
    title: "Автор",
    links: [
      { href: "/author", label: "Об авторе" },
      { href: "/support", label: "Поддержать автора" },
    ],
  },
];

/** Все маршруты навигации — для проверки полноты в тестах. */
export const NAV_ROUTES = [
  ...NAV_MAIN.map((l) => l.href),
  "/gallery",
  ...NAV_MORE.flatMap((g) => g.links.map((l) => l.href)),
];

/** Активна ли панель «Ещё» (текущий маршрут внутри её групп). */
function isMoreActive(pathname: string): boolean {
  return NAV_MORE.some((g) => g.links.some((l) => isActive(pathname, l.href)));
}

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteNav() {
  const pathname = usePathname();

  // A5: короткий «вжух» при смене страницы (первый рендер — без звука).
  const prevRoute = useRef(pathname);
  useEffect(() => {
    if (prevRoute.current !== pathname) {
      prevRoute.current = pathname;
      sfx("transition");
    }
  }, [pathname]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  // При смене страницы мобильное меню закрывается (setState во время рендера —
  // рекомендуемый React-паттерн вместо эффекта: см. react.dev/learn/you-might-not-need-an-effect)
  const [prevPath, setPrevPath] = useState(pathname);
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    if (menuOpen) setMenuOpen(false);
  }

  // Ctrl+K / Cmd+K открывает палитру поиска с любой страницы.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#05050a]/85 text-white backdrop-blur-md">
      <nav
        className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8"
        aria-label="Основная навигация"
      >
        <Link href="/" className="flex shrink-0 items-center gap-2" aria-label="ДАРО// — на главную">
          <Radio className="neon-cyan h-5 w-5" aria-hidden />
          <span className="font-display text-lg tracking-widest">
            ДАРО<span className="neon-magenta">{"//"}</span>
          </span>
        </Link>

        {/* Центр: 4 ссылки + «Галерея» + «Ещё» — единым блоком, без расталкивания. */}
        <div className="hidden items-center gap-1.5 lg:flex">
          <ul className="hidden items-center gap-5 font-mono-cyber text-[11px] uppercase tracking-[0.15em] text-white/70 lg:flex">
            {NAV_MAIN.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="nav-link"
                  data-active={isActive(pathname, l.href) ? "true" : "false"}
                  onMouseEnter={() => sfx("hover")}
                  onClick={() => sfx("click")}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          <span aria-hidden className="mx-1.5 h-4 w-px bg-white/15" />

          {/* Галерея — выделенная неоновая кнопка (всегда на виду на десктопе). */}
          <Link
            href="/gallery"
            data-active={isActive(pathname, "/gallery") ? "true" : undefined}
            className={`btn-beam neon-border-magenta hidden items-center gap-2 px-3.5 py-2 font-mono-cyber text-[11px] uppercase tracking-[0.2em] text-[var(--neon-magenta)] transition-colors hover:bg-[var(--neon-magenta)]/10 lg:inline-flex ${
              isActive(pathname, "/gallery") ? "bg-[var(--neon-magenta)]/15" : ""
            }`}
            onMouseEnter={() => sfx("hover")}
            onClick={() => sfx("click")}
          >
            <Images className="h-4 w-4" aria-hidden />
            Галерея
          </Link>

          {/* Ещё — панель-индекс: чтение, мир, кодекс, автор. */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                onClick={() => sfx("click")}
                data-active={isMoreActive(pathname) ? "true" : undefined}
                aria-label="Ещё разделы"
                className="hidden items-center gap-2 border border-white/15 bg-white/[0.03] px-3 py-2 font-mono-cyber text-[10px] uppercase tracking-[0.2em] text-white/60 transition-colors hover:border-[var(--neon-cyan)]/50 hover:text-[var(--neon-cyan)] data-[active=true]:border-[var(--neon-cyan)]/60 data-[active=true]:text-[var(--neon-cyan)] lg:inline-flex"
              >
                Ещё
                <ChevronDown className="h-3.5 w-3.5" aria-hidden />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              sideOffset={12}
              className="w-[min(26rem,calc(100vw-2rem))] border border-white/10 bg-[#0a0d14]/95 p-4 backdrop-blur-md"
            >
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                {NAV_MORE.map((g) => (
                  <div key={g.title}>
                    <p className="font-mono-cyber px-1 text-[9px] uppercase tracking-[0.35em] text-white/35">
                      {g.title}
                    </p>
                    <ul className="mt-1.5">
                      {g.links.map((l) => (
                        <DropdownMenuItem key={l.href} asChild>
                          <Link
                            href={l.href}
                            className="font-mono-cyber cursor-pointer rounded-none px-1 py-2 text-[11px] uppercase tracking-[0.2em] text-white/70 outline-none transition-colors data-[highlighted]:text-[var(--neon-cyan)]"
                          >
                            {l.label}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              sfx("click");
              setSearchOpen(true);
            }}
            aria-label="Поиск по сайту · Ctrl+K"
            title="Поиск · Ctrl+K"
            className="group flex items-center gap-2 border border-white/15 bg-white/[0.03] px-3 py-2 font-mono-cyber text-[10px] uppercase tracking-[0.2em] text-white/60 transition-colors hover:border-[var(--neon-cyan)]/50 hover:text-[var(--neon-cyan)]"
          >
            <Search className="h-4 w-4" aria-hidden />
            <kbd className="hidden border border-white/15 px-1.5 py-0.5 text-[9px] tracking-[0.15em] text-white/40 group-hover:text-white/60 2xl:inline">
              Ctrl K
            </kbd>
          </button>
          <CyberAmbientButton />
          <Link
            href="/#subscribe"
            className="btn-beam neon-border-cyan hidden px-3.5 py-2 font-mono-cyber text-xs uppercase tracking-widest text-[var(--neon-cyan)] transition-colors hover:bg-[var(--neon-cyan)]/10 lg:inline-flex"
          >
            Подписаться
          </Link>
          <button
            type="button"
            onClick={() => {
              sfx("click");
              setMenuOpen((v) => !v);
            }}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
            className="neon-border-cyan p-2 text-[var(--neon-cyan)] lg:hidden"
          >
            {menuOpen ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-white/10 bg-[#05050a]/95 lg:hidden">
          {/* Галерея — первой строкой, выделенная. */}
          <div className="px-4 pt-4">
            <Link
              href="/gallery"
              onClick={() => {
                sfx("click");
                setMenuOpen(false);
              }}
              data-active={isActive(pathname, "/gallery") ? "true" : undefined}
              className="neon-border-magenta flex items-center gap-3 px-3 py-3 font-mono-cyber text-sm uppercase tracking-[0.25em] text-[var(--neon-magenta)]"
            >
              <Images className="h-4 w-4 shrink-0" aria-hidden />
              Галерея
            </Link>
          </div>
          {NAV_MOBILE_GROUPS.map((g) => (
            <div key={g.title} className="px-4 pb-2 pt-4">
              <p className="font-mono-cyber px-2 text-[9px] uppercase tracking-[0.35em] text-white/40">
                {g.title}
              </p>
              <ul className="mt-1 space-y-0.5">
                {g.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      onClick={() => {
                        sfx("click");
                        setMenuOpen(false);
                      }}
                      className="block px-2 py-3 font-mono-cyber text-sm uppercase tracking-[0.25em] text-white/80 hover:text-[var(--neon-cyan)]"
                      data-active={isActive(pathname, l.href) ? "true" : undefined}
                    >
                      {"//"} {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      <SearchPalette open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="relative mt-auto border-t border-white/10 bg-black/80 pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-10 text-white">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--neon-cyan)] to-transparent"
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div>
            <p className="font-display text-lg tracking-widest">
              ДАРО<span className="neon-magenta">{"//"}</span>
            </p>
            <p className="font-mono-cyber mt-3 max-w-xs text-[10px] uppercase leading-relaxed tracking-[0.25em] text-white/50">
              Цикл романов · город Хи-Мигата · 2147 год · дождь не заканчивается
            </p>
            {/* версия сборки: sha+дата инжектятся в next.config.ts при билде */}
            <p className="font-mono-cyber mt-2 text-[9px] uppercase tracking-[0.25em] text-white/50">
              сборка {process.env.NEXT_PUBLIC_BUILD_SHA} · {process.env.NEXT_PUBLIC_BUILD_DATE}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            <div>
              <p className="font-mono-cyber text-[10px] uppercase tracking-[0.3em] text-white/50">Цикл</p>
              <ul className="font-mono-cyber mt-3 space-y-2 text-[11px] uppercase tracking-[0.2em] text-white/60">
                <li><Link href="/books" className="inline-block py-1.5 -my-1.5 hover:text-[var(--neon-cyan)]">Все тома</Link></li>
                <li><Link href="/books/tom-1" className="inline-block py-1.5 -my-1.5 hover:text-[var(--neon-cyan)]">Том I</Link></li>
                <li><Link href="/books/tom-2" className="inline-block py-1.5 -my-1.5 hover:text-[var(--neon-cyan)]">Том II</Link></li>
                <li><Link href="/books/tom-3" className="inline-block py-1.5 -my-1.5 hover:text-[var(--neon-cyan)]">Том III</Link></li>
              </ul>
            </div>
            <div>
              <p className="font-mono-cyber text-[10px] uppercase tracking-[0.3em] text-white/50">Мир</p>
              <ul className="font-mono-cyber mt-3 space-y-2 text-[11px] uppercase tracking-[0.2em] text-white/60">
                <li><Link href="/world" className="inline-block py-1.5 -my-1.5 hover:text-[var(--neon-cyan)]">Хи-Мигата</Link></li>
                <li><Link href="/map" className="inline-block py-1.5 -my-1.5 hover:text-[var(--neon-cyan)]">Карта города</Link></li>
                <li><Link href="/corporations" className="inline-block py-1.5 -my-1.5 hover:text-[var(--neon-cyan)]">Корпорации</Link></li>
                <li><Link href="/timeline" className="inline-block py-1.5 -my-1.5 hover:text-[var(--neon-cyan)]">Таймлайн 2147</Link></li>
                <li><Link href="/characters" className="inline-block py-1.5 -my-1.5 hover:text-[var(--neon-cyan)]">Персонажи</Link></li>
                <li><Link href="/implants" className="inline-block py-1.5 -my-1.5 hover:text-[var(--neon-cyan)]">Импланты</Link></li>
                <li><Link href="/armory" className="inline-block py-1.5 -my-1.5 hover:text-[var(--neon-cyan)]">Вооружение</Link></li>
                <li><Link href="/chronicles" className="inline-block py-1.5 -my-1.5 hover:text-[var(--neon-cyan)]">Хроники</Link></li>
                <li><Link href="/gallery" className="inline-block py-1.5 -my-1.5 hover:text-[var(--neon-cyan)]">Галерея</Link></li>
              </ul>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <p className="font-mono-cyber text-[10px] uppercase tracking-[0.3em] text-white/50">Прочее</p>
              <ul className="font-mono-cyber mt-3 space-y-2 text-[11px] uppercase tracking-[0.2em] text-white/60">
                <li><Link href="/story" className="inline-block py-1.5 -my-1.5 hover:text-[var(--neon-cyan)]">Суть истории</Link></li>
                <li><Link href="/glossary" className="inline-block py-1.5 -my-1.5 hover:text-[var(--neon-cyan)]">Глоссарий</Link></li>
                <li><Link href="/author" className="inline-block py-1.5 -my-1.5 hover:text-[var(--neon-cyan)]">Автор</Link></li>
                <li><Link href="/support" className="inline-block py-1.5 -my-1.5 hover:text-[var(--neon-cyan)]">Поддержать автора</Link></li>
                <li><Link href="/#subscribe" className="inline-block py-1.5 -my-1.5 hover:text-[var(--neon-cyan)]">Подписка</Link></li>
                <li><a href={asset("/feed.xml")} className="inline-block py-1.5 -my-1.5 hover:text-[var(--neon-cyan)]">RSS-лента</a></li>
                <li><a href={asset("/download.html")} className="inline-block py-1.5 -my-1.5 hover:text-[var(--neon-cyan)]">Скачать сборку</a></li>
              </ul>
            </div>
          </div>
        </div>
        <p className="font-mono-cyber mt-10 border-t border-white/5 pt-6 text-center text-[10px] uppercase tracking-[0.3em] text-white/55">
          © 2026 DarkDaro · Вселенная «Истории Даро» — личный авторский проект
        </p>
        <p className="font-mono-cyber mx-auto mt-3 max-w-2xl text-center text-[9px] uppercase leading-relaxed tracking-[0.2em] text-white/50">
          Все права защищены. Код, персонажи, тексты и идеи — собственность автора; любое использование без письменного разрешения запрещено. Сайт носит ознакомительный характер.
        </p>
      </div>
    </footer>
  );
}
