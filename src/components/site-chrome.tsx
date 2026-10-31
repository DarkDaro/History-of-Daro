"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Radio, X } from "lucide-react";
import { CyberAmbientButton } from "@/components/ambient-audio";
import { sfx } from "@/lib/sfx";

/* ============================================================
   Общая «обвязка» сайта: навигация + футер.
   ============================================================ */

export const NAV_LINKS = [
  { href: "/books", label: "Книги" },
  { href: "/world", label: "Мир" },
  { href: "/characters", label: "Персонажи" },
  { href: "/implants", label: "Импланты" },
  { href: "/armory", label: "Вооружение" },
  { href: "/chronicles", label: "Хроники" },
  { href: "/story", label: "Суть" },
  { href: "/author", label: "Автор" },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteNav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  // При смене страницы мобильное меню закрывается (setState во время рендера —
  // рекомендуемый React-паттерн вместо эффекта: см. react.dev/learn/you-might-not-need-an-effect)
  const [prevPath, setPrevPath] = useState(pathname);
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    if (menuOpen) setMenuOpen(false);
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#05050a]/85 text-white backdrop-blur-md">
      <nav
        className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6"
        aria-label="Основная навигация"
      >
        <Link href="/" className="flex shrink-0 items-center gap-2" aria-label="На главную">
          <Radio className="neon-cyan h-5 w-5" aria-hidden />
          <span className="font-display text-lg tracking-widest">
            ДАРО<span className="neon-magenta">{"//"}</span>
          </span>
        </Link>

        <ul className="hidden items-center gap-4 font-mono-cyber text-xs uppercase tracking-[0.2em] text-white/70 lg:flex xl:gap-6 xl:tracking-[0.25em]">
          {NAV_LINKS.map((l) => (
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

        <div className="flex items-center gap-3">
          <CyberAmbientButton />
          <Link
            href="/#subscribe"
            className="btn-beam neon-border-cyan hidden px-4 py-2 font-mono-cyber text-xs uppercase tracking-widest text-[var(--neon-cyan)] transition-colors hover:bg-[var(--neon-cyan)]/10 md:inline-flex"
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
        <div className="border-t border-white/10 bg-[#05050a]/95 lg:hidden">
          <ul className="space-y-1 px-4 py-4">
            {NAV_LINKS.map((l) => (
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
      )}
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
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div>
            <p className="font-display text-lg tracking-widest">
              ДАРО<span className="neon-magenta">{"//"}</span>
            </p>
            <p className="font-mono-cyber mt-3 max-w-xs text-[10px] uppercase leading-relaxed tracking-[0.25em] text-white/35">
              Цикл романов · антиутопия с элементами постапокалипсиса · город Хи-Мигата · 2147
            </p>
          </div>
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            <div>
              <p className="font-mono-cyber text-[10px] uppercase tracking-[0.3em] text-white/50">Цикл</p>
              <ul className="font-mono-cyber mt-3 space-y-2 text-[11px] uppercase tracking-[0.2em] text-white/45">
                <li><Link href="/books" className="hover:text-[var(--neon-cyan)]">Все тома</Link></li>
                <li><Link href="/books/tom-1" className="hover:text-[var(--neon-cyan)]">Том I</Link></li>
                <li><Link href="/books/tom-2" className="hover:text-[var(--neon-cyan)]">Том II</Link></li>
                <li><Link href="/books/tom-3" className="hover:text-[var(--neon-cyan)]">Том III</Link></li>
              </ul>
            </div>
            <div>
              <p className="font-mono-cyber text-[10px] uppercase tracking-[0.3em] text-white/50">Мир</p>
              <ul className="font-mono-cyber mt-3 space-y-2 text-[11px] uppercase tracking-[0.2em] text-white/45">
                <li><Link href="/world" className="hover:text-[var(--neon-cyan)]">Хи-Мигата</Link></li>
                <li><Link href="/characters" className="hover:text-[var(--neon-cyan)]">Персонажи</Link></li>
                <li><Link href="/implants" className="hover:text-[var(--neon-cyan)]">Импланты</Link></li>
                <li><Link href="/armory" className="hover:text-[var(--neon-cyan)]">Вооружение</Link></li>
                <li><Link href="/chronicles" className="hover:text-[var(--neon-cyan)]">Хроники</Link></li>
              </ul>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <p className="font-mono-cyber text-[10px] uppercase tracking-[0.3em] text-white/50">Прочее</p>
              <ul className="font-mono-cyber mt-3 space-y-2 text-[11px] uppercase tracking-[0.2em] text-white/45">
                <li><Link href="/story" className="hover:text-[var(--neon-cyan)]">Суть истории</Link></li>
                <li><Link href="/author" className="hover:text-[var(--neon-cyan)]">Автор</Link></li>
                <li><Link href="/#subscribe" className="hover:text-[var(--neon-cyan)]">Подписка</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <p className="font-mono-cyber mt-10 border-t border-white/5 pt-6 text-center text-[10px] uppercase tracking-[0.3em] text-white/40">
          © 2026 · Вселенная «Истории Даро» · Антиутопия · Неонуар
        </p>
      </div>
    </footer>
  );
}
