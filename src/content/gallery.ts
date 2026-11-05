/* ============================================================
   ИСТОРИЯ ДАРО — Галерея: арты и кадры.
   Часть канона (B3): правь здесь, content.ts — только ре-экспорт.
   ============================================================ */

import { type Accent, asset } from "./shared";

/** Карточка галереи /gallery: существующий арт из public/ с канон-подписью. */
export interface GalleryItem {
  id: string;
  /** Путь через asset() — работает в обеих сборках (Pages и корень). */
  src: string;
  title: string;
  /** Метка группы: сцена / портрет / обложка. */
  kind: "СЦЕНА" | "ПОРТРЕТ" | "ОБЛОЖКА";
  caption: string;
  accent: Accent;
}

export const GALLERY: GalleryItem[] = [
  /* — сцены — */
  {
    id: "art-city",
    src: asset("/covers/hero-city.png"),
    title: "Хи-Мигата",
    kind: "СЦЕНА",
    caption:
      "Город-завод «Хи-Гамы»: купола, промышленные ярусы и вечный фильтрованный дождь с привкусом озона.",
    accent: "cyan",
  },
  {
    id: "art-world",
    src: asset("/img/scenes/world.webp"),
    title: "Мир под куполами",
    kind: "СЦЕНА",
    caption:
      "Мир не разрушен — он обслуживается: воздух, вода и даже дождь идут через счётчики.",
    accent: "cyan",
  },
  {
    id: "art-implants",
    src: asset("/img/scenes/implants.webp"),
    title: "Импланты «Синтеза»",
    kind: "СЦЕНА",
    caption:
      "«Синтез» продаёт человеку его же тело в рассрочку: память, эмоции, рефлексы — по подписке.",
    accent: "magenta",
  },
  {
    id: "art-armory",
    src: asset("/img/scenes/armory.webp"),
    title: "Арсенал «Бергинатора»",
    kind: "СЦЕНА",
    caption:
      "Дроны, стражи и прототипы «Карателей»: для дирекции война — плановая единица отчётности.",
    accent: "amber",
  },
  {
    id: "art-story",
    src: asset("/img/scenes/story.webp"),
    title: "Хроника Перелома",
    kind: "СЦЕНА",
    caption:
      "Перепись населения не проводилась с момента Перелома: реестр не считает людьми тех, кого не считает.",
    accent: "magenta",
  },
  {
    id: "art-pobeg",
    src: asset("/img/scenes/pobeg.webp"),
    title: "Побег объекта «РХ»",
    kind: "СЦЕНА",
    caption:
      "Сирены, красный свет и шесть кибернетов на пересечении коридора. Объект «РХ» впервые сам решает, кого убивать.",
    accent: "amber",
  },
  {
    id: "art-scene-alley",
    src: asset("/img/scenes/scene-alley.webp"),
    title: "Переулок нижних ярусов",
    kind: "СЦЕНА",
    caption:
      "Неон здесь не выключают: вывески работают даже когда квартал глохнет от сбоя. Дождь смывает афиши, но не цены.",
    accent: "magenta",
  },
  {
    id: "art-scene-domes",
    src: asset("/img/scenes/scene-domes.webp"),
    title: "Купол над ярусами",
    kind: "СЦЕНА",
    caption:
      "Город виден со стороны только одному типу наблюдателей — тем, кому не нужен пропуск обратно. Купол держит воздух и не выпускает лишних.",
    accent: "cyan",
  },
  {
    id: "art-scene-wasteland",
    src: asset("/img/scenes/scene-wasteland.webp"),
    title: "Пустошь за периметром",
    kind: "СЦЕНА",
    caption:
      "За купольным периметром не тишина: ветер, ржавые мачты ретрансляторов и чужие сигналы на краю диапазона.",
    accent: "amber",
  },
  {
    id: "art-scene-tunnel",
    src: asset("/img/scenes/scene-tunnel.webp"),
    title: "Служебный туннель",
    kind: "СЦЕНА",
    caption:
      "Аварийное освещение технического яруса. Сюда не доходят патрули, но доходит дождевая вода — и она идёт без счётчика.",
    accent: "cyan",
  },
  {
    id: "art-scene-terminal",
    src: asset("/img/scenes/scene-terminal.webp"),
    title: "Перехват",
    kind: "СЦЕНА",
    caption:
      "Чужой терминал на середине расшифровки: половина строк — мусор, половина — слишком похожа на правду.",
    accent: "magenta",
  },
  {
    id: "art-scene-dossier",
    src: asset("/img/scenes/scene-dossier.webp"),
    title: "Архив личных дел",
    kind: "СЦЕНА",
    caption:
      "Хранилище досье сопротивления: каждое дело — человек, которого реестр исключил. Пустой слот в среднем ряду — место, которое держат для нового файла.",
    accent: "cyan",
  },
  {
    id: "art-scene-council",
    src: asset("/img/scenes/scene-council.webp"),
    title: "Зал совета семи",
    kind: "СЦЕНА",
    caption:
      "Стол, за которым решают цену воздуха. Голограммы города встают из столешницы — город как отчёт, жители как графа расходов.",
    accent: "magenta",
  },
  {
    id: "art-scene-grid",
    src: asset("/img/scenes/scene-grid.webp"),
    title: "Тактический стол «Периметра»",
    kind: "СЦЕНА",
    caption:
      "Реконструкция города на столе разведки: каркас купола, маршруты патрулей, метки объектов. Схема собирается из украденных данных — и потому приблизительная.",
    accent: "cyan",
  },
  {
    id: "art-scene-kotel",
    src: asset("/img/scenes/scene-kotel.webp"),
    title: "Рынок «Котёл»",
    kind: "СЦЕНА",
    caption:
      "Чёрный рынок в Доках — единственное место, где не проверяют гражданский код. Импланты здесь сняты с ещё живых людей: продавец показывает сертификат, а не историю донора.",
    accent: "magenta",
  },
  {
    id: "art-scene-cleaners",
    src: asset("/img/scenes/scene-cleaners.webp"),
    title: "Сектора «Чистильщиков»",
    kind: "СЦЕНА",
    caption:
      "Банда со своим уставом и своим промыслом: охота на киборгов и вырезанное железо на продажу. Город считает их симптомом, а не причиной.",
    accent: "amber",
  },
  {
    id: "art-scene-hunter",
    src: asset("/img/scenes/scene-hunter.webp"),
    title: "Охотник на краю крыши",
    kind: "СЦЕНА",
    caption:
      "Объект «РХ»: телекинетический резонанс того же класса, что у Даро. Дождь вокруг него сгибается — приборы консорциума списывают это на турбулентность.",
    accent: "cyan",
  },
  {
    id: "art-scene-perimeter",
    src: asset("/img/scenes/scene-perimeter.webp"),
    title: "База «Периметр Зеро»",
    kind: "СЦЕНА",
    caption:
      "Заброшенная станция под верхними ярусами: серверы на перебоях, украденный щит и люди, которых реестр не считает. Пока горит хотя бы один терминал — учёт ведётся.",
    accent: "cyan",
  },
  {
    id: "art-scene-technodominus",
    src: asset("/img/scenes/scene-technodominus.webp"),
    title: "Шпиль Технодоминуса",
    kind: "СЦЕНА",
    caption:
      "Корпорация, контролирующая сеть, вычисления и небо. Стерильные залы и голограммы вместо грохота: Технодоминус не подавляет — переигрывает.",
    accent: "magenta",
  },
  {
    id: "art-scene-dominator",
    src: asset("/img/scenes/scene-dominator.webp"),
    title: "Проект «Доминатор»",
    kind: "СЦЕНА",
    caption:
      "Орбитальная система Скорпиона, способная подчинить или уничтожить всех. Город сверху виден как схема — потому даже корпорации пересчитывают союзников.",
    accent: "amber",
  },
  {
    id: "art-scene-lab",
    src: asset("/img/scenes/scene-lab.webp"),
    title: "Лаборатория «Синтеза»",
    kind: "СЦЕНА",
    caption:
      "Корпорация продаёт человеку его же тело в рассрочку. Танки с подсветкой — каталог: то, что плавает внутри, ещё числится товаром.",
    accent: "magenta",
  },
  {
    id: "art-scene-conveyor",
    src: asset("/img/scenes/scene-conveyor.webp"),
    title: "Цех утилизации",
    kind: "СЦЕНА",
    caption:
      "Механические руки сортируют то, что город снял с людей. Официально — «оптимизация персонала»: система не считает нужным другое слово.",
    accent: "amber",
  },
  {
    id: "art-scene-skybridge",
    src: asset("/img/scenes/scene-skybridge.webp"),
    title: "Эстакада между ярусами",
    kind: "СЦЕНА",
    caption:
      "Транспортный поток верхних ярусов идёт по расписанию даже в дождь. Пешеходная галерея ниже — для тех, чей тариф не включает небо.",
    accent: "cyan",
  },
  /* — портреты — */
  {
    id: "art-daro",
    src: asset("/img/chars/daro.webp"),
    title: "Николас / Даро",
    kind: "ПОРТРЕТ",
    caption: "«Я не вторая личность. Я — тот, кто остаётся, когда Николас прячется».",
    accent: "cyan",
  },
  {
    id: "art-ohotnik",
    src: asset("/img/chars/ohotnik.webp"),
    title: "Резонансный Охотник",
    kind: "ПОРТРЕТ",
    caption: "«Ты его не дождёшься».",
    accent: "amber",
  },
  {
    id: "art-lina",
    src: asset("/img/chars/lina.webp"),
    title: "Лина",
    kind: "ПОРТРЕТ",
    caption: "«Кто-то должен вести. Лучше я, чем очередь из корпорации».",
    accent: "magenta",
  },
  {
    id: "art-aya",
    src: asset("/img/chars/aya.webp"),
    title: "Айя",
    kind: "ПОРТРЕТ",
    caption: "«Если меня можно любить просто так — покажите инструкции».",
    accent: "cyan",
  },
  {
    id: "art-nemezida",
    src: asset("/img/chars/nemezida.webp"),
    title: "Немезида",
    kind: "ПОРТРЕТ",
    caption: "«Я помню имя Кира. Не помню, чьё оно — моё или то, что мне выдали».",
    accent: "magenta",
  },
  {
    id: "art-jack",
    src: asset("/img/chars/jack.webp"),
    title: "Джек",
    kind: "ПОРТРЕТ",
    caption: "«Он нас спас. Вопрос — чего это стоило ему».",
    accent: "cyan",
  },
  {
    id: "art-raiz",
    src: asset("/img/chars/raiz.webp"),
    title: "Сандерс Райз",
    kind: "ПОРТРЕТ",
    caption: "«Я не ваш союзник. Я враг моего врага. Пока».",
    accent: "magenta",
  },
  {
    id: "art-skorpion",
    src: asset("/img/chars/skorpion.webp"),
    title: "Лорд Скорпион",
    kind: "ПОРТРЕТ",
    caption: "«Люди ломаются. Машины — улучшаются».",
    accent: "amber",
  },
  {
    id: "art-berginator",
    src: asset("/img/chars/berginator.webp"),
    title: "Бергинатор",
    kind: "ПОРТРЕТ",
    caption: "«Это не война. Это плановая операция».",
    accent: "amber",
  },
  {
    id: "art-darkdarus",
    src: asset("/img/chars/darkdarus.webp"),
    title: "Даркдарус",
    kind: "ПОРТРЕТ",
    caption: "«Ты звал меня всю жизнь. Не останавливайся на середине».",
    accent: "magenta",
  },
  /* — обложки — */
  {
    id: "art-tom-1",
    src: asset("/covers/book1.png"),
    title: "Том I · Красный сдвиг",
    kind: "ОБЛОЖКА",
    caption:
      "В Хи-Мигате у всякой силы есть владелец. Телекинез Даро не принадлежит никому — и потому он опаснее любого оружия.",
    accent: "cyan",
  },
  {
    id: "art-tom-2",
    src: asset("/covers/book2.png"),
    title: "Том II · Стеклянные небеса",
    kind: "ОБЛОЖКА",
    caption:
      "Плен на «Авангарде» закончился сделкой, о которой Даро молчит. А молчание в Хи-Мигате дороже слов.",
    accent: "magenta",
  },
  {
    id: "art-tom-3",
    src: asset("/covers/book3.png"),
    title: "Том III · Пепел и неон",
    kind: "ОБЛОЖКА",
    caption:
      "Финальный том — о том, сколько человеческого остаётся в человеке, когда всё остальное отнято.",
    accent: "amber",
  },
];
