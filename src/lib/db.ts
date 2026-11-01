/**
 * ⛔ ОТКЛЮЧЕНО 2026-11-01 — см. PROJECT-META.md, раздел «Журнал отключений».
 *
 * ЧТО ЭТО: шаблонный Prisma-клиент из стартового скаффолда (каркас запуска).
 * Проверка по всему src/ показала: НИ ОДИН модуль проекта не импортирует
 * этот файл (поиск «lib/db» — 0 совпадений). Настоящая «база данных» сайта —
 * это src/lib/content.ts: типизированные данные трилогии. Серверной БД сайт
 * не использует: на GitHub Pages отдаётся статика.
 *
 * ПОЧЕМУ ОТКЛЮЧЁН, А НЕ УДАЛЁН: мёртвый код выглядел как «сломанный бекенд»
 * и сбивал с толку. По принципу хозяина проекта мусор не вычищаем —
 * отключаем точечно, с объяснением и путём возврата.
 *
 * КАК ВЕРНУТЬ (если сайт переедет на сервер с Node и появится настоящая БД):
 *   1) раскомментировать код ниже;
 *   2) убедиться, что зависимость установлена: npm i @prisma/client;
 *   3) убедиться, что есть prisma/schema.prisma и сгенерирован клиент
 *      (npx prisma generate);
 *   4) подключить в коде: import { db } from '@/lib/db'.
 *
 * import { PrismaClient } from '@prisma/client'
 *
 * const globalForPrisma = globalThis as unknown as {
 *   prisma: PrismaClient | undefined
 * }
 *
 * export const db =
 *   globalForPrisma.prisma ??
 *   new PrismaClient({
 *     log: ['query'],
 *   })
 *
 * if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
 */
