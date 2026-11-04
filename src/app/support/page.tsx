import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Heart,
  Hourglass,
  Palette,
  PenLine,
  RadioTower,
} from "lucide-react";
import { PageHero, SectionHeading } from "@/components/blocks";
import { Corners, Reveal } from "@/components/cyber";
import { CopySupportButton } from "@/components/support-actions";
import { SITE_URL } from "@/lib/site";
import {
  asset,
  BOOKS,
  EXCERPTS,
  SUPPORT_FAQ,
  SUPPORT_GOALS,
  SUPPORT_TIERS,
  SUPPORT_WAYS,
  type Accent,
} from "@/lib/content";

export const metadata: Metadata = {
  openGraph: {
    title: "Поддержать автора",
    images: [{ url: "/covers/og-support.png", width: 1200, height: 630, alt: "Поддержать автора — История Даро" }],
  },
  title: "Поддержать автора",
  description:
    "«История Даро» — некоммерческий проект: без рекламы, без пейволла, весь контент бесплатен. Донаты идут на иллюстрации, редактуру и время на текст. Boosty, бесплатные способы поддержки и честный FAQ.",
  alternates: { canonical: "/support" },
};

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

const GOALS_WITH_ICONS = [
  { Icon: Palette },
  { Icon: PenLine },
  { Icon: Hourglass },
] as const;

export default function SupportPage() {
  const boosty = SUPPORT_WAYS.find((w) => w.id === "boosty");
  return (
    <main className="min-h-screen bg-[#05050a] text-white">
      <PageHero
        kicker="Поддержка · канал энергии"
        title="Поддержать автора"
        glitch
        accent="magenta"
        lead="«История Даро» — личный авторский проект: без рекламы, без пейволла и без продаж. Всё, что здесь есть, читается бесплатно. Если город зацепил — можно передать немного энергии передатчику."
        breadcrumb={[{ href: "/support", label: "Поддержать" }]}
      />

      {/* принцип: ничего не закрывается за деньги */}
      <section className="relative py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <Reveal>
            <div className="relative">
              <Corners color="cyan" />
              <div className="beam-border-static flex items-start gap-5 p-7 sm:gap-7 sm:p-9">
                <RadioTower className="neon-cyan mt-1 h-8 w-8 shrink-0" aria-hidden />
                <div>
                  <h2 className="font-display text-xl uppercase leading-snug tracking-wide sm:text-2xl">
                    Ничего не закрывается за деньги
                  </h2>
                  <p className="font-cyber mt-4 text-sm leading-relaxed text-white/70 sm:text-base">
                    Фрагменты, досье, хроники, карта и глоссарий — бесплатны и останутся такими.
                    Донат не открывает двери: все двери здесь уже открыты. Он ускоряет то,
                    что происходит за сценой, — новые тома, арты и расшифровки. Сайт хостится
                    бесплатно на GitHub Pages, так что каждая переданная сумма уходит в творчество,
                    а не в железо.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* визуальная метафора: передатчик на крыше */}
          <Reveal className="mt-10">
            <figure className="group relative overflow-hidden border border-white/10">
              <div className="relative aspect-[1344/768] w-full">
                <Image
                  src={asset("/covers/support-beacon.png")}
                  alt="Передатчик сопротивления на крыше Хи-Мигаты — неоновая антенна над дождливым городом"
                  fill
                  sizes="(max-width: 896px) 100vw, 896px"
                  className="cover-tone object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#05050a] via-transparent to-transparent" />
              </div>
              <figcaption className="font-mono-cyber absolute bottom-3 left-4 text-[9px] uppercase tracking-[0.3em] text-white/60">
                Ретранслятор «Периметра Зеро» · сектор 12 · ночь перед выходом тома
              </figcaption>
            </figure>
          </Reveal>

          {/* куда идут деньги */}
          <Reveal className="mt-14">
            <SectionHeading
              kicker="Честный список"
              title="Куда идут сигналы"
              num="01"
              accent="cyan"
            />
            <div className="mt-8 grid gap-5 sm:grid-cols-3">
              {SUPPORT_GOALS.map((g, i) => {
                const { Icon } = GOALS_WITH_ICONS[i];
                return (
                  <div key={g.title} className="relative border border-white/10 bg-white/[0.03] p-6">
                    <Icon className={`h-5 w-5 ${ACCENT_TEXT[g.accent]}`} aria-hidden />
                    <h3 className="font-display mt-3 text-sm uppercase tracking-widest">{g.title}</h3>
                    <p className="font-cyber mt-3 text-sm leading-relaxed text-white/60">{g.text}</p>
                  </div>
                );
              })}
            </div>
          </Reveal>
        </div>
      </section>

      {/* каналы поддержки */}
      <section className="relative border-t border-white/10 py-16 sm:py-20">
        <div aria-hidden className="aurora-blob magenta right-[4%] top-[6%] h-72 w-72" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeading
            kicker="Каналы"
            title="Способы поддержать"
            num="02"
            accent="magenta"
          />
          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_340px]">
            <div className="grid content-start gap-5 sm:grid-cols-2">
              {SUPPORT_WAYS.map((w) => {
                const isExternal = w.kind === "platform" && w.href !== "";
                const isCopy = w.kind === "free" || w.kind === "crypto";
                const copyValue = w.kind === "crypto" ? (w.address ?? "") : SITE_URL;
                return (
                  <div
                    key={w.id}
                    className={`relative flex flex-col border ${ACCENT_BORDER[w.accent]} bg-black/40 p-6 backdrop-blur-sm`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <h3 className={`font-display text-lg uppercase tracking-wide ${ACCENT_TEXT[w.accent]}`}>
                        {w.title}
                      </h3>
                      <span className="font-mono-cyber border border-white/15 bg-black/50 px-2.5 py-1 text-[9px] uppercase tracking-[0.25em] text-white/55">
                        {w.tag}
                      </span>
                    </div>
                    <p className="font-cyber mt-4 flex-1 text-sm leading-relaxed text-white/65">{w.text}</p>
                    <div className="mt-5">
                      {isExternal && (
                        <a
                          href={w.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-beam font-mono-cyber inline-flex items-center gap-2 border border-[var(--neon-magenta)]/60 bg-black/50 px-5 py-3 text-[10px] uppercase tracking-[0.3em] text-white transition-colors hover:border-[var(--neon-magenta)] hover:text-white"
                        >
                          {w.cta}
                          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                        </a>
                      )}
                      {isCopy && (
                        <CopySupportButton
                          value={copyValue}
                          label={w.cta}
                          className="w-full"
                          disabled={w.kind === "crypto" && !w.address}
                        />
                      )}
                      {w.kind === "platform" && w.href === "" && (
                        <span className="font-mono-cyber inline-block border border-white/10 px-5 py-3 text-[10px] uppercase tracking-[0.3em] text-white/30">
                          Канал в настройке
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* вертикальный кадр: терминал */}
            <Reveal className="h-full">
              <figure className="group relative h-full min-h-72 overflow-hidden border border-white/10">
                <div className="relative h-full w-full">
                  <Image
                    src={asset("/covers/support-terminal.png")}
                    alt="Уличный голо-терминал Хи-Мигаты: фигура в плаще вставляет светящуюся монету"
                    fill
                    sizes="(max-width: 1024px) 100vw, 340px"
                    className="cover-tone object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#05050a] via-transparent to-transparent" />
                </div>
                <figcaption className="font-mono-cyber absolute bottom-3 left-4 right-4 text-[9px] uppercase leading-relaxed tracking-[0.3em] text-white/60">
                  Терминал энергопередач · приём любых сумм · дождь не помеха
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </div>
      </section>

      {/* уровни boosty */}
      {boosty && boosty.href !== "" && (
        <section className="relative border-t border-white/10 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <SectionHeading
              kicker="Подписка на Boosty"
              title="Уровни доступа"
              num="03"
              accent="amber"
            />
            <p className="font-cyber mt-6 max-w-2xl text-sm leading-relaxed text-white/60">
              Подписка — необязательная форма поддержки для тех, кому хочется быть ближе к
              работе над циклом. Перки — стартовый набор: автор может уточнять состав уровней
              по ходу вещания.
            </p>
            <div className="mt-8 grid gap-5 sm:grid-cols-3">
              {SUPPORT_TIERS.map((t, i) => (
                <Reveal key={t.name} delay={i * 0.08}>
                  <div className={`relative flex h-full flex-col border ${ACCENT_BORDER[t.accent]} bg-black/40 p-7`}>
                    <Corners color={t.accent} />
                    <p className={`font-mono-cyber text-[10px] uppercase tracking-[0.3em] ${ACCENT_TEXT[t.accent]}`}>
                      уровень {String(i + 1).padStart(2, "0")}
                    </p>
                    <h3 className="font-display mt-3 text-xl uppercase tracking-wide">{t.name}</h3>
                    <p className="font-mono-cyber mt-2 text-sm tracking-[0.15em] text-white/80">{t.price}</p>
                    <ul className="font-cyber mt-5 flex-1 space-y-2.5 text-sm leading-relaxed text-white/65">
                      {t.perks.map((p) => (
                        <li key={p} className="flex items-start gap-2.5">
                          <span
                            className={`mt-1.5 shrink-0 ${ACCENT_TEXT[t.accent]}`}
                            aria-hidden
                          >
                            ·
                          </span>
                          {p}
                        </li>
                      ))}
                    </ul>
                    <a
                      href={boosty.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono-cyber mt-6 inline-flex items-center justify-center gap-2 border border-white/20 px-4 py-2.5 text-[10px] uppercase tracking-[0.3em] text-white/70 transition-colors hover:border-white/50 hover:text-white"
                    >
                      Выбрать уровень
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                    </a>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="relative border-t border-white/10 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <SectionHeading kicker="Вопросы" title="Частые ответы" num="04" accent="cyan" />
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {SUPPORT_FAQ.map((f) => (
              <div key={f.q} className="border border-white/10 bg-white/[0.03] p-6">
                <h3 className="font-display text-sm uppercase leading-snug tracking-widest text-white">
                  {f.q}
                </h3>
                <p className="font-cyber mt-3 text-sm leading-relaxed text-white/60">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* финальный CTA */}
      <section className="relative overflow-hidden border-t border-white/10 py-20 sm:py-24">
        <div aria-hidden className="aurora-blob cyan left-[6%] top-[10%] h-72 w-72" />
        <div aria-hidden className="aurora-blob magenta bottom-[5%] right-[6%] h-80 w-80" />
        <div className="relative mx-auto max-w-2xl px-4 text-center sm:px-6">
          <Reveal>
            <p className="font-mono-cyber text-xs uppercase tracking-[0.4em] neon-magenta">Передатчик работает</p>
            <h2 className="font-display mt-3 text-3xl uppercase tracking-wide text-white sm:text-5xl">
              Спасибо за сигнал
            </h2>
            <div className="mx-auto mt-5 h-px w-24 bg-[var(--neon-magenta)] shadow-[0_0_12px_var(--neon-magenta)]" />
            <p className="font-cyber mt-8 text-white/70">
              Каждая сумма и каждый репост — это энергия, которая возвращается текстом.
              А если донат не про вас — просто прочитайте фрагмент: подписчиков и читателей
              Хи-Мигата любит не меньше донатеров.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
              {boosty && boosty.href !== "" ? (
                <a
                  href={boosty.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-beam font-mono-cyber inline-flex items-center gap-2 border border-[var(--neon-magenta)]/60 bg-black/50 px-7 py-3.5 text-[11px] uppercase tracking-[0.3em] text-white transition-colors hover:border-[var(--neon-magenta)]"
                >
                  <Heart className="h-4 w-4 text-[var(--neon-magenta)]" aria-hidden />
                  Поддержать на Boosty
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                </a>
              ) : (
                <span className="font-mono-cyber inline-block border border-white/10 px-7 py-3.5 text-[11px] uppercase tracking-[0.3em] text-white/30">
                  Канал поддержки в настройке
                </span>
              )}
              <Link
                href={`/excerpts/${EXCERPTS[0].slug}`}
                className="font-mono-cyber inline-flex items-center gap-2 border border-white/15 px-7 py-3.5 text-[11px] uppercase tracking-[0.3em] text-white/60 transition-colors hover:border-white/40 hover:text-white"
              >
                Сначала прочитать
              </Link>
            </div>
            <p className="font-mono-cyber mt-8 text-[9px] uppercase tracking-[0.3em] text-white/30">
              {BOOKS.length} тома в работе · всё бесплатно · передатчик не выключается
            </p>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
