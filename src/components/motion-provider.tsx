"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Глобальный режим движения: framer-motion уважает системную настройку
 * «уменьшить анимацию» (prefers-reduced-motion) на ВСЕХ страницах —
 * transform/layout-анимации отключаются, opacity сохраняется.
 * Раньше useReducedMotion был подключён точечно, в одном файле.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
