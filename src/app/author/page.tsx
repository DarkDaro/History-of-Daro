import type { Metadata } from "next";
import Link from "next/link";
import { Feather, Radio } from "lucide-react";
import { PageHero, Chip } from "@/components/blocks";
import { Corners, Reveal } from "@/components/cyber";
import { SubscribeForm } from "@/components/subscribe-form";
import { AUTHOR_NODE, JsonLd } from "@/components/seo";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  openGraph: {
    title: "Автор",
    images: [{ url: "/covers/og-author.png", width: 1200, height: 630, alt: "Автор — История Даро" }],
  },
  title: "Автор",
  description:
    "Автор цикла «История Даро»: как начинался Хи-Мигата, откуда взялся Даро и почему в этой истории главное — люди, а не корпорации.",
  alternates: { canonical: "/author" },
};

export default function AuthorPage() {
  return (
    <main className="min-h-screen bg-[#05050a] text-white">
      {/* Schema.org: профиль автора (имя намеренно не раскрывается сайтом) */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ProfilePage",
          url: `${SITE_URL}/author`,
          inLanguage: "ru",
          mainEntity: AUTHOR_NODE,
        }}
      />
      <PageHero
        kicker="Об авторе · канал связи"
        title="Автор"
        accent="magenta"
        lead="Пишу о городе, которого нет, — о людях, которые в нём очень даже есть."
        breadcrumb={[{ href: "/author", label: "Автор" }]}
      />

      <section className="relative py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <Reveal>
            <div className="relative">
              <Corners color="cyan" />
              <div className="beam-border flex flex-col items-start gap-8 p-8 sm:flex-row sm:items-start sm:p-10">
                <div className="relative h-32 w-32 shrink-0">
                  <Corners color="magenta" />
                  <div className="flex h-full w-full items-center justify-center border border-white/10 bg-gradient-to-br from-[var(--neon-cyan)]/10 to-[var(--neon-magenta)]/10">
                    <Feather className="neon-cyan h-12 w-12" aria-hidden />
                  </div>
                </div>
                <div>
                  <h2 className="font-display text-2xl uppercase tracking-wide">Автор цикла</h2>
                  <div className="mt-3">
                    <Chip accent="magenta">Идентификация не завершена</Chip>
                  </div>
                  <p className="font-cyber mt-5 text-sm leading-relaxed text-white/70">
                    «История Даро» началась с вопроса: если память можно отнять,
                    а личность — расщепить, то что вообще значит «быть собой»?
                    Из вопроса вырос человек, которого нет в реестрах, но который
                    двигает металл усилием воли; город-завод Хи-Мигата под вечным
                    дождём; и сопротивление, в котором каждый держится, потому
                    что некому больше.
                  </p>
                  <p className="font-cyber mt-4 text-sm leading-relaxed text-white/70">
                    Город собран из куполов, вечного дождя и уставов семи
                    корпораций — свет там не от солнца. Ориентиры — вопрос об
                    идентичности из «Бегущего по лезвию», кибернетизация
                    «Призрака в доспехах», цена прогресса Cyberpunk 2077.
                    Корпорации в этой истории — не персонажи, а погода. Люди —
                    те, кто каждый раз платит за шаг вперёд из своего:
                    памятью, именем, людьми. Боятся — и всё равно идут.
                  </p>
                  <p className="font-cyber mt-4 text-sm leading-relaxed text-white/70">
                    Замысел — 3–5 романов. Первый том «Красный сдвиг» готов к
                    публикации, второй «Стеклянные небеса» завершён и проходит
                    редактуру, третий «Пепел и неон» в работе. Канал связи открыт:
                    подписка ниже.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* принципы работы */}
          <Reveal className="mt-12">
            <div className="grid gap-6 sm:grid-cols-3">
              <div className="border border-white/10 bg-white/[0.03] p-6">
                <Radio className="neon-cyan h-5 w-5" aria-hidden />
                <h3 className="font-display mt-3 text-sm uppercase tracking-widest">Персонажи важнее эффектов</h3>
                <p className="font-cyber mt-3 text-sm leading-relaxed text-white/60">
                  Голоса героев, их страхи и решения — главное. Неон и дроны —
                  декорации для человеческих историй.
                </p>
              </div>
              <div className="border border-white/10 bg-white/[0.03] p-6">
                <Feather className="neon-magenta h-5 w-5" aria-hidden />
                <h3 className="font-display mt-3 text-sm uppercase tracking-widest">Мир живёт сам</h3>
                <p className="font-cyber mt-3 text-sm leading-relaxed text-white/60">
                  События не ждут героя: у корпораций свои планы, у сопротивления
                  — свои отчёты, у Хьюго — своя игра.
                </p>
              </div>
              <div className="border border-white/10 bg-white/[0.03] p-6">
                <Feather className="text-[var(--neon-amber)] h-5 w-5" aria-hidden />
                <h3 className="font-display mt-3 text-sm uppercase tracking-widest">Счёт не закрыт</h3>
                <p className="font-cyber mt-3 text-sm leading-relaxed text-white/60">
                  Пепел и неон — но счёт ещё не закрыт. Герои всё ещё выбирают,
                  кем быть, — и уже знают цену.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* подписка */}
      <section id="subscribe" className="relative overflow-hidden border-t border-white/10 py-20 sm:py-24">
        <div aria-hidden className="aurora-blob cyan left-[8%] top-[10%] h-72 w-72" />
        <div aria-hidden className="aurora-blob magenta bottom-[5%] right-[6%] h-80 w-80" />
        <div className="relative mx-auto max-w-2xl px-4 text-center sm:px-6">
          <Reveal>
            <p className="font-mono-cyber text-xs uppercase tracking-[0.4em] neon-cyan">Канал связи</p>
            <h2 className="font-display mt-3 text-3xl uppercase tracking-wide text-white sm:text-5xl">
              Подписка
            </h2>
            <div className="mx-auto mt-5 h-px w-24 bg-[var(--neon-cyan)] shadow-[0_0_12px_var(--neon-cyan)]" />
            <p className="font-cyber mt-8 text-white/70">
              Анонсы томов, фрагменты глав и заметки о мире Хи-Мигаты — без спама.
            </p>
            <div className="mt-9 text-left">
              <SubscribeForm />
            </div>
            <p className="font-mono-cyber mt-6 text-[10px] uppercase tracking-[0.3em] text-white/55">
              Передатчику нужна энергия —{" "}
              <Link href="/support" className="neon-magenta transition-opacity hover:opacity-80">
                поддержать автора
              </Link>
            </p>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
