"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { sfx } from "@/lib/sfx";

/* ============================================================
   Действия на странице /support: копирование адреса сайта
   (бесплатный канал «Рассказать о цикле») и крипто-адресов
   (заготовки в src/content/support.ts). Клиентский — нужен
   clipboard и sfx; стилистика — как CopyLinkButton.
   ============================================================ */

export function CopySupportButton({
  value,
  label,
  doneLabel = "Скопировано",
  className = "",
  disabled = false,
}: {
  value: string;
  label: string;
  doneLabel?: string;
  className?: string;
  disabled?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    if (disabled) return;
    try {
      await navigator.clipboard.writeText(value);
      sfx("confirm");
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      sfx("deny");
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      disabled={disabled}
      aria-label={disabled ? `Канал в настройке: ${label}` : label}
      className={`group flex items-center justify-between gap-3 border px-4 py-3 font-mono-cyber text-[10px] uppercase tracking-[0.25em] transition-colors ${
        disabled
          ? "cursor-not-allowed border-white/10 bg-transparent text-white/30"
          : "border-white/15 bg-black/40 text-white/70 hover:border-[var(--neon-cyan)]/60 hover:text-[var(--neon-cyan)]"
      } ${className}`}
    >
      <span className="flex items-center gap-2">
        {disabled ? null : copied ? (
          <Check className="h-3.5 w-3.5 text-[var(--neon-cyan)]" aria-hidden />
        ) : (
          <Copy className="h-3.5 w-3.5" aria-hidden />
        )}
        {disabled ? "Канал в настройке" : copied ? doneLabel : label}
      </span>
      <span className="text-white/25 transition-colors group-hover:text-[var(--neon-cyan)]/50" aria-hidden>
        {"//"}
      </span>
    </button>
  );
}
