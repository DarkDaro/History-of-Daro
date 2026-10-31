import type { Metadata, Viewport } from "next";
import { Russo_One, Play, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const displayFont = Russo_One({
  variable: "--font-display",
  subsets: ["cyrillic", "latin"],
  weight: "400",
});

const bodyFont = Play({
  variable: "--font-body",
  subsets: ["cyrillic", "latin"],
  weight: ["400", "700"],
});

const monoFont = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["cyrillic", "latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "История Даро — цикл романов | Киберпанк. Дистопия. Неонуар.",
  description:
    "Официальный сайт литературного цикла «История Даро»: романы в жанре киберпанк-дистопии, боевика и неонуара. Атмосфера Blade Runner и Ghost in the Shell — мегаполис, корпорации, неон и те, кто выживает между ними.",
  keywords: [
    "История Даро",
    "киберпанк",
    "дистопия",
    "неонуар",
    "фантастика",
    "книги",
    "романы",
  ],
  openGraph: {
    title: "История Даро — цикл романов",
    description:
      "Киберпанк-дистопия, боевик, неонуар. Мегаполис Даро ждёт.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#05050a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body
        className={`${displayFont.variable} ${bodyFont.variable} ${monoFont.variable} antialiased bg-[#05050a] text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
