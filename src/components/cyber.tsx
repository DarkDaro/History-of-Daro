"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { animate, motion, useInView } from "framer-motion";

/* ============================================================
   Переиспользуемые киберпанк-компоненты
   ============================================================ */

type Accent = "cyan" | "magenta" | "amber";

const ACCENT_BORDER: Record<Accent, string> = {
  cyan: "border-[var(--neon-cyan)]",
  magenta: "border-[var(--neon-magenta)]",
  amber: "border-[var(--neon-amber)]",
};

const ACCENT_BG: Record<Accent, string> = {
  cyan: "bg-[var(--neon-cyan)]",
  magenta: "bg-[var(--neon-magenta)]",
  amber: "bg-[var(--neon-amber)]",
};

const ACCENT_TEXT: Record<Accent, string> = {
  cyan: "text-[var(--neon-cyan)]",
  magenta: "text-[var(--neon-magenta)]",
  amber: "text-[var(--neon-amber)]",
};

/** Угловые HUD-скобки для панелей */
export function Corners({ color = "cyan" }: { color?: Accent }) {
  return (
    <span aria-hidden className="pointer-events-none absolute inset-0 z-10">
      <i className={`absolute -left-px -top-px h-3.5 w-3.5 border-l-2 border-t-2 ${ACCENT_BORDER[color]}`} />
      <i className={`absolute -right-px -top-px h-3.5 w-3.5 border-r-2 border-t-2 ${ACCENT_BORDER[color]}`} />
      <i className={`absolute -bottom-px -left-px h-3.5 w-3.5 border-b-2 border-l-2 ${ACCENT_BORDER[color]}`} />
      <i className={`absolute -bottom-px -right-px h-3.5 w-3.5 border-b-2 border-r-2 ${ACCENT_BORDER[color]}`} />
    </span>
  );
}

/** Детерминированный псевдослучай [0,1) — без рассинхрона гидратации */
function seeded(i: number, salt: number): number {
  return ((i * 9301 + salt * 49297) % 233280) / 233280;
}

/** CSS-дождь: анимированные капли */
export function Rain({ count = 46 }: { count?: number }) {
  const drops = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: seeded(i, 1) * 100,
        dur: 0.75 + seeded(i, 2) * 0.85,
        delay: seeded(i, 3) * 2.2,
        height: 7 + seeded(i, 4) * 9,
        magenta: seeded(i, 5) > 0.72,
        opacity: 0.16 + seeded(i, 6) * 0.3,
      })),
    [count]
  );
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {drops.map((d, i) => (
        <span
          key={i}
          className={`rain-drop ${d.magenta ? "magenta" : ""}`}
          style={{
            left: `${d.left}%`,
            height: `${d.height}vh`,
            opacity: d.opacity,
            animationDuration: `${d.dur}s`,
            animationDelay: `${d.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

/** Посимвольная печать текста + мигающий курсор */
export function Typewriter({
  text,
  speed = 26,
  className = "",
}: {
  text: string;
  speed?: number;
  className?: string;
}) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (n < text.length) {
      const t = setTimeout(() => setN((v) => v + 1), speed);
      return () => clearTimeout(t);
    }
  }, [n, text, speed]);
  return (
    <span className={className}>
      {text.slice(0, n)}
      <span className="tw-caret" aria-hidden />
    </span>
  );
}

/** Анимированный счётчик при попадании в вьюпорт */
export function Counter({
  to,
  suffix = "",
  className = "",
}: {
  to: number;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration: 1.8,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (x) => setV(Math.round(x)),
    });
    return () => controls.stop();
  }, [inView, to]);
  return (
    <span ref={ref} className={className}>
      {v.toLocaleString("ru-RU")}
      {suffix}
    </span>
  );
}

/** Полоска характеристики 0–10 */
export function StatBar({
  label,
  value,
  color = "cyan",
}: {
  label: string;
  value: number;
  color?: Accent;
}) {
  return (
    <div>
      <div className="flex items-center justify-between font-mono-cyber text-[9px] uppercase tracking-[0.25em] text-white/40">
        <span>{label}</span>
        <span className={ACCENT_TEXT[color]}>{value}/10</span>
      </div>
      <div className="mt-1.5 h-1 w-full overflow-hidden bg-white/10">
        <motion.div
          className={`h-full ${ACCENT_BG[color]}`}
          style={{ boxShadow: "0 0 8px currentColor" }}
          initial={{ width: 0 }}
          whileInView={{ width: `${value * 10}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
        />
      </div>
    </div>
  );
}

const BOOT_LINES = [
  "ДАРО-OS // BOOT SEQUENCE v4.7",
  "ПРОВЕРКА ПАМЯТИ.......... 40 ТБ · ОК",
  "НЕЙРОСЕТКА............... ПОДКЛЮЧЕНО",
  "ИДЕНТИФИКАЦИЯ............ ГОСТЬ-7",
  "ДОСТУП РАЗРЕШЁН",
];

/** Загрузочная заставка при первом входе */
export function BootOverlay() {
  const [step, setStep] = useState(0);
  const [closing, setClosing] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    if (closing) return;
    if (step < BOOT_LINES.length) {
      const t = setTimeout(() => setStep((s) => s + 1), 230);
      return () => clearTimeout(t);
    }
    const t2 = setTimeout(() => setClosing(true), 420);
    return () => clearTimeout(t2);
  }, [step, closing]);

  useEffect(() => {
    if (!closing) return;
    const t = setTimeout(() => setGone(true), 700);
    return () => clearTimeout(t);
  }, [closing]);

  if (gone) return null;

  return (
    <div
      role="status"
      aria-label="Загрузка сайта"
      onClick={() => setStep(BOOT_LINES.length)}
      className={`boot-overlay fixed inset-0 z-[100] flex cursor-pointer items-center justify-center bg-[#05050a] ${
        closing ? "boot-closed" : ""
      }`}
    >
      <div className="font-mono-cyber text-[11px] leading-7 tracking-[0.2em] sm:text-xs">
        {BOOT_LINES.slice(0, step).map((line, i) => (
          <p
            key={line}
            className={
              i === BOOT_LINES.length - 1
                ? "neon-magenta mt-3 text-sm"
                : i === 0
                  ? "text-white/60"
                  : "neon-cyan"
            }
          >
            {line}
          </p>
        ))}
        {step < BOOT_LINES.length && (
          <p className="text-white/30">
            <span className="tw-caret" aria-hidden />
          </p>
        )}
      </div>
      <p className="absolute bottom-8 font-mono-cyber text-[9px] uppercase tracking-[0.35em] text-white/25">
        клик — пропустить
      </p>
    </div>
  );
}

/** Силуэт города Даро на чистом SVG (без ИИ-картинок) */
export function Skyline() {
  const back: Array<[number, number, number]> = [
    [0, 90, 130], [80, 60, 190], [150, 110, 150], [270, 70, 210], [350, 95, 165],
    [455, 60, 230], [525, 120, 150], [655, 75, 200], [740, 100, 170], [850, 65, 240],
    [925, 115, 155], [1050, 80, 205], [1140, 105, 160], [1255, 70, 225], [1335, 105, 175],
  ];
  const front: Array<[number, number, number]> = [
    [30, 110, 95], [170, 85, 130], [275, 130, 80], [430, 90, 145], [545, 105, 105],
    [680, 85, 160], [790, 125, 95], [940, 95, 135], [1060, 115, 85], [1200, 100, 120],
    [1320, 110, 90],
  ];

  return (
    <svg
      aria-hidden
      viewBox="0 0 1440 320"
      preserveAspectRatio="xMidYMax slice"
      className="absolute bottom-0 left-0 h-[32vh] min-h-[180px] w-full"
    >
      {/* задний план */}
      {back.map(([x, w, h], i) => (
        <rect key={`b${i}`} x={x} y={320 - h} width={w} height={h} fill="#0c1122" opacity="0.85" />
      ))}
      {/* маячки на задних башнях */}
      {[[110, 118], [480, 78], [878, 68], [1278, 83]].map(([x, y], i) => (
        <circle key={`m${i}`} cx={x} cy={y} r="2.5" fill="#ff2a6d" className="flicker" opacity="0.9" />
      ))}
      {/* передний план */}
      {front.map(([x, w, h], bi) => {
        const cols = Math.floor(w / 22);
        const rows = Math.floor(h / 34);
        const windows = [];
        for (let ci = 0; ci < cols; ci++) {
          for (let ri = 0; ri < rows; ri++) {
            const s = bi * 131 + ci * 17 + ri * 7;
            if (s % 5 < 2) {
              windows.push(
                <rect
                  key={`${ci}-${ri}`}
                  x={x + 8 + ci * 20}
                  y={320 - h + 10 + ri * 32}
                  width={6}
                  height={9}
                  fill={s % 11 < 2 ? "#ff2a6d" : "#00f0ff"}
                  opacity={0.35 + (s % 5) * 0.13}
                  className={s % 13 === 0 ? "flicker" : ""}
                />
              );
            }
          }
        }
        return (
          <g key={`f${bi}`}>
            <rect x={x} y={320 - h} width={w} height={h} fill="#070a14" />
            {windows}
            {bi % 3 === 0 && (
              <line x1={x + w / 2} y1={320 - h} x2={x + w / 2} y2={320 - h - 26} stroke="#0c1122" strokeWidth="2" />
            )}
          </g>
        );
      })}
      {/* туман у основания */}
      <rect x="0" y="280" width="1440" height="40" fill="url(#fog)" />
      <defs>
        <linearGradient id="fog" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#05050a" stopOpacity="0" />
          <stop offset="100%" stopColor="#05050a" stopOpacity="1" />
        </linearGradient>
      </defs>
    </svg>
  );
}
