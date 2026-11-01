import type { Metadata } from "next";
import {
  AlertTriangle,
  Building2,
  Cpu,
  Droplets,
  Network,
  ScanFace,
  Skull,
  Users,
  Wrench,
} from "lucide-react";
import { PageHero, SectionHeading, Chip, SceneBanner, MoreLink } from "@/components/blocks";
import { Counter, Reveal } from "@/components/cyber";
import { DossierConsole } from "@/components/dossier-console";
import {
  ANOMALIES,
  DAILY_LIFE,
  DOSSIER_FILES,
  FACTIONS,
  TECH,
  VISUALS,
  WORLD_OVERVIEW,
  WORLD_STATS,
  type Accent,
} from "@/lib/content";

export const metadata: Metadata = {
  openGraph: {
    title: "Мир: Хи-Мигата",
    images: [{ url: "/covers/og-world.png", width: 1200, height: 630, alt: "Мир: Хи-Мигата — История Даро" }],
  },
  title: "Мир: Хи-Мигата",
  description:
    "Мир цикла «История Даро»: город Хи-Мигата, семь корпораций, сопротивление «Периметр Зеро», «цифровое удушение», проект «Генезис» и повседневность города.",
  alternates: { canonical: "/world" },
};

const OVERVIEW_ICONS: Record<string, typeof Building2> = {
  building: Building2,
  cpu: Cpu,
  users: Users,
  alert: AlertTriangle,
};

const ACCENT_TEXT: Record<Accent, string> = {
  cyan: "neon-cyan",
  magenta: "neon-magenta",
  amber: "text-[var(--neon-amber)]",
};

const ACCENT_BORDER: Record<Accent, string> = {
  cyan: "border-[var(--neon-cyan)]/40 text-[var(--neon-cyan)]",
  magenta: "border-[var(--neon-magenta)]/40 text-[var(--neon-magenta)]",
  amber: "border-[var(--neon-amber)]/40 text-[var(--neon-amber)]",
};

export default function WorldPage() {
  return (
    <main className="min-h-screen bg-[#05050a] text-white">
      <PageHero
        kicker="Вселенная цикла · 2147 год"
        title="Мир: Хи-Мигата"
        glitch
        lead="Даро — не место. Даро — человек. Город называется Хи-Мигата: город-завод под куполами, вечный фильтрованный дождь и семь корпораций, которые называют это «стабилизацией». Мир не разрушен — он контролируется. Это хуже."
        breadcrumb={[{ href: "/world", label: "Мир" }]}
        rainGlass
      />

      {/* реконструкция улицы города */}
      <section className="relative pb-6 pt-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SceneBanner
            src={VISUALS.world}
            alt="Улица Хи-Мигаты под куполом: дождь, неон, толпа в тёмных пальто"
            caption="КУПОЛ В-3 · УЛИЦА 47 · РЕКОНСТРУКЦИЯ ПО ПОКАЗАНИЯМ ОЧЕВИДЦЕВ"
            accent="cyan"
            priority
          />
        </div>
      </section>

      {/* счётчики */}
      <section className="relative py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal>
            <div className="grid grid-cols-2 gap-px border border-white/10 bg-white/10 lg:grid-cols-4">
              {WORLD_STATS.map((s) => (
                <div key={s.label} className="bg-[#0a0a16] p-6 text-center sm:p-8">
                  <p className="font-display neon-cyan text-3xl sm:text-4xl">
                    <Counter to={s.to} suffix={s.suffix} group={s.group} />
                  </p>
                  <p className="font-mono-cyber mt-2 text-[9px] uppercase tracking-[0.25em] text-white/45 sm:text-[10px]">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>

          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {WORLD_OVERVIEW.map((item, i) => {
              const Icon = OVERVIEW_ICONS[item.icon] ?? Building2;
              return (
                <Reveal key={item.title} delay={i * 0.08}>
                  <article className="group relative h-full border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm transition-colors hover:border-white/25 sm:p-8">
                    <div className="flex items-center gap-4">
                      <span className={`flex h-12 w-12 items-center justify-center border ${ACCENT_BORDER[item.accent]}`}>
                        <Icon className="h-6 w-6" aria-hidden />
                      </span>
                      <div>
                        <h3 className="font-display text-xl uppercase tracking-wide">{item.title}</h3>
                        <p className={`font-mono-cyber text-[10px] uppercase tracking-[0.3em] ${ACCENT_TEXT[item.accent]}`}>
                          {item.year}
                        </p>
                      </div>
                    </div>
                    <p className="font-cyber mt-5 text-sm leading-relaxed text-white/70">{item.text}</p>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7 корпораций */}
      <section className="relative border-t border-white/10 py-20 sm:py-24">
        <div className="cyber-grid absolute inset-0 opacity-[0.05]" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeading kicker="Власть" title="Семь корпораций" num="01" accent="magenta" />
          <Reveal className="-mt-6 mb-12 text-center">
            <p className="font-cyber mx-auto max-w-2xl text-sm leading-relaxed text-white/60">
              Консорциум, который пишет законы, назначает мэров и раздаёт
              гражданство как премиум-подписку. Реестр ведёт «Периметр Зеро»:
              выберите файл — город или одну из семи. Столкнуться с
              консорциумом — значит увидеть в стене своего дома новую графику
              баланса.
            </p>
          </Reveal>
          <Reveal>
            <DossierConsole files={DOSSIER_FILES} />
          </Reveal>
          <Reveal className="mt-10 text-center">
            <MoreLink href="/corporations">Реестр корпораций · отдельная страница</MoreLink>
          </Reveal>
        </div>
      </section>

      {/* фракции */}
      <section className="relative border-t border-white/10 py-20 sm:py-24">
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeading kicker="Стороны конфликта" title="Фракции" num="02" />
          <div className="grid gap-6 sm:grid-cols-2">
            {FACTIONS.map((f, i) => (
              <Reveal key={f.id} delay={(i % 2) * 0.08}>
                <article className="relative h-full border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm transition-colors hover:border-white/25 sm:p-8">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-2xl uppercase tracking-wide">{f.name}</h3>
                    <Chip accent={f.accent}>{f.tag}</Chip>
                  </div>
                  <p className={`font-mono-cyber mt-1.5 text-[10px] uppercase tracking-[0.2em] ${ACCENT_TEXT[f.accent]}`}>
                    {f.role}
                  </p>
                  <p className="font-cyber mt-4 text-sm leading-relaxed text-white/70">{f.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* технологии и угрозы */}
      <section className="relative border-t border-white/10 py-20 sm:py-24">
        <div className="cyber-grid absolute inset-0 opacity-[0.05]" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeading kicker="Каталог угроз" title="Технологии войны" num="03" accent="amber" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {TECH.map((t, i) => (
              <Reveal key={t.id} delay={(i % 3) * 0.08}>
                <article className="relative h-full border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm transition-colors hover:border-white/25">
                  <div className="flex items-center justify-between">
                    <span className="font-mono-cyber text-[10px] tracking-[0.3em] text-white/40">{t.id}</span>
                    <Chip accent={t.accent}>{t.tag}</Chip>
                  </div>
                  <h3 className="font-display mt-4 text-xl uppercase tracking-wide">{t.name}</h3>
                  <p className={`font-mono-cyber mt-1.5 text-[10px] uppercase tracking-[0.2em] ${ACCENT_TEXT[t.accent]}`}>
                    {t.role}
                  </p>
                  <p className="font-cyber mt-4 text-sm leading-relaxed text-white/70">{t.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* аномалии */}
      <section className="relative border-t border-white/10 py-20 sm:py-24">
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeading kicker="Вне реестров" title="Аномалии" num="04" accent="magenta" />
          <Reveal className="-mt-6 mb-12 text-center">
            <p className="font-cyber mx-auto max-w-2xl text-sm leading-relaxed text-white/60">
              То, что корпорации не смогли ни купить, ни воспроизвести. Раздел
              ведётся со слов очевидцев — официальные источники отрицают само существование аномалий.
            </p>
          </Reveal>
          <div className="grid gap-6 sm:grid-cols-3">
            {ANOMALIES.map((a, i) => (
              <Reveal key={a.id} delay={i * 0.08}>
                <article className="relative h-full border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm transition-colors hover:border-white/25">
                  <Chip accent={a.accent}>{a.tag}</Chip>
                  <h3 className="font-display mt-4 text-xl uppercase tracking-wide">{a.name}</h3>
                  <p className={`font-mono-cyber mt-1.5 text-[10px] uppercase tracking-[0.2em] ${ACCENT_TEXT[a.accent]}`}>
                    {a.role}
                  </p>
                  <p className="font-cyber mt-4 text-sm leading-relaxed text-white/70">{a.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* повседневность */}
      <section className="relative border-t border-white/10 py-20 sm:py-24">
        <div className="cyber-grid absolute inset-0 opacity-[0.05]" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeading kicker="Как живут люди" title="Повседневность" num="05" />
          <Reveal className="-mt-6 mb-12 text-center">
            <p className="font-cyber mx-auto max-w-2xl text-sm leading-relaxed text-white/60">
              Война корпораций — на страницах романов. А в городе между тем
              идёт обычный день: очереди, смены, сканеры, дождь. Полевые
              записи о том, как выглядит изнутри город, в котором всё
              стабильно.
            </p>
          </Reveal>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {DAILY_LIFE.map((d, i) => (
              <Reveal key={d.title} delay={(i % 3) * 0.08}>
                <article className="relative h-full border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm transition-colors hover:border-white/25">
                  <div className="flex items-center gap-3">
                    <span className={`flex h-9 w-9 items-center justify-center border ${ACCENT_BORDER[d.accent]}`}>
                      {d.title.includes("Карточки") ? (
                        <Droplets className="h-4 w-4" aria-hidden />
                      ) : d.title.includes("Сканеры") ? (
                        <ScanFace className="h-4 w-4" aria-hidden />
                      ) : d.title.includes("Смена") ? (
                        <Wrench className="h-4 w-4" aria-hidden />
                      ) : d.title.includes("Ночь") ? (
                        <Network className="h-4 w-4" aria-hidden />
                      ) : d.title.includes("памятью") ? (
                        <Cpu className="h-4 w-4" aria-hidden />
                      ) : (
                        <Skull className="h-4 w-4" aria-hidden />
                      )}
                    </span>
                    <h3 className="font-display text-lg uppercase tracking-wide">{d.title}</h3>
                  </div>
                  <p className="font-cyber mt-4 text-sm leading-relaxed text-white/70">{d.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* принципы мира */}
      <section className="relative border-t border-white/10 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeading kicker="Директивы вселенной" title="Правила мира" num="06" accent="magenta" />
          <div className="grid gap-6 sm:grid-cols-2">
            <Reveal>
              <div className="beam-border-static h-full p-7 sm:p-9">
                <p className="font-mono-cyber text-[10px] uppercase tracking-[0.35em] neon-cyan">
                  Директива 01
                </p>
                <p className="font-cyber mt-4 text-lg leading-relaxed text-white/85">
                  «События не ждут героя. Если Даро опоздал — штурм всё равно
                  начался. Если он не пришёл — корпорация всё равно приняла
                  решение. Мир не ставится на паузу, когда из комнаты выходит
                  главный персонаж».
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="beam-border-static h-full p-7 sm:p-9">
                <p className="font-mono-cyber text-[10px] uppercase tracking-[0.35em] neon-magenta">
                  Директива 02
                </p>
                <p className="font-cyber mt-4 text-lg leading-relaxed text-white/85">
                  «Мир существует без камеры. У каждого крупного события есть
                  скрытый слой: пока Николас отсутствует, Лина получает
                  сообщения, Сена находит пропажу, а корпорации меняют патрули.
                  Читатель живёт в мире — а не следует за героем с камерой».
                </p>
              </div>
            </Reveal>
          </div>
          <Reveal className="mt-10 text-center">
            <MoreLink href="/timeline">Хронология событий · таймлайн 2147</MoreLink>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
