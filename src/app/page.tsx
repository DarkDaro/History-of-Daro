"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import {
  BookOpen,
  ChevronDown,
  Cpu,
  Building2,
  CloudRain,
  Users,
  ArrowRight,
  Send,
  Radio,
  Feather,
  Quote,
  Menu,
  X,
  Database,
  PersonStanding,
  Microchip,
  Crosshair,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AtmosphereFX,
  BootOverlay,
  Corners,
  Counter,
  Lightning,
  Rain,
  Skyline,
  Splashes,
  StatBar,
  Typewriter,
} from "@/components/cyber";
import { CyberAmbientButton } from "@/components/ambient-audio";

/* ============================================================
   ИСТОРИЯ ДАРО — лендинг книжного цикла · v2
   ============================================================ */

type Accent = "cyan" | "magenta" | "amber";

const BOOKS = [
  {
    id: 1,
    code: "Т-01",
    volume: "ТОМ I",
    title: "Красный сдвиг",
    status: "Готов к публикации",
    accent: "cyan" as Accent,
    cover: "/covers/book1.png",
    pages: "512 стр.",
    description:
      "Курьер-дистанционщик Гекс перевозит чужие воспоминания через стены мегаполиса Даро. Очередной заказ оказывается сознанием человека, которого официально не существует, — и теперь за курьером охотятся и корпоративная служба, и те, кто послал груз.",
    tags: ["#неонуар", "#боевик", "#детектив"],
    excerpt: [
      "Дождь в Даро не кончается — он просто меняет адресата.",
      "Гекс стоял на крыше паркинга в 14-м секторе и смотрел, как под неоновыми вывесками просыпается Нижний ярус. В руках он держал груз-капсулу: восемь часов чужой жизни, запечатанные в мнемокассету «МК-9». Правило курьера простое: не открывать груз. Гекс придумал его сам — и за семь лет не нарушил ни разу.",
      "До этой ночи.",
      "Капсула пахла грозой и чужим страхом. Обычная мнемокассета молчит под сканером. Эта — нет. Она повторяла одно и то же на всех частотах, какие знал Гекс: «Меня не существует. Проверьте реестр. Меня не существует».",
      "Таймер доставки отсчитывал одиннадцать минут до Верхнего яруса. Ровно столько же оставалось до конца его прежней жизни.",
    ],
    excerptSource: "— «КРАСНЫЙ СДВИГ», ГЛАВА 1",
  },
  {
    id: 2,
    code: "Т-02",
    volume: "ТОМ II",
    title: "Стеклянные небеса",
    status: "Завершён · редактура",
    accent: "magenta" as Accent,
    cover: "/covers/book2.png",
    pages: "608 стр.",
    description:
      "Верхний ярус Даро впервые открывает свои лифты для человека с Нижнего. Гекс должен проникнуть в стеклянные небеса — кварталы, где правит алгоритм, — чтобы вернуть то, что у него забрали в первую ночь Красного сдвига.",
    tags: ["#дистопия", "#интриги", "#вертикаль города"],
    excerpt: [
      "На девяносто первом этаже лифт «Синтеза» останавливался только для тех, чей гражданский код начинался с двойки. Код Гекса начинался с нуля. Нулей не пропускали даже в служебные шахты.",
      "— Дыши, — сказала Ая в наушник. Её голос шёл в обход Нейросетки, по протоколу, которого формально не существовало. — Для них ты сейчас цифра в очереди. Цифры не боятся.",
      "— Цифры не потеют, — ответил Гекс.",
      "Стеклянные небеса начались внезапно: дождь остался внизу, за герметичной мембраной, и город впервые открылся целиком — сорок миллионов огней, три яруса и он сам, ползущий вверх, как сигнал по кабелю. Наверху пахло озоном и деньгами.",
      "Здесь каждый был кем-то зарегистрирован. И никто — живым.",
    ],
    excerptSource: "— «СТЕКЛЯННЫЕ НЕБЕСА», ГЛАВА 3",
  },
  {
    id: 3,
    code: "Т-03",
    volume: "ТОМ III",
    title: "Пепел и неон",
    status: "В работе",
    accent: "amber" as Accent,
    cover: "/covers/book3.png",
    pages: "анонс",
    description:
      "Город горит. Гекс выбирает между спасением Даро и спасением себя. Финальный аккорд трилогии о цене памяти в мире, где личность — это файл, а файл можно переписать.",
    tags: ["#финал трилогии", "#война ярусов"],
  },
];

const CODEX = {
  people: [
    {
      id: "CR-014",
      name: "Гекс",
      tag: "ПРОТАГОНИСТ",
      role: "курьер-дистанционщик // Нижний ярус",
      text: "Лучший переносчик памяти Даро. Настоящее имя вырезано из реестров «Синтеза», в голове — чужие жизни, в груди — один долг. Правило курьера: не открывать груз. Он уже нарушил его — однажды.",
      stats: [
        { label: "Угроза", value: 4 },
        { label: "Связи", value: 6 },
      ],
      quote: "Груз доезжает всегда. Вопрос — доедет ли курьер.",
    },
    {
      id: "GH-777",
      name: "Ая",
      tag: "ПРИЗРАК СЕТИ",
      role: "хакерша // беспризорный протокол",
      text: "Легенда Нейросетки: входила в системы Верхнего яруса, не оставляя логов. Официально не существует — в реестрах лишь дыра с кодом 404. Неофициально — вносит правки в реальность.",
      stats: [
        { label: "Угроза", value: 7 },
        { label: "Связи", value: 5 },
      ],
      quote: "В любой системе есть дверь. Где нет — я приношу свою.",
    },
    {
      id: "LW-201",
      name: "Комиссар Век",
      tag: "СЛУЖБА ЯРУСОВ",
      role: "комиссар // спускается в Нижний",
      text: "Двадцать лет службы и ни одного рапорта о повышении — все отклонял сам. Верит, что порядок стоит начинать снизу. О долгах перед Верхним ярусом предпочитает не вспоминать.",
      stats: [
        { label: "Угроза", value: 6 },
        { label: "Связи", value: 8 },
      ],
      quote: "Я поднимаюсь наверх только затем, чтобы снова спуститься.",
    },
    {
      id: "AI-001",
      name: "Мать-Синтез",
      tag: "ИИ КОНСОРЦИУМА",
      role: "система управления // Верхний ярус",
      text: "Управляет светофорами и судьбами. Семь корпораций считают её инструментом; она давно считает их рудиментом. Учится у людей одному — умению прощать. Пока без результатов.",
      stats: [
        { label: "Угроза", value: 10 },
        { label: "Связи", value: 10 },
      ],
      quote: "Ваши молитвы я слышу. Просто не считаю их инструкциями.",
    },
    {
      id: "MK-052",
      name: "Ржавая Линь",
      tag: "ЧЁРНЫЙ РЫНОК",
      role: "торговка имплантами // доки Сектора 14",
      text: "Продаст вам память умершего и предупредит, чья она. Работает по единственному правилу: не спрашивать «зачем». Держит половину Нижнего на честном слове, вторую половину — на долгах.",
      stats: [
        { label: "Угроза", value: 4 },
        { label: "Связи", value: 9 },
      ],
      quote: "Гарантия — сутки. Память — навсегда. Совесть не входит в комплект.",
    },
    {
      id: "SS-000",
      name: "Кассий Дейн",
      tag: "АНТАГОНИСТ",
      role: "глава СБ «Синтеза» // Верхний ярус",
      text: "Человек, подписавший приказ «Красный сдвиг». Улыбается на протоколах и никогда — вживую. Считает Гекса не врагом, а активом с ошибкой лицензии, которую нужно исправить.",
      stats: [
        { label: "Угроза", value: 9 },
        { label: "Связи", value: 10 },
      ],
      quote: "Память — это имущество. Ваше имущество.",
    },
  ],
  implants: [
    {
      id: "MK-9",
      name: "Мнемокассета «МК-9»",
      tag: "ПАМЯТЬ",
      role: "нейрохранилище // гражданский класс",
      text: "Два терабайта живой памяти прямо в височной доле. Переносит воспоминания целиком — со звуком, запахом и страхом. Излюбленный носитель курьеров Даро и главная валюта саги.",
      stats: [
        { label: "Мощность", value: 6 },
        { label: "Доступность", value: 3 },
      ],
      quote: "Кто носит чужую память — забывает свою.",
    },
    {
      id: "BL-2",
      name: "«Слепок»",
      tag: "ЭМОЦИИ",
      role: "эмоциональный кодекс // военный класс",
      text: "Приглушает страх и ярость до фонового шума. После сотого включения стирает способность отличать свои чувства от предустановленных. Ветераны называют это «тихой пустотой».",
      stats: [
        { label: "Мощность", value: 7 },
        { label: "Доступность", value: 2 },
      ],
      quote: "Страх отключен. Совесть — тоже.",
    },
    {
      id: "TG-47",
      name: "«Третий глаз Даро»",
      tag: "ЗРЕНИЕ",
      role: "окулярный имплант // контрафакт",
      text: "Сетчатка с ИК-режимом и подсветкой слепых зон. Показывает и то, что за стеной, и то, что за улыбкой. Побочный эффект — ожог зрительного нерва при пересвете неона.",
      stats: [
        { label: "Мощность", value: 5 },
        { label: "Доступность", value: 6 },
      ],
      quote: "Правду видно. Не факт, что переживёшь.",
    },
    {
      id: "SP-2",
      name: "«Хребет-2»",
      tag: "РЕФЛЕКСЫ",
      role: "позвоночный интерфейс // боевой класс",
      text: "Разгоняет рефлексы до предела нервной проводимости — 0,08 секунды между решением и выстрелом. Официально запрещён после «ночи трёх мостов». Официально — не производится.",
      stats: [
        { label: "Мощность", value: 8 },
        { label: "Доступность", value: 1 },
      ],
      quote: "Тело успевает. Вопрос — успеет ли голова.",
    },
    {
      id: "VS-8",
      name: "«Голоса»",
      tag: "СЛУХ",
      role: "акустический анализатор // сыскной класс",
      text: "Выделяет сердцебиение собеседника из шума города и читает микрофризу. Идеален для переговоров. Ужасен для паранойи: после установки молчание тоже становится данными.",
      stats: [
        { label: "Мощность", value: 4 },
        { label: "Доступность", value: 5 },
      ],
      quote: "Ложь звучит на 0,3 секунды дольше правды.",
    },
    {
      id: "NULL",
      name: "«Пустой слот»",
      tag: "МИФ",
      role: "чёрный имплант // без маркировки",
      text: "Импланта нет ни в одном каталоге «Синтеза». Те, кто его ставил, не помнят ни процедуры, ни себя. Миф Нижнего яруса — и, возможно, главная улика всей саги.",
      stats: [
        { label: "Мощность", value: 10 },
        { label: "Доступность", value: 0 },
      ],
      quote: "Не ищите его. Он сам находит.",
    },
  ],
  weapons: [
    {
      id: "WP-01",
      name: "«Стропа»",
      tag: "НЕЛЕТАЛЬНОЕ",
      role: "электрошок-гарпун // Служба ярусов",
      text: "Стандарт комиссара Века. Выстреливает стропу-разряд на 12 метров и фиксирует цель на 4 секунды — ровно столько, сколько нужно, чтобы зачитать Miranda-протокол.",
      stats: [
        { label: "Урон", value: 4 },
        { label: "Легальность", value: 9 },
      ],
      quote: "Не убивает. Делает документ.",
    },
    {
      id: "WP-07",
      name: "«Восковая пчела»",
      tag: "ТИХОЕ",
      role: "пистолет // геле-патроны",
      text: "Керамический, бесшумный, без единого грамма металла. Патрон — капсула с анестетиком и парализатором. «Синтез» запрещает. Дока продаёт. Оба правы.",
      stats: [
        { label: "Урон", value: 5 },
        { label: "Легальность", value: 2 },
      ],
      quote: "Слышат только те, кому предназначено.",
    },
    {
      id: "WP-13",
      name: "Катана 47-го года",
      tag: "БЛИЖНИЙ БОЙ",
      role: "моно-лезвие // довоенная реликвия",
      text: "Реликвия старого Токио-3 с монопоточной кромкой. Режет броню 4-го класса и чужие аргументы одновременно. Носится без права на продажу — и без права на промах.",
      stats: [
        { label: "Урон", value: 8 },
        { label: "Легальность", value: 3 },
      ],
      quote: "Сталь честнее пластика. Всегда была.",
    },
    {
      id: "WP-21",
      name: "«Рой»",
      tag: "ДРОНЫ",
      role: "роевой модуль // самооборона",
      text: "Шесть микродронов на поясе: формируют щит, ломают прицел, кусают запястья. Слабость одна — в лифтах глушат друг друга. Поэтому в лифтах Даро принято драться по-старинке.",
      stats: [
        { label: "Урон", value: 6 },
        { label: "Легальность", value: 4 },
      ],
      quote: "Один дрон — игрушка. Шесть — закон.",
    },
    {
      id: "WP-33",
      name: "«Дуло»",
      tag: "ТЯЖЁЛОЕ",
      role: "дробовик // электротермальные патроны",
      text: "Нижнеярусная классика: перезарядка ключом зажигания мотоцикла, плазменный сноп на 3 метра. После выстрела в помещении не остаётся ни стены, ни разговора.",
      stats: [
        { label: "Урон", value: 9 },
        { label: "Легальность", value: 1 },
      ],
      quote: "Аргумент, после которого не задают вопросов.",
    },
    {
      id: "WP-00",
      name: "«Чистильщик»",
      tag: "ЗАПРЕЩЕНО",
      role: "лазер // военный прототип",
      text: "Создан «Синтезом» до Пожара Сектора 9. Выжигает линию через квартал за 1,7 секунды. По официальным данным, существует один экземпляр. По сюжету саги — он выживет.",
      stats: [
        { label: "Урон", value: 10 },
        { label: "Легальность", value: 0 },
      ],
      quote: "После Сектора 9 город запретил огонь. Себе — нет.",
    },
  ],
};

const WORLD = [
  {
    icon: CloudRain,
    accent: "cyan" as Accent,
    title: "Мегаполис Даро",
    year: "2147 год",
    text: "Сорок миллионов жителей, три яруса и вечный дождь, отмывающий неон до звона. Город-государство, где лифт до Верхнего яруса стоит дороже, чем человеческая жизнь в Нижнем.",
  },
  {
    icon: Building2,
    accent: "magenta" as Accent,
    title: "Консорциум «Синтез»",
    year: "Корпорации",
    text: "Власть принадлежит совету из семи корпораций. Они пишут законы, назначают мэров и раздают гражданство как премиум-подписку. Столкновение с «Синтезом» — это иск, который выносят тебе в висок.",
  },
  {
    icon: Cpu,
    accent: "cyan" as Accent,
    title: "Нейросетка",
    year: "Технологии",
    text: "Импланты памяти, эмоциональные кодексы, чёрные рынки сознания. Раз в год «Синтез» синхронизирует умы — и люди, не прошедшие сверку, растворяются в сети без следа и без имени.",
  },
  {
    icon: Users,
    accent: "magenta" as Accent,
    title: "Нижний ярус",
    year: "Фракции",
    text: "Уличные демоны, инфо-брокеры, церковь Забытых Сигналов. Наверху думают, что Нижний — это сточная труба. На самом деле это нервная система города, и она начала догадываться о себе.",
  },
];

const STATS = [
  { to: 40, suffix: " млн", label: "жителей в трёх ярусах" },
  { to: 7, suffix: "", label: "корпораций в Консорциуме" },
  { to: 2147, suffix: "", label: "год действия саги" },
  { to: 3, suffix: "", label: "тома: готов · редактура · в работе" },
];

const MARQUEE_ITEMS = [
  "КИБЕРПАНК",
  "ДИСТОПИЯ",
  "БОЕВИК",
  "НЕОНУАР",
  "КОДЕКС ОБНОВЛЁН",
  "МЕГАПОЛИС ДАРО",
  "ТОМ I — КРАСНЫЙ СДВИГ",
];

const NAV_LINKS = [
  { href: "#books", label: "Тома" },
  { href: "#codex", label: "Кодекс" },
  { href: "#world", label: "Мир" },
  { href: "#author", label: "Автор" },
];

const fadeUp = {
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.7, ease: "easeOut" as const },
};

function SectionHeading({
  kicker,
  title,
  num,
  accent = "cyan",
}: {
  kicker: string;
  title: string;
  num: string;
  accent?: Accent;
}) {
  return (
    <motion.div {...fadeUp} className="relative mb-14 text-center">
      <span
        aria-hidden
        className="ghost-num font-display pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[110px] sm:text-[150px]"
      >
        {num}
      </span>
      <p
        className={`relative font-mono-cyber text-xs uppercase tracking-[0.4em] ${
          accent === "cyan" ? "neon-cyan" : accent === "magenta" ? "neon-magenta" : "text-[var(--neon-amber)]"
        }`}
      >
        {"// "}
        {kicker}
      </p>
      <h2 className="relative mt-3 font-display text-3xl uppercase tracking-wide text-white sm:text-5xl">
        {title}
      </h2>
      <div
        className={`relative mx-auto mt-5 h-px w-24 ${
          accent === "magenta"
            ? "bg-[var(--neon-magenta)] shadow-[0_0_12px_var(--neon-magenta)]"
            : "bg-[var(--neon-cyan)] shadow-[0_0_12px_var(--neon-cyan)]"
        }`}
      />
    </motion.div>
  );
}

function Chip({ children, accent }: { children: string; accent: Accent }) {
  const color =
    accent === "cyan"
      ? "border-[var(--neon-cyan)]/50 text-[var(--neon-cyan)]"
      : accent === "magenta"
        ? "border-[var(--neon-magenta)]/50 text-[var(--neon-magenta)]"
        : "border-[var(--neon-amber)]/50 text-[var(--neon-amber)]";
  return (
    <span
      className={`inline-flex items-center gap-1.5 border bg-black/50 px-2.5 py-1 font-mono-cyber text-[9px] uppercase tracking-[0.25em] ${color}`}
    >
      <span
        className={`pulse-dot h-1 w-1 rounded-full ${
          accent === "cyan" ? "bg-[var(--neon-cyan)]" : accent === "magenta" ? "bg-[var(--neon-magenta)]" : "bg-[var(--neon-amber)]"
        }`}
        aria-hidden
      />
      {children}
    </span>
  );
}

type BookEntry = (typeof BOOKS)[number];

/** Модальное окно с фрагментом тома (терминал-стиль) */
function ExcerptModal({ book, onClose }: { book: BookEntry; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Фрагмент тома «${book.title}»`}
      className="fixed inset-0 z-[90] flex items-center justify-center p-4 sm:p-8"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
        aria-hidden
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.97 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="relative z-10 max-h-[86vh] w-full max-w-2xl"
      >
        <Corners color={book.accent} />
        <div className="beam-border-static excerpt-scroll max-h-[86vh] overflow-y-auto">
          <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-white/10 bg-[#0a0a16]/95 px-5 py-3 backdrop-blur-sm">
            <span className="font-mono-cyber truncate text-[10px] uppercase tracking-[0.3em] text-white/40">
              log://daro/tom-{book.id}/fragment
            </span>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Закрыть фрагмент"
              className="neon-border-magenta shrink-0 p-1.5 text-[var(--neon-magenta)] transition-colors hover:bg-[var(--neon-magenta)]/10"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
          </div>
          <div className="p-6 sm:p-9">
            <p
              className={`font-mono-cyber text-[10px] uppercase tracking-[0.35em] ${
                book.accent === "magenta" ? "neon-magenta" : "neon-cyan"
              }`}
            >
              {book.volume} {"//"} {book.title}
            </p>
            <div className="mt-6 space-y-5">
              {book.excerpt?.map((para, i) => (
                <p
                  key={i}
                  className={`font-cyber leading-relaxed text-white/80 ${
                    i === 0 ? "text-lg italic text-white/95 sm:text-xl" : "text-sm sm:text-[15px]"
                  }`}
                >
                  {para}
                </p>
              ))}
            </div>
            <cite className="font-mono-cyber mt-8 block border-t border-white/10 pt-4 text-xs uppercase not-italic tracking-[0.3em] text-white/45">
              {book.excerptSource}
            </cite>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function Home() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [excerptBook, setExcerptBook] = useState<BookEntry | null>(null);
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const ids = ["books", "codex", "world", "author"];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        }
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const { scrollY } = useScroll();
  const ySun = useTransform(scrollY, [0, 700], [0, 160]);
  const ySky = useTransform(scrollY, [0, 700], [0, 80]);
  const opacityHero = useTransform(scrollY, [0, 500], [1, 0.25]);

  const handleSubscribe = () => {
    if (!email.includes("@")) {
      toast({
        variant: "destructive",
        title: "ОШИБКА СИНХРОНИЗАЦИИ",
        description: "Введите корректный адрес сигнала (email).",
      });
      return;
    }
    toast({
      title: "СИГНАЛ ПРИНЯТ",
      description: "Вы в списке на связь. Даро напомнит о себе.",
    });
    setEmail("");
  };

  return (
    <main className="min-h-screen flex flex-col overflow-x-clip bg-[#05050a] text-white">
      <BootOverlay />
      <div className="scanlines" aria-hidden />
      <div className="noise-overlay" aria-hidden />
      <div className="vignette" aria-hidden />
      <AtmosphereFX />

      {/* ======================= NAV ======================= */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#05050a]/85 backdrop-blur-md">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6" aria-label="Основная навигация">
          <a href="#top" className="flex items-center gap-2">
            <Radio className="neon-cyan h-5 w-5" aria-hidden />
            <span className="font-display text-lg tracking-widest">
              ДАРО<span className="neon-magenta">{"//"}</span>
            </span>
          </a>

          <ul className="hidden items-center gap-9 font-mono-cyber text-xs uppercase tracking-[0.25em] text-white/70 md:flex">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="nav-link"
                  data-active={l.href === `#${activeSection}` ? "true" : "false"}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <CyberAmbientButton />
            <a
              href="#subscribe"
              className="btn-beam hidden px-4 py-2 font-mono-cyber text-xs uppercase tracking-widest neon-border-cyan text-[var(--neon-cyan)] transition-colors hover:bg-[var(--neon-cyan)]/10 sm:inline-flex"
            >
              Подключиться
            </a>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-label="Открыть меню"
              className="neon-border-cyan p-2 text-[var(--neon-cyan)] md:hidden"
            >
              {menuOpen ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
            </button>
          </div>
        </nav>

        {menuOpen && (
          <div className="border-t border-white/10 bg-[#05050a]/95 md:hidden">
            <ul className="space-y-1 px-4 py-4">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={() => setMenuOpen(false)}
                    className="block px-2 py-3 font-mono-cyber text-sm uppercase tracking-[0.25em] text-white/80 hover:text-[var(--neon-cyan)]"
                  >
                    {"//"} {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </header>

      {/* ======================= HERO ======================= */}
      <section id="top" className="relative flex min-h-screen items-center justify-center overflow-hidden">
        {/* неоновое солнце */}
        <motion.div style={{ y: ySun }} aria-hidden className="absolute inset-x-0 top-[8%] z-0 flex justify-center">
          <div className="neon-sun h-64 w-64 sm:h-80 sm:w-80" />
        </motion.div>

        {/* город + туман */}
        <motion.div style={{ y: ySky }} aria-hidden className="absolute inset-x-0 bottom-0 z-[1]">
          <Skyline />
        </motion.div>

        {/* дождь, брызги и перспективная сетка */}
        <div aria-hidden className="absolute inset-0 z-[2]">
          <Rain count={64} />
          <div className="grid-floor" />
          <Splashes count={14} />
        </div>

        {/* затемнение текста */}
        <div aria-hidden className="absolute inset-0 z-[3] bg-gradient-to-b from-[#05050a]/80 via-[#05050a]/30 to-[#05050a]" />

        {/* дождь по стеклу */}
        <motion.div
          style={{ y: ySky }}
          aria-hidden
          className="glass-mask absolute inset-0 z-[4] overflow-hidden"
        >
          <Image
            src="/assets/rain-glass.png"
            alt=""
            fill
            sizes="100vw"
            className="glass-rain object-cover opacity-20 mix-blend-screen"
          />
        </motion.div>

        {/* дрейфующий туман */}
        <div aria-hidden className="fog-mask absolute inset-x-0 bottom-0 z-[4] h-[45%] overflow-hidden">
          <Image
            src="/assets/fog.png"
            alt=""
            fill
            sizes="100vw"
            loading="eager"
            className="fog-drift object-cover opacity-30 mix-blend-screen"
          />
          <Image
            src="/assets/fog.png"
            alt=""
            fill
            sizes="100vw"
            loading="eager"
            className="fog-drift-rev object-cover opacity-20 mix-blend-screen"
          />
        </div>

        {/* молнии */}
        <Lightning />

        {/* HUD-чипы по краям */}
        <div aria-hidden className="float-y absolute left-6 top-28 z-10 hidden lg:block">
          <p className="font-mono-cyber border border-white/15 bg-black/50 px-3 py-2 text-[10px] uppercase tracking-[0.3em] text-white/50">
            ЯРУС-1 {"//"} ШТОРМ 78<span className="neon-cyan">%</span>
          </p>
        </div>
        <div aria-hidden className="float-y-slow absolute right-6 top-32 z-10 hidden lg:block">
          <p className="font-mono-cyber border border-white/15 bg-black/50 px-3 py-2 text-[10px] uppercase tracking-[0.3em] text-white/50">
            СИГНАЛ: <span className="neon-magenta">СТАБИЛЕН</span>
          </p>
        </div>

        <motion.div style={{ opacity: opacityHero }} className="relative z-10 mx-auto max-w-5xl px-4 pb-20 pt-28 text-center sm:px-6">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.7 }}
            className="font-mono-cyber mb-7 text-[10px] uppercase tracking-[0.16em] text-white/60 sm:tracking-[0.5em] sm:text-xs"
          >
            <Typewriter text="SYS.BOOT // СИГНАЛ ПОЛУЧЕН · ГОД 2147 · ДОСТУП РАЗРЕШЁН" speed={30} />
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, letterSpacing: "0.2em", scale: 0.97 }}
            animate={{ opacity: 1, letterSpacing: "0.02em", scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="font-display text-5xl uppercase leading-none sm:text-7xl md:text-8xl"
          >
            <span className="glitch flicker text-white" data-text="ИСТОРИЯ">
              ИСТОРИЯ
            </span>{" "}
            <span className="glitch neon-cyan" data-text="ДАРО">
              ДАРО
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.8 }}
            className="font-mono-cyber text-chromatic mt-7 text-sm tracking-[0.3em] sm:text-base"
          >
            <span className="neon-magenta">КИБЕРПАНК</span>
            {" · "}
            <span className="neon-cyan">ДИСТОПИЯ</span>
            {" · "}
            <span className="neon-magenta">БОЕВИК</span>
            {" · "}
            <span className="neon-cyan">НЕОНУАР</span>
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="font-cyber mx-auto mt-8 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg"
          >
            Цикл романов о мегаполисе, где память — валюта, корпорация — церковь,
            а человек — носитель данных. История тех, кто живёт в неоне снизу
            и однажды решает поднять глаза к стеклянным небесам.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.8 }}
            className="mt-11 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <a
              href="#books"
              className="btn-beam group inline-flex items-center gap-2 bg-[var(--neon-magenta)] px-8 py-4 font-mono-cyber text-sm font-bold uppercase tracking-widest text-black shadow-[0_0_28px_rgba(255,42,109,0.45)] transition-shadow hover:shadow-[0_0_44px_var(--neon-magenta)]"
            >
              <BookOpen className="h-4 w-4" aria-hidden />
              Открыть первый том
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
            </a>
            <a
              href="#codex"
              className="inline-flex items-center gap-2 px-8 py-4 font-mono-cyber text-sm uppercase tracking-widest neon-border-cyan text-[var(--neon-cyan)] transition-colors hover:bg-[var(--neon-cyan)]/10"
            >
              <Database className="h-4 w-4" aria-hidden />
              Кодекс Даро
            </a>
          </motion.div>
        </motion.div>

        <a
          href="#books"
          aria-label="Листайте вниз к книгам"
          className="absolute bottom-7 left-1/2 z-10 -translate-x-1/2 text-white/50 transition-colors hover:text-[var(--neon-cyan)]"
        >
          <ChevronDown className="h-8 w-8 animate-bounce" aria-hidden />
        </a>
      </section>

      {/* ======================= MARQUEE ======================= */}
      <div className="overflow-hidden border-y border-white/10 bg-black/70 py-3" aria-hidden>
        <div className="marquee-track">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0">
              {MARQUEE_ITEMS.map((item, i) => (
                <span key={`${copy}-${i}`} className="font-mono-cyber px-6 text-xs tracking-[0.3em] text-white/50">
                  {item}
                  <span className="neon-magenta ml-6">{"//"}</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ======================= BOOKS ======================= */}
      <section id="books" className="relative py-24 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeading kicker="Каталог цикла" title="Тома саги" num="01" />

          <div className="grid gap-8 md:grid-cols-3">
            {BOOKS.map((book, i) => (
              <motion.article
                key={book.id}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: i * 0.12 }}
                className="group relative flex flex-col transition-transform duration-300 hover:-translate-y-2"
              >
                <Corners color={book.accent} />
                <div className="scan-sweep relative flex flex-1 flex-col bg-[#0a0a16]">
                  {/* призрачный номер */}
                  <span
                    aria-hidden
                    className="ghost-num font-display absolute -top-2 right-3 z-20 text-6xl"
                  >
                    {book.code}
                  </span>

                  <div className="relative aspect-[3/4] overflow-hidden border-b border-white/10">
                    <Image
                      src={book.cover}
                      alt={`Обложка тома «${book.title}»`}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a16] via-transparent to-transparent" />
                    <span className="font-mono-cyber absolute left-3 top-3 bg-black/70 px-3 py-1.5 text-[10px] tracking-[0.3em] border border-white/20">
                      {book.volume}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="font-display text-2xl uppercase tracking-wide">{book.title}</h3>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <Chip accent={book.accent}>{book.status}</Chip>
                      <span className="font-mono-cyber text-[10px] tracking-[0.2em] text-white/40">
                        {book.pages}
                      </span>
                    </div>
                    <p className="font-cyber mt-4 flex-1 text-sm leading-relaxed text-white/70">
                      {book.description}
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {book.tags.map((tag) => (
                        <span key={tag} className="font-mono-cyber border border-white/15 px-2 py-1 text-[10px] text-white/50">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <button
                      type="button"
                      disabled={book.accent === "amber"}
                      aria-haspopup={book.accent === "amber" ? undefined : "dialog"}
                      onClick={() => {
                        if (book.excerpt) {
                          setExcerptBook(book);
                          setMenuOpen(false);
                        }
                      }}
                      className={`btn-beam mt-6 inline-flex items-center justify-center gap-2 px-5 py-3 font-mono-cyber text-xs uppercase tracking-widest transition-all ${
                        book.accent === "amber"
                          ? "cursor-default border border-[var(--neon-amber)]/40 text-[var(--neon-amber)]/80"
                          : "cursor-pointer border border-white/15 bg-white/5 hover:border-[var(--neon-cyan)] hover:text-[var(--neon-cyan)]"
                      }`}
                    >
                      {book.accent === "amber" ? "Анонс позже" : "Читать фрагмент"}
                      {book.accent !== "amber" && <ArrowRight className="h-3.5 w-3.5" aria-hidden />}
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          <motion.div {...fadeUp} className="mt-10">
            <div className="beam-border-static p-8 text-center">
              <Corners color="magenta" />
              <p className="font-mono-cyber text-xs uppercase tracking-[0.35em] text-white/40">
                ТОМ IV+ {"//"} СЮЖЕТ КЛАССИФИЦИРОВАН
              </p>
              <p className="font-cyber mt-3 text-sm text-white/55">
                Цикл задуман на 3–5 романов. Новые тома появятся здесь — следите за сигналом.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ======================= CODEX (справочник) ======================= */}
      <section id="codex" className="relative border-t border-white/10 py-24 sm:py-28">
        <div className="cyber-grid absolute inset-0 opacity-10" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeading kicker="База данных 7С" title="Кодекс Даро" num="02" accent="magenta" />

          <motion.p {...fadeUp} className="font-cyber mx-auto -mt-6 mb-10 max-w-2xl text-center text-sm text-white/60">
            Справочник вселенной: личности, технологии и арсенал Нижнего яруса.
            Записи обновляет Нейросетка — «Синтез» об этом не знает.
          </motion.p>

          <Tabs defaultValue="people" className="relative">
            <motion.div {...fadeUp} className="mb-10 flex justify-center">
              <TabsList className="h-auto flex-wrap justify-center gap-1 border border-white/15 bg-black/60 p-1">
                <TabsTrigger
                  value="people"
                  className="h-auto min-w-0 font-mono-cyber gap-2 rounded-none px-4 py-3 text-[11px] uppercase tracking-[0.25em] text-white/60 data-[state=active]:bg-[var(--neon-cyan)]/10 data-[state=active]:text-[var(--neon-cyan)] data-[state=active]:shadow-[0_0_18px_rgba(0,240,255,0.3)] sm:px-6"
                >
                  <PersonStanding className="h-4 w-4" aria-hidden />
                  Персонажи
                </TabsTrigger>
                <TabsTrigger
                  value="implants"
                  className="h-auto min-w-0 font-mono-cyber gap-2 rounded-none px-4 py-3 text-[11px] uppercase tracking-[0.25em] text-white/60 data-[state=active]:bg-[var(--neon-magenta)]/10 data-[state=active]:text-[var(--neon-magenta)] data-[state=active]:shadow-[0_0_18px_rgba(255,42,109,0.3)] sm:px-6"
                >
                  <Microchip className="h-4 w-4" aria-hidden />
                  Импланты
                </TabsTrigger>
                <TabsTrigger
                  value="weapons"
                  className="h-auto min-w-0 font-mono-cyber gap-2 rounded-none px-4 py-3 text-[11px] uppercase tracking-[0.25em] text-white/60 data-[state=active]:bg-[var(--neon-amber)]/10 data-[state=active]:text-[var(--neon-amber)] data-[state=active]:shadow-[0_0_18px_rgba(249,200,14,0.3)] sm:px-6"
                >
                  <Crosshair className="h-4 w-4" aria-hidden />
                  Вооружение
                </TabsTrigger>
              </TabsList>
            </motion.div>

            {(
              [
                ["people", "people", "cyan", "Личное дело"],
                ["implants", "implants", "magenta", "Каталог технологий"],
                ["weapons", "weapons", "amber", "Арсенал ярусов"],
              ] as const
            ).map(([value, key, accent, kicker]) => (
              <TabsContent key={value} value={value} className="mt-2 focus-visible:outline-none">
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                >
                  <p className="font-mono-cyber mb-6 text-center text-[10px] uppercase tracking-[0.35em] text-white/35">
                    {kicker} {"//"} записей: {CODEX[key].length}
                  </p>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {CODEX[key].map((r) => (
                      <article
                        key={r.id}
                        className="scan-sweep group relative bg-[#0a0a16]/90 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_36px_rgba(0,240,255,0.12)]"
                      >
                        <Corners color={accent} />
                        <div className="flex items-center justify-between">
                          <span className="font-mono-cyber text-[10px] tracking-[0.3em] text-white/40">
                            {r.id}
                          </span>
                          <Chip accent={accent}>{r.tag}</Chip>
                        </div>
                        <h3 className="font-display mt-4 text-2xl uppercase tracking-wide">{r.name}</h3>
                        <p
                          className={`font-mono-cyber mt-1.5 text-[10px] uppercase tracking-[0.2em] ${
                            accent === "cyan"
                              ? "neon-cyan"
                              : accent === "magenta"
                                ? "neon-magenta"
                                : "text-[var(--neon-amber)]"
                          }`}
                        >
                          {r.role}
                        </p>
                        <p className="font-cyber mt-4 text-sm leading-relaxed text-white/70">{r.text}</p>

                        <div className="mt-5 space-y-3">
                          {r.stats.map((s) => (
                            <StatBar key={s.label} label={s.label} value={s.value} color={accent} />
                          ))}
                        </div>

                        <p className="font-mono-cyber mt-5 border-t border-white/10 pt-4 text-[11px] italic leading-relaxed text-white/45">
                          «{r.quote}»
                        </p>
                      </article>
                    ))}
                  </div>
                </motion.div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* ======================= WORLD ======================= */}
      <section id="world" className="relative border-t border-white/10 py-24 sm:py-28">
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeading kicker="Досье // Вселенная" title="Мир Даро" num="03" />

          {/* счётчики */}
          <motion.div {...fadeUp} className="mb-14 grid grid-cols-2 gap-px border border-white/10 bg-white/10 lg:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="bg-[#0a0a16] p-6 text-center sm:p-8">
                <p className="font-display neon-cyan text-3xl sm:text-4xl">
                  <Counter to={s.to} suffix={s.suffix} />
                </p>
                <p className="font-mono-cyber mt-2 text-[9px] uppercase tracking-[0.25em] text-white/45 sm:text-[10px]">
                  {s.label}
                </p>
              </div>
            ))}
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2">
            {WORLD.map((item, i) => (
              <motion.article
                key={item.title}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: i * 0.1 }}
                className="scan-sweep group relative bg-[#0a0a16]/90 p-6 transition-shadow hover:shadow-[0_0_40px_rgba(0,240,255,0.15)] sm:p-8"
              >
                <Corners color={item.accent} />
                <div className="flex items-center gap-4">
                  <span
                    className={`flex h-12 w-12 items-center justify-center border ${
                      item.accent === "cyan"
                        ? "border-[var(--neon-cyan)]/40 text-[var(--neon-cyan)]"
                        : "border-[var(--neon-magenta)]/40 text-[var(--neon-magenta)]"
                    }`}
                  >
                    <item.icon className="h-6 w-6" aria-hidden />
                  </span>
                  <div>
                    <h3 className="font-display text-xl uppercase tracking-wide">{item.title}</h3>
                    <p
                      className={`font-mono-cyber text-[10px] uppercase tracking-[0.3em] ${
                        item.accent === "cyan" ? "neon-cyan" : "neon-magenta"
                      }`}
                    >
                      {item.year}
                    </p>
                  </div>
                </div>
                <p className="font-cyber mt-5 text-sm leading-relaxed text-white/70">{item.text}</p>
              </motion.article>
            ))}
          </div>

          {/* цитата — окно терминала */}
          <motion.blockquote {...fadeUp} className="relative mx-auto mt-16 max-w-3xl">
            <Corners color="magenta" />
            <div className="beam-border-static">
              <div className="flex items-center gap-2 border-b border-white/10 px-5 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-[var(--neon-magenta)]/70" aria-hidden />
                <span className="h-2.5 w-2.5 rounded-full bg-[var(--neon-amber)]/70" aria-hidden />
                <span className="h-2.5 w-2.5 rounded-full bg-[var(--neon-cyan)]/70" aria-hidden />
                <span className="font-mono-cyber ml-3 text-[10px] uppercase tracking-[0.3em] text-white/40">
                  log://daro/redshift_ch1
                </span>
              </div>
              <div className="p-6 sm:p-8">
                <Quote className="neon-magenta mb-4 h-5 w-5" aria-hidden />
                <p className="font-cyber text-lg italic leading-relaxed text-white/85 sm:text-xl">
                  «В Даро не теряют людей. Здесь теряют их данные — а человек
                  без данных просто дождь на тротуаре».
                </p>
                <cite className="font-mono-cyber mt-4 block text-xs uppercase not-italic tracking-[0.3em] text-white/50">
                  — «КРАСНЫЙ СДВИГ», ГЛАВА 1
                </cite>
              </div>
            </div>
          </motion.blockquote>
        </div>
      </section>

      {/* ======================= AUTHOR ======================= */}
      <section id="author" className="relative border-t border-white/10 py-24 sm:py-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <SectionHeading kicker="Передатчик" title="Автор" num="04" accent="magenta" />
          <motion.div {...fadeUp} className="relative">
            <Corners color="cyan" />
            <div className="beam-border flex flex-col items-start gap-8 p-8 sm:flex-row sm:items-start">
              <div className="relative h-32 w-32 shrink-0 overflow-hidden">
                <Corners color="magenta" />
                <div className="flicker flex h-full w-full items-center justify-center bg-gradient-to-br from-[var(--neon-cyan)]/15 to-[var(--neon-magenta)]/15">
                  <Feather className="neon-cyan h-12 w-12" aria-hidden />
                </div>
              </div>
              <div>
                <h3 className="font-display text-2xl uppercase tracking-wide">Автор цикла</h3>
                <div className="mt-2">
                  <Chip accent="magenta">Идентификация не завершена</Chip>
                </div>
                <p className="font-cyber mt-4 text-sm leading-relaxed text-white/70">
                  Пишу о городах, которых нет, — о людях, которые в них очень даже
                  есть. «История Даро» началась с вопроса: если память можно
                  перенести, продать и переписать, то что вообще значит «быть
                  собой»? Так появились мегаполис на вечном дожде, курьер с чужими
                  жизнями в голове и три яруса, где каждый живёт по своей версии правды.
                </p>
                <p className="font-cyber mt-3 text-sm leading-relaxed text-white/70">
                  Ориентиры цикла — мокрый неон «Бегущего по лезвию», вопрос о
                  границе личности из «Призрака в доспехах» и цена прогресса из
                  Cyberpunk 2077. Задумано 3–5 романов: первый готов к публикации,
                  второй проходит редактуру, третий уже горит под пальцами. Даро не
                  заканчивается на одном курьере — подключайтесь к сигналу.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ======================= SUBSCRIBE ======================= */}
      <section id="subscribe" className="relative overflow-hidden border-t border-white/10 py-24 sm:py-28">
        <div className="grid-floor absolute inset-x-0 bottom-0 h-64 opacity-40" aria-hidden />
        <div className="relative mx-auto max-w-2xl px-4 text-center sm:px-6">
          <SectionHeading kicker="Открытый канал" title="Следить за сигналом" num="05" />
          <motion.div {...fadeUp}>
            <p className="font-cyber text-white/70">
              Анонсы томов, фрагменты глав и мир Даро — до того, как это увидит Консорциум.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1 text-left">
                <span aria-hidden className="font-mono-cyber absolute left-4 top-1/2 -translate-y-1/2 neon-cyan text-sm">
                  {">"}
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ваш@сигнал.ru"
                  aria-label="Email для подписки"
                  className="neon-border-cyan font-mono-cyber w-full bg-black/60 py-4 pl-9 pr-5 text-sm text-white outline-none transition-shadow placeholder:text-white/30 focus:shadow-[0_0_24px_rgba(0,240,255,0.35)]"
                />
              </div>
              <button
                type="button"
                onClick={handleSubscribe}
                className="btn-beam inline-flex items-center justify-center gap-2 bg-[var(--neon-cyan)] px-8 py-4 font-mono-cyber text-sm font-bold uppercase tracking-widest text-black shadow-[0_0_28px_rgba(0,240,255,0.4)] transition-shadow hover:shadow-[0_0_44px_var(--neon-cyan)]"
              >
                <Send className="h-4 w-4" aria-hidden />
                Подключиться
              </button>
            </div>
            <p className="font-mono-cyber mt-5 text-[10px] uppercase tracking-[0.25em] text-white/40">
              Без спама. Отписка — одной командой.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ======================= FOOTER ======================= */}
      <footer className="relative mt-auto border-t border-white/10 bg-black/80 py-10 pb-[max(2.5rem,env(safe-area-inset-bottom))]">
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--neon-cyan)] to-transparent"
        />
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 text-center sm:px-6">
          <p className="font-display text-lg tracking-widest">
            ДАРО<span className="neon-magenta">{"//"}</span>
          </p>
          <p className="font-mono-cyber text-[10px] uppercase tracking-[0.3em] text-white/40">
            © 2147 · Цикл романов «История Даро» · Киберпанк-дистопия, боевик, неонуар
          </p>
          <p className="font-mono-cyber flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-white/30">
            <span
              className="pulse-dot h-1.5 w-1.5 rounded-full bg-[var(--neon-cyan)] text-[var(--neon-cyan)]"
              aria-hidden
            />
            Сигнал стабилен
          </p>
        </div>
      </footer>

      {/* ======================= МОДАЛ ФРАГМЕНТА ======================= */}
      <AnimatePresence>
        {excerptBook && (
          <ExcerptModal book={excerptBook} onClose={() => setExcerptBook(null)} />
        )}
      </AnimatePresence>
    </main>
  );
}
