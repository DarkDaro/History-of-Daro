import type { Metadata } from "next";
import { PageHero, SectionHeading, MoreLink } from "@/components/blocks";
import { Reveal } from "@/components/cyber";
import { CorporationRegistry } from "@/components/corporation-registry";
import { ResistanceGrid } from "@/components/resistance-grid";
import { CORPORATIONS, RESISTANCE_GROUPS } from "@/lib/content";

export const metadata: Metadata = {
  title: "Организации и корпорации",
  description:
    "Семь корпораций Хи-Мигаты — консорциум, который пишет законы и раздаёт гражданство как премиум-подписку: Технодоминус, Хи-Гама, Бергинатор, Синтез, Спектр, Исток, Купол. Реестр «Периметра Зеро».",
  alternates: { canonical: "/corporations" },
};

/* ============================================================
   /corporations — отдельный реестр семи корпораций.
   Источник данных — CORPORATIONS из content.ts: автор добавляет
   корпорацию одним блоком, страница и поиск обновляются сами.
   ============================================================ */

export default function CorporationsPage() {
  return (
    <main className="min-h-screen bg-[#05050a] text-white">
      <PageHero
        kicker="Власть · реестр консорциума"
        title="Организации и корпорации"
        glitch
        lead="Город называется Хи-Мигата, подпись под городом — «Хи-Гама». Семь корпораций пишут законы, назначают мэров и раздают гражданство как премиум-подписку. Мир не разрушен — он контролируется."
        breadcrumb={[{ href: "/corporations", label: "Корпорации" }]}
        rainGlass
      />

      {/* как устроена власть */}
      <section className="relative py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <Reveal>
              <div className="beam-border-static h-full p-7">
                <p className="font-mono-cyber text-[10px] uppercase tracking-[0.35em] neon-cyan">
                  Принцип 01
                </p>
                <p className="font-cyber mt-4 text-base leading-relaxed text-white/85">
                  Консорциум не правит с трибуны — он правит балансом.
                  Столкнуться с корпорацией — значит увидеть в стене своего
                  дома новую графику оплаты: воздух, вода, память, покой.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="beam-border-static h-full p-7">
                <p className="font-mono-cyber text-[10px] uppercase tracking-[0.35em] neon-magenta">
                  Принцип 02
                </p>
                <p className="font-cyber mt-4 text-base leading-relaxed text-white/85">
                  Каждая корпорация владеет своей монополией: сеть, энергия,
                  машины, тело, новости, вода, щит. Семь монополий вместе —
                  это и есть город.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.16}>
              <div className="beam-border-static h-full p-7">
                <p className="font-mono-cyber text-[10px] uppercase tracking-[0.35em] text-[var(--neon-amber)]">
                  Принцип 03
                </p>
                <p className="font-cyber mt-4 text-base leading-relaxed text-white/85">
                  Корпорации не ломают людей при всех. Они просто пересобирают
                  их так, что те сами не замечают. За каждый квартал — отчёт,
                  за каждого мятежника — графа в балансе.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* реестр */}
      <section className="relative border-t border-white/10 py-20 sm:py-24">
        <div className="cyber-grid absolute inset-0 opacity-[0.05]" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeading
            kicker="Файлы-codeкс"
            title="Семь корпораций"
            num="01"
            accent="magenta"
          />
          <Reveal className="-mt-6 mb-12 text-center">
            <p className="font-cyber mx-auto max-w-2xl text-sm leading-relaxed text-white/60">
              Реестр ведёт «Периметр Зеро»: коды начинаются с HMD — Хи-Мигата.
              Нажмите на карточку, чтобы открыть корпоративный файл целиком:
              монополия, методы и следы, которые корпорация оставила в других
              разделах досье.
            </p>
          </Reveal>
          <CorporationRegistry items={CORPORATIONS} />
        </div>
      </section>

      {/* сопротивление и независимые */}
      <section className="relative border-t border-white/10 py-20 sm:py-24">
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeading
            kicker="Те, кто вне консорциума"
            title="Сопротивление и независимые"
            num="02"
            accent="cyan"
          />
          <Reveal className="-mt-6 mb-12 text-center">
            <p className="font-cyber mx-auto max-w-2xl text-sm leading-relaxed text-white/60">
              У реестра есть обратная сторона: те, кого нельзя купить
              карточками «Истока» и не найти в файлах HMD. Сводка «Периметра
              Зеро» — здесь; полные файлы групп — в досье мира.
            </p>
          </Reveal>
          <ResistanceGrid items={RESISTANCE_GROUPS} />
          <Reveal className="mt-10 text-center">
            <MoreLink href="/world">Полные файлы групп · досье мира</MoreLink>
          </Reveal>
        </div>
      </section>

      {/* куда дальше */}
      <section className="relative border-t border-white/10 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
          <Reveal>
            <p className="font-cyber mx-auto max-w-2xl text-sm leading-relaxed text-white/60">
              У консорциума есть лица, оружие и хронология решений: люди,
              которые подписывают графики баланса, машины, которые приводят
              их в исполнение, и события, которые всё это запустили.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <MoreLink href="/world">Досье мира · Хи-Мигата</MoreLink>
              <MoreLink href="/characters">Личные дела</MoreLink>
              <MoreLink href="/timeline">Таймлайн 2147</MoreLink>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
