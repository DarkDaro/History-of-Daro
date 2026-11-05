import type { Metadata } from "next";
import { CrossLinks, PageHero, SectionHeading, SceneBanner } from "@/components/blocks";
import { Reveal } from "@/components/cyber";
import {
  asset,
  HUMAN_STORIES,
  INFLUENCES,
  LOGLINE,
  PRINCIPLES,
  SYNOPSIS_FULL,
  THEMES,
  VISUALS,
  type Accent,
} from "@/lib/content";

export const metadata: Metadata = {
  openGraph: {
    title: "Суть истории",
    images: [{ url: "/covers/og-story.png", width: 1200, height: 630, alt: "Суть истории — История Даро" }],
  },
  title: "Суть истории",
  description:
    "Синопсис цикла «История Даро. Проект Восход»: логлайн, полный синопсис и темы. Главные герои — Николас и Даро, Лина, Хьюго, Немезида; ансамблевая структура из шести линий одного мира и принципы повествования.",
  alternates: { canonical: "/story" },
};

const ACCENT_LINE: Record<string, string> = {
  cyan: "bg-[var(--neon-cyan)]",
  magenta: "bg-[var(--neon-magenta)]",
  amber: "bg-[var(--neon-amber)]",
};

const ACCENT_TEXT: Record<string, string> = {
  cyan: "neon-cyan",
  magenta: "neon-magenta",
  amber: "text-[var(--neon-amber)]",
};

/** Акценты карточек тем: цикл cyan → magenta → amber. */
const THEME_ACCENTS: Accent[] = ["cyan", "magenta", "amber", "cyan", "magenta", "amber"];

export default function StoryPage() {
  return (
    <main className="min-h-screen bg-[#05050a] text-white">
      <PageHero
        kicker="Ядро цикла · без неона и корпораций"
        title="Суть истории"
        glitch
        lead="Главные герои у цикла есть: Николас и Даро, Лина, Хьюго, Немезида. Ансамблевая здесь структура, а не состав действующих лиц — шесть параллельных линий одного мира. Каждому война отняла своё: память, имя, покой, людей. Ни один не вернул это целиком."
        accent="magenta"
        breadcrumb={[{ href: "/story", label: "Суть" }]}
      />

      {/* те, ради кого всё это */}
      <section className="relative pb-6 pt-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SceneBanner
            src={VISUALS.story}
            alt="Силуэты героев цикла на крыше перед неоновым мегаполисом в дожде"
            caption="ПЯТЕРО ПРОТИВ ГОРОДА · ХУДОЖЕСТВЕННАЯ РЕКОНСТРУКЦИЯ"
            accent="magenta"
            priority
          />
        </div>
      </section>

      {/* синопсис · проект восход */}
      <section className="relative py-20 sm:py-24">
        <div className="cyber-grid absolute inset-0 opacity-[0.05]" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeading kicker="«История Даро» · Проект Восход" title="Синопсис" num="01" />

          <Reveal>
            <div className="beam-border-static p-7 sm:p-10">
              <p className="font-mono-cyber text-[10px] uppercase tracking-[0.35em] neon-magenta">
                Логлайн
              </p>
              <p className="font-cyber mt-4 text-base italic leading-relaxed text-white/85 sm:text-lg">
                {LOGLINE}
              </p>
            </div>
          </Reveal>

          <Reveal className="mt-6">
            <div className="border border-white/10 bg-white/[0.02] p-6 backdrop-blur-sm sm:p-10">
              <p className="font-mono-cyber text-[10px] uppercase tracking-[0.35em] text-white/45">
                Полный синопсис · текст автора
              </p>
              <div className="mt-6 max-w-4xl space-y-5">
                {SYNOPSIS_FULL.map((p, i) => (
                  <p
                    key={i}
                    className={`font-cyber leading-relaxed ${
                      i === 0 ? "text-white/85 sm:text-base" : "text-sm text-white/70 sm:text-base"
                    }`}
                  >
                    {p}
                  </p>
                ))}
              </div>
            </div>
          </Reveal>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {THEMES.map((t, i) => (
              <Reveal key={t.title} delay={(i % 3) * 0.08}>
                <article className="relative h-full border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm transition-colors hover:border-white/25">
                  <div className="flex items-center gap-3">
                    <span className="font-mono-cyber text-[10px] tracking-[0.3em] text-white/55">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className={`font-display text-lg uppercase tracking-wide ${ACCENT_TEXT[THEME_ACCENTS[i]]}`}>
                      {t.title}
                    </h3>
                  </div>
                  <p className="font-cyber mt-3 text-sm leading-relaxed text-white/70">{t.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* пять человеческих историй */}
      <section className="relative border-t border-white/10 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeading kicker="Действующие лица войны" title="Пять историй" num="02" />
          <div className="space-y-5">
            {HUMAN_STORIES.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.06}>
                <article className="group relative grid gap-4 border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm transition-colors hover:border-white/25 sm:grid-cols-[auto_1fr] sm:gap-8 sm:p-8">
                  <span
                    aria-hidden
                    className={`ghost-num font-display text-6xl sm:text-7xl ${ACCENT_TEXT[s.accent]} opacity-40`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-display text-xl uppercase leading-snug tracking-wide text-white/95 sm:text-2xl">
                      {s.title}
                    </h3>
                    <div className={`mt-3 h-px w-16 ${ACCENT_LINE[s.accent]}`} aria-hidden />
                    <p className="font-cyber mt-4 text-sm leading-relaxed text-white/65 sm:text-base">
                      {s.text}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* объект «РХ» · визуальная запись конфликта */}
      <section className="relative pb-6">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SceneBanner
            src={asset("/img/scenes/scene-hunter.webp")}
            alt="Силуэт Резонансного Охотника на краю крыши под дождём: воздух вокруг руки искажён телекинетическим резонансом"
            caption="ОБЪЕКТ «РХ» · ВИЗУАЛЬНАЯ ЗАПИСЬ КОНФЛИКТА · РЕСТАВРАЦИЯ АРХИВА"
            accent="cyan"
          />
        </div>
      </section>

      {/* мир и счёт */}
      <section className="relative border-t border-white/10 py-20 sm:py-24">
        <div className="cyber-grid absolute inset-0 opacity-[0.06]" aria-hidden />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
          <SectionHeading kicker="Две записи реестра" title="Мир и счёт" num="03" accent="magenta" />
          <Reveal>
            <div className="grid gap-px overflow-hidden border border-white/10 bg-white/10 sm:grid-cols-2">
              <div className="bg-[#0a0a16] p-7 text-left sm:p-9">
                <p className="font-mono-cyber text-[10px] uppercase tracking-[0.35em] neon-magenta">
                  Что это за мир
                </p>
                <p className="font-cyber mt-4 text-sm leading-relaxed text-white/70 sm:text-base">
                  Корпорации контролируют воздух, воду, память и сводки. Мир не
                  разрушен — он обслуживается, и это хуже: у постапокалипсиса
                  хотя бы нет графика. А сбой в реестре не добьёшься апдейтом:
                  пока хотя бы один человек ведёт собственный учёт, цифры не
                  сходятся — каждое утро, заново.
                </p>
              </div>
              <div className="bg-[#0a0a16] p-7 text-left sm:p-9">
                <p className="font-mono-cyber text-[10px] uppercase tracking-[0.35em] neon-cyan">
                  Что это за история
                </p>
                <p className="font-cyber mt-4 text-sm leading-relaxed text-white/70 sm:text-base">
                  Пять историй об идентичности: память в рассрочку, командование,
                  оставшееся по умолчанию, имя, которое нужно вспомнить, чтобы
                  понять, чьё оно. Свет здесь — от рекламных дуг, а законы
                  написаны в уставах корпораций. Содержание — счёт: у каждого
                  выбора есть цена, и тариф растёт.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* принципы повествования */}
      <section className="relative border-t border-white/10 py-20 sm:py-24">
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeading kicker="Как устроено повествование" title="Принципы" num="04" />
          <div className="grid gap-6 sm:grid-cols-2">
            {PRINCIPLES.map((p, i) => (
              <Reveal key={p.title} delay={(i % 2) * 0.08}>
                <article className="relative h-full border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm transition-colors hover:border-white/25 sm:p-8">
                  <div className="flex items-center gap-3">
                    <span className="font-mono-cyber text-[10px] tracking-[0.3em] text-white/55">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="font-display text-xl uppercase tracking-wide">{p.title}</h3>
                  </div>
                  <p className="font-cyber mt-4 text-sm leading-relaxed text-white/70">{p.text}</p>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-10">
            <div className="beam-border-static p-7 sm:p-9">
              <p className="font-mono-cyber text-[10px] uppercase tracking-[0.35em] neon-cyan">
                Параллельные линии одного мира
              </p>
              <p className="font-cyber mt-4 text-sm leading-relaxed text-white/70 sm:text-base">
                Линия Николаса/Даро. Линия Лины. Линия сопротивления. Линия
                корпораций. Линия Хьюго. И линия читателя, который постепенно
                собирает из них целое — и понимает героев лучше, чем герои
                понимают себя. Хронология ведётся не «за героем», а «за миром»:
                так белые пятна в истории становятся частью замысла, а не ошибкой.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* влияния */}
      <section className="relative border-t border-white/10 py-20 sm:py-24">
        <div className="cyber-grid absolute inset-0 opacity-[0.05]" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeading kicker="Система координат" title="Влияния" num="05" accent="amber" />
          <Reveal>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] border border-white/10 text-left">
                <thead>
                  <tr className="border-b border-white/10 bg-black/60">
                    <th className="font-mono-cyber px-5 py-4 text-[10px] uppercase tracking-[0.3em] text-white/50">
                      Источник
                    </th>
                    <th className="font-mono-cyber px-5 py-4 text-[10px] uppercase tracking-[0.3em] text-white/50">
                      Что взято
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {INFLUENCES.map((inf, i) => (
                    <tr
                      key={inf.source}
                      className={`border-b border-white/5 transition-colors hover:bg-white/[0.04] ${
                        i % 2 === 0 ? "bg-white/[0.02]" : ""
                      }`}
                    >
                      <td className="font-display px-5 py-4 text-sm uppercase tracking-wide text-white/90">
                        {inf.source}
                      </td>
                      <td className="font-cyber px-5 py-4 text-sm leading-relaxed text-white/65">
                        {inf.taken}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </section>

      {/* финальная цитата */}
      <section className="relative border-t border-white/10 py-20 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <Reveal>
            <p className="font-cyber text-xl italic leading-relaxed text-white/85 sm:text-2xl">
              «Люди, которые боятся, но продолжают идти, — единственная сила,
              которую корпорации не могут посчитать в балансе».
            </p>
            <p className="font-mono-cyber mt-5 text-xs uppercase tracking-[0.3em] text-white/50">
              — материалы цикла
            </p>
          </Reveal>
        </div>
      </section>
      {/* куда дальше */}
      <CrossLinks
        intro="Дальше архив ведёт в визуальный ряд и первоисточники: сцены мира, читалка с фрагментами томов и личные дела тех, о ком только что читали."
        links={[
          { href: "/gallery", label: "Галерея · сцены цикла" },
          { href: "/excerpts", label: "Фрагменты · читалка" },
          { href: "/characters", label: "Персонажи · личные дела" },
        ]}
      />
    </main>
  );
}
