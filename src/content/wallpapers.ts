/* ============================================================
   ИСТОРИЯ ДАРО — стена «Артефакты»: обои на /gallery.
   Часть канона (B3): правь здесь, content.ts — только ре-экспорт.

   Обои собираются из готовых файлов public/ локальным скриптом
   scripts/make-wallpapers.py (без внешних API): сцены —
   рабочий стол 1920×1080 (кроп 16:9), портреты и обложки —
   телефон 1080×1920 (кроп 9:16 по центру, высота полная).
   Результат — public/wallpapers/wp-*.webp.

   galleryId — id записи из gallery.ts: секция сама подтянет
   превью, название и подпись. Новых картинок здесь не хранят —
   только пути к сгенерированным файлам.
   ============================================================ */

export interface Wallpaper {
  /** id записи GALLERY (gallery.ts) — источник превью и названия */
  galleryId: string;
  /** файл обоев под рабочий стол (путь через asset() на рендере) */
  desktop?: string;
  /** файл обоев под телефон (путь через asset() на рендере) */
  phone?: string;
}

/** Разрешения для подписей на кнопках скачивания. */
export const WALLPAPER_SIZES = {
  desktop: "1920 × 1080",
  phone: "1080 × 1920",
} as const;

export const WALLPAPERS: Wallpaper[] = [
  /* — рабочий стол: сцены — */
  { galleryId: "art-city", desktop: "/wallpapers/wp-desktop-city.webp" },
  { galleryId: "art-world", desktop: "/wallpapers/wp-desktop-world.webp" },
  { galleryId: "art-implants", desktop: "/wallpapers/wp-desktop-implants.webp" },
  { galleryId: "art-armory", desktop: "/wallpapers/wp-desktop-armory.webp" },
  { galleryId: "art-story", desktop: "/wallpapers/wp-desktop-story.webp" },
  { galleryId: "art-pobeg", desktop: "/wallpapers/wp-desktop-pobeg.webp" },
  /* — рабочий стол: сцены, батч 4 — */
  { galleryId: "art-scene-kotel", desktop: "/wallpapers/wp-desktop-kotel.webp" },
  { galleryId: "art-scene-cleaners", desktop: "/wallpapers/wp-desktop-cleaners.webp" },
  { galleryId: "art-scene-hunter", desktop: "/wallpapers/wp-desktop-hunter.webp" },
  { galleryId: "art-scene-perimeter", desktop: "/wallpapers/wp-desktop-perimeter.webp" },
  { galleryId: "art-scene-technodominus", desktop: "/wallpapers/wp-desktop-technodominus.webp" },
  { galleryId: "art-scene-dominator", desktop: "/wallpapers/wp-desktop-dominator.webp" },
  { galleryId: "art-scene-lab", desktop: "/wallpapers/wp-desktop-lab.webp" },
  { galleryId: "art-scene-conveyor", desktop: "/wallpapers/wp-desktop-conveyor.webp" },
  { galleryId: "art-scene-skybridge", desktop: "/wallpapers/wp-desktop-skybridge.webp" },
  /* — телефон: портреты — */
  { galleryId: "art-daro", phone: "/wallpapers/wp-phone-daro.webp" },
  { galleryId: "art-ohotnik", phone: "/wallpapers/wp-phone-ohotnik.webp" },
  { galleryId: "art-lina", phone: "/wallpapers/wp-phone-lina.webp" },
  { galleryId: "art-aya", phone: "/wallpapers/wp-phone-aya.webp" },
  { galleryId: "art-nemezida", phone: "/wallpapers/wp-phone-nemezida.webp" },
  { galleryId: "art-jack", phone: "/wallpapers/wp-phone-jack.webp" },
  { galleryId: "art-raiz", phone: "/wallpapers/wp-phone-raiz.webp" },
  { galleryId: "art-skorpion", phone: "/wallpapers/wp-phone-skorpion.webp" },
  { galleryId: "art-berginator", phone: "/wallpapers/wp-phone-berginator.webp" },
  { galleryId: "art-darkdarus", phone: "/wallpapers/wp-phone-darkdarus.webp" },
  /* — телефон: обложки томов — */
  { galleryId: "art-tom-1", phone: "/wallpapers/wp-phone-tom1.webp" },
  { galleryId: "art-tom-2", phone: "/wallpapers/wp-phone-tom2.webp" },
  { galleryId: "art-tom-3", phone: "/wallpapers/wp-phone-tom3.webp" },
];
