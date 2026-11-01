/* ============================================================
   ИСТОРИЯ ДАРО — канон вселенной: точка входа.
   Город — ХИ-МИГАТА. Даро — человек, которого нет в реестрах,
   но который числится на балансе. 2147 год · семь корпораций ·
   сопротивление «Периметр Зеро».
   Стиль текстов: деталь вместо объяснения, цена вместо лозунга.

   С 2026-11-02 (B3 ROADMAP) канон разбит на модули src/content/*.ts —
   этот файл остался ре-экспортом, чтобы все импорты по сайту
   (`@/lib/content`) работали как раньше. Правь контент в модулях —
   карта модулей в AUTHOR-GUIDE.md.
   ============================================================ */

export * from "@/content/shared";
export * from "@/content/books";
export * from "@/content/characters";
export * from "@/content/corporations";
export * from "@/content/dossier";
export * from "@/content/world";
export * from "@/content/implants";
export * from "@/content/weapons";
export * from "@/content/weapon-specs";
export * from "@/content/chronicles";
export * from "@/content/timeline";
export * from "@/content/story";
export * from "@/content/synopsis";
export * from "@/content/excerpts";
export * from "@/content/gallery";
