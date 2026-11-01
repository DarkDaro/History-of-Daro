import { MoreLink } from "@/components/blocks";
import { Corners, Reveal } from "@/components/cyber";
import type { Accent, CalendarEvent } from "@/lib/content";

/* ============================================================
   Календарь событий мира 2147: события, сгруппированные по месяцам.
   Секция страницы /timeline (02). Данные — src/content/calendar.ts
   (шаблон с примерными датами — решение хозяина, 2026-11-02).
   Серверный компонент: интерактивности нет, Reveal даёт появление.
   ============================================================ */

const ACCENT_TEXT: Record<Accent, string> = {
  cyan: "neon-cyan",
  magenta: "neon-magenta",
  amber: "text-[var(--neon-amber)]",
};

const ACCENT_BORDER: Record<Accent, string> = {
  cyan: "border-[var(--neon-cyan)]/40",
  magenta: "border-[var(--neon-magenta)]/40",
  amber: "border-[var(--neon-amber)]/40",
};

const MONTHS = [
  "январь",
  "февраль",
  "март",
  "апрель",
  "май",
  "июнь",
  "июль",
  "август",
  "сентябрь",
  "октябрь",
  "ноябрь",
  "декабрь",
];

function monthIndex(when: string): number {
  const m = Number(when.slice(5, 7));
  return Number.isFinite(m) ? Math.min(Math.max(m - 1, 0), 11) : 0;
}

export function CalendarView({
  events,
  note,
}: {
  events: CalendarEvent[];
  note: string;
}) {
  const sorted = [...events].sort((a, b) => a.when.localeCompare(b.when));

  const months: { label: string; items: CalendarEvent[] }[] = [];
  for (const e of sorted) {
    const label = MONTHS[monthIndex(e.when)];
    const last = months[months.length - 1];
    if (last && last.label === label) last.items.push(e);
    else months.push({ label, items: [e] });
  }

  return (
    <div>
      <p className="font-mono-cyber text-xs leading-relaxed text-white/40">
        {"// "}
        {note}
      </p>

      <div className="mt-10 space-y-14">
        {months.map((month, mi) => (
          <Reveal key={`${month.label}-${mi}`} delay={Math.min(mi * 0.05, 0.3)}>
            <div className="flex items-center gap-4">
              <span
                className={`font-mono-cyber text-sm uppercase tracking-[0.35em] ${
                  mi % 2 === 0 ? "neon-cyan" : "neon-magenta"
                }`}
              >
                {month.label}
              </span>
              <span className="h-px flex-1 bg-white/10" aria-hidden />
              <span className="font-mono-cyber text-[10px] tracking-[0.3em] text-white/30">
                2147
              </span>
            </div>

            <ul className="mt-6 space-y-6">
              {month.items.map((e) => (
                <li
                  key={`${e.when}-${e.title}`}
                  className="relative border border-white/10 bg-black/40 p-5 sm:p-6"
                >
                  <Corners color={e.accent} />
                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className={`border bg-black/60 px-3 py-1 font-mono-cyber text-sm ${ACCENT_BORDER[e.accent]} ${ACCENT_TEXT[e.accent]}`}
                    >
                      {e.dateLabel}
                    </span>
                    <span className="font-mono-cyber text-[10px] uppercase tracking-[0.2em] text-white/40">
                      {e.place}
                    </span>
                  </div>
                  <h3 className="font-cyber mt-3 text-lg text-white">{e.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/70">{e.text}</p>
                  {e.href && e.hrefLabel ? (
                    <div className="mt-4">
                      <MoreLink href={e.href}>{e.hrefLabel}</MoreLink>
                    </div>
                  ) : null}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
