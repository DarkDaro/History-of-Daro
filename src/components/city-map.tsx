"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Corners } from "@/components/cyber";
import { sfx } from "@/lib/sfx";
import {
  GLOSSARY,
  MAP_CATEGORIES,
  MAP_NOTE,
  MAP_POINTS,
  type Accent,
  type MapCategory,
  type MapPoint,
} from "@/lib/content";

/* ============================================================
   Тактическая схема Хи-Мигаты (BACKLOG п.8): SVG-карта с
   переключаемыми слоями и карточкой объекта. Координаты —
   в src/content/map.ts, подгоняются под канон без правки кода.
   ============================================================ */

const ACCENT_COLOR: Record<Accent, string> = {
  cyan: "var(--neon-cyan)",
  magenta: "var(--neon-magenta)",
  amber: "var(--neon-amber)",
};

const ACCENT_TEXT: Record<Accent, string> = {
  cyan: "neon-cyan",
  magenta: "neon-magenta",
  amber: "text-[var(--neon-amber)]",
};

/** Акцент категории на схеме и в карточке. */
const CAT_ACCENT: Record<MapCategory, Accent> = {
  corps: "cyan",
  city: "amber",
  market: "magenta",
  resistance: "cyan",
  hidden: "magenta",
};

function labelAnchor(pos: MapPoint["labelPos"]): { dx: number; dy: number; anchor: "start" | "middle" | "end" } {
  switch (pos) {
    case "top":
      return { dx: 0, dy: -18, anchor: "middle" };
    case "bottom":
      return { dx: 0, dy: 30, anchor: "middle" };
    case "left":
      return { dx: -18, dy: 4, anchor: "end" };
    default:
      return { dx: 18, dy: 4, anchor: "start" };
  }
}

/** Словарная запись по якорю (для связки «объект карты → термин глоссария»). */
function glossaryTerm(id: string) {
  for (const level of GLOSSARY) {
    const found = level.entries.find((e) => e.id === id);
    if (found) return found;
  }
  return undefined;
}

export function CityMap() {
  const [active, setActive] = useState<MapPoint | null>(null);
  const [off, setOff] = useState<Set<MapCategory>>(new Set());

  const toggle = (id: MapCategory) => {
    sfx("click");
    setOff((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const select = useCallback((p: MapPoint | null) => {
    if (p) sfx("open");
    setActive(p);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const visible = MAP_POINTS.filter((p) => !off.has(p.category));
  const accent = active ? CAT_ACCENT[active.category] : null;
  const activeGl = active?.glossary ? glossaryTerm(active.glossary) : undefined;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div>
        {/* слои */}
        <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label="Слои карты">
          {MAP_CATEGORIES.map((c) => {
            const on = !off.has(c.id);
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => toggle(c.id)}
                aria-pressed={on}
                className={`font-mono-cyber border px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] transition-colors ${
                  on ? "border-white/25 bg-white/[0.04] text-white/80" : "border-white/10 text-white/30"
                }`}
              >
                <span
                  aria-hidden
                  className="mr-2 inline-block h-2 w-2 rounded-full align-middle"
                  style={{
                    background: ACCENT_COLOR[c.accent],
                    opacity: on ? 1 : 0.25,
                  }}
                />
                {c.label}
              </button>
            );
          })}
        </div>

        {/* схема */}
        <div className="beam-border-static relative bg-[#070710]">
          <Corners color={accent ?? "cyan"} />
          <svg
            viewBox="0 0 1000 800"
            className="block h-auto w-full select-none"
            /* role=group, а не img: внутри интерактивные маркеры —
               под role=img скринридеры прячут дочерние элементы (a11y) */
            role="group"
            aria-label="Тактическая схема Хи-Мигаты: интерактивные объекты доступны с клавиатуры (Tab, Enter, Esc)"
          >
            <defs>
              <filter id="cm-glow" x="-60%" y="-60%" width="220%" height="220%">
                <feGaussianBlur stdDeviation="3.5" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <pattern id="cm-hatch" width="10" height="10" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
                <line x1="0" y1="0" x2="0" y2="10" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
              </pattern>
              <radialGradient id="cm-vig" cx="50%" cy="45%" r="75%">
                <stop offset="60%" stopColor="rgba(0,0,0,0)" />
                <stop offset="100%" stopColor="rgba(0,0,0,0.55)" />
              </radialGradient>
            </defs>

            {/* фон: сетка города */}
            <rect width="1000" height="800" fill="#070710" />
            {Array.from({ length: 19 }, (_, i) => (
              <line key={`v${i}`} x1={i * 55} y1={0} x2={i * 55} y2={800} stroke="rgba(255,255,255,0.035)" strokeWidth="1" />
            ))}
            {Array.from({ length: 15 }, (_, i) => (
              <line key={`h${i}`} x1={0} y1={i * 57} x2={1000} y2={i * 57} stroke="rgba(255,255,255,0.035)" strokeWidth="1" />
            ))}

            {/* Пустошь — за стеной, справа внизу */}
            <polygon points="960,600 1000,600 1000,800 850,800" fill="url(#cm-hatch)" />
            <line x1="960" y1="600" x2="850" y2="800" stroke="rgba(255,255,255,0.25)" strokeWidth="2" strokeDasharray="4 6" />
            <text x="936" y="762" className="font-mono-cyber" fontSize="12" letterSpacing="3" fill="rgba(255,255,255,0.4)" textAnchor="middle">
              ПУСТОШЬ
            </text>

            {/* подполье — под доками */}
            <rect x="40" y="745" width="780" height="50" fill="rgba(0,0,0,0.5)" />
            <line x1="40" y1="745" x2="820" y2="745" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeDasharray="2 5" />
            <text x="700" y="738" className="font-mono-cyber" fontSize="10" letterSpacing="3" fill="rgba(255,255,255,0.3)">
              ПОДПОЛЬЕ · ПОДЗЕМНЫЕ КОМПЛЕКСЫ
            </text>

            {/* купол */}
            <path
              d="M 40 600 Q 500 40 960 600"
              fill="none"
              stroke="var(--neon-cyan)"
              strokeWidth="2"
              strokeDasharray="10 8"
              opacity="0.55"
              filter="url(#cm-glow)"
            />
            <text x="500" y="255" className="font-mono-cyber" fontSize="11" letterSpacing="4" fill="rgba(255,255,255,0.4)" textAnchor="middle">
              КУПОЛЬНЫЙ ПЕРИМЕТР · ТЕХНОЛОГИЯ «КУПОЛА»
            </text>

            {/* ярусы */}
            {[
              { y1: 340, y2: 470, label: "ВЕРХНИЕ ЯРУСЫ · КОРПОРАЦИИ" },
              { y1: 470, y2: 590, label: "СРЕДНИЕ ЯРУСЫ · ЖИЛЫЕ СЕКТОРА" },
              { y1: 590, y2: 660, label: "НИЖНИЕ ЯРУСЫ · ПРОИЗВОДСТВО" },
              { y1: 660, y2: 745, label: "ДОКИ" },
            ].map((b) => (
              <g key={b.label}>
                <line x1="40" y1={b.y2} x2="960" y2={b.y2} stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                <text x="52" y={b.y1 + 18} className="font-mono-cyber" fontSize="10" letterSpacing="3" fill="rgba(255,255,255,0.28)">
                  {b.label}
                </text>
              </g>
            ))}

            {/* Нейросетка: связи между узлами города (декор) */}
            <g opacity="0.35" stroke="var(--neon-cyan)" strokeWidth="1" strokeDasharray="3 6" fill="none">
              <path d="M 500 330 L 655 405 L 725 545 L 705 695" />
              <path d="M 500 330 L 330 425 L 300 545 L 295 692" />
              <path d="M 655 405 L 565 520 L 430 622 L 555 708" />
            </g>
            <text x="742" y="592" className="font-mono-cyber" fontSize="10" letterSpacing="2" fill="rgba(255,255,255,0.3)">
              НЕЙРОСЕТКА
            </text>

            {/* маршрут патрулей дронов — слой «Город» */}
            {!off.has("city") && (
              <g>
                <ellipse
                  cx="500"
                  cy="565"
                  rx="205"
                  ry="72"
                  fill="none"
                  stroke="var(--neon-amber)"
                  strokeWidth="1.2"
                  strokeDasharray="6 10"
                  opacity="0.5"
                  className="cm-patrol"
                />
                <text x="500" y="648" className="font-mono-cyber" fontSize="10" letterSpacing="2" fill="rgba(255,255,255,0.35)" textAnchor="middle">
                  ПАТРУЛИ ДРОНОВ · СКАНЕРЫ НА ПЕРЕХОДАХ
                </text>
              </g>
            )}

            {/* клик по пустому месту снимает выбор — под маркерами */}
            <rect
              width="1000"
              height="800"
              fill="transparent"
              onClick={() => select(null)}
              className="cursor-default"
            />

            {/* объекты */}
            {visible.map((p) => {
              const col = ACCENT_COLOR[CAT_ACCENT[p.category]];
              const isActive = active?.id === p.id;
              const l = labelAnchor(p.labelPos);
              return (
                <g
                  key={p.id}
                  transform={`translate(${p.x} ${p.y})`}
                  className="cm-marker cursor-pointer"
                  role="button"
                  tabIndex={0}
                  aria-label={`${p.id} · ${p.name}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    select(p);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      select(p);
                    }
                  }}
                  onMouseEnter={() => sfx("hover")}
                >
                  <circle r="20" fill="transparent" />
                  {/* видимый фокус с клавиатуры (a11y): подсвечивается по .cm-marker:focus-visible */}
                  <circle className="cm-focus" r="17" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1.5" aria-hidden />
                  <circle
                    r={isActive ? 13 : 10}
                    fill="none"
                    stroke={col}
                    strokeWidth="1.5"
                    strokeDasharray={p.category === "hidden" ? "3 3" : undefined}
                    opacity={isActive ? 0.95 : 0.6}
                    filter="url(#cm-glow)"
                  />
                  <circle r="4" fill={col} filter="url(#cm-glow)" />
                  <text
                    x={l.dx}
                    y={l.dy}
                    textAnchor={l.anchor}
                    className="font-mono-cyber"
                    fontSize="11"
                    letterSpacing="1.5"
                    fill={isActive ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.62)"}
                  >
                    {p.name}
                  </text>
                </g>
              );
            })}

            {/* затемнение по краям */}
            <rect width="1000" height="800" fill="url(#cm-vig)" pointerEvents="none" />
          </svg>

          {/* подпись под схемой */}
          <p className="font-mono-cyber border-t border-white/10 px-5 py-4 text-[10px] uppercase leading-relaxed tracking-[0.2em] text-white/35">
            {MAP_NOTE}
          </p>
        </div>
      </div>

      {/* карточка объекта: aria-live — выбор объекта объявляется скринридеру */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="beam-border-static relative min-h-[280px] bg-[#0a0a16] p-7" aria-live="polite">
          <Corners color={accent ?? "cyan"} />
          {active ? (
            <div>
              <p className={`font-mono-cyber text-[10px] uppercase tracking-[0.3em] ${ACCENT_TEXT[CAT_ACCENT[active.category]]}`}>
                {active.id} · {MAP_CATEGORIES.find((c) => c.id === active.category)?.label}
              </p>
              <h3 className="font-display mt-3 text-xl uppercase leading-snug tracking-wide text-white/95">
                {active.name}
              </h3>
              <p className="font-cyber mt-4 text-sm leading-relaxed text-white/70">{active.text}</p>
              {(active.href || activeGl) && (
                <div className="mt-6 flex flex-col items-start gap-2.5">
                  {active.href && (
                    <Link
                      href={active.href}
                      className="font-mono-cyber inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-white/50 transition-colors hover:text-[var(--neon-cyan)]"
                    >
                      {"//"} {active.hrefLabel ?? "на сайте"} <span aria-hidden>→</span>
                    </Link>
                  )}
                  {activeGl && (
                    <Link
                      href={`/glossary#${activeGl.id}`}
                      className="font-mono-cyber inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-white/50 transition-colors hover:text-[var(--neon-magenta)]"
                    >
                      {"//"} Словарь · {activeGl.term} <span aria-hidden>→</span>
                    </Link>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="flex min-h-[240px] flex-col justify-center">
              <p className="font-mono-cyber text-[10px] uppercase tracking-[0.3em] text-white/35">
                {"//"} реестр объекта пуст
              </p>
              <p className="font-cyber mt-4 text-sm leading-relaxed text-white/55">
                Выберите точку на схеме — досье объекта откроется здесь. Слои переключаются чипами над картой; «Скрытое» — то, чего нет в официальных сводках.
              </p>
            </div>
          )}
        </div>

        {/* легенда ярусов */}
        <div className="font-mono-cyber mt-6 space-y-2 border border-white/10 bg-white/[0.02] p-5 text-[10px] uppercase leading-relaxed tracking-[0.2em] text-white/40">
          <p className="text-white/55">Условности схемы:</p>
          <p>{"//"} пунктирный купол — силовые поля «Купола»</p>
          <p>{"//"} голубая сетка — связи Нейросетки</p>
          <p>{"//"} амбер-эллипс — маршрут патрулей дронов</p>
          <p>{"//"} штриховка — Пустошь за стеной города</p>
        </div>
      </aside>
    </div>
  );
}
