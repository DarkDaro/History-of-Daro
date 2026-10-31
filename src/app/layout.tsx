import type { Metadata, Viewport } from "next";
import { Russo_One, Play, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { SiteNav, SiteFooter } from "@/components/site-chrome";
import { AtmosphereFX } from "@/components/cyber";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/site";

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
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — цикл романов | Антиутопия. Боевик. Неонуар.`,
    template: `%s — ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "История Даро",
    "антиутопия",
    "постапокалипсис",
    "киберпанк",
    "неонуар",
    "фантастика",
    "книги",
    "романы",
    "Хи-Мигата",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `${SITE_NAME} — цикл романов`,
    description:
      "Антиутопия с элементами постапокалипсиса. Город Хи-Мигата, семь корпораций и мятежный антигерой Даро. 2147 год.",
    type: "website",
    locale: "ru_RU",
    siteName: SITE_NAME,
    url: SITE_URL,
    images: [
      {
        // Относительный путь: Next.js соберёт абсолютный URL из metadataBase
        // (SITE_URL), а в CI он уже включает basePath project-сайта.
        url: "/covers/hero-city.png",
        width: 1344,
        height: 768,
        alt: "Хи-Мигата — ночной неоновый мегаполис из цикла «История Даро»",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — цикл романов`,
    description:
      "Антиутопия с элементами постапокалипсиса. Город Хи-Мигата, семь корпораций и мятежный антигерой Даро. 2147 год.",
    images: ["/covers/hero-city.png"],
  },
  robots: {
    index: true,
    follow: true,
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
        className={`${displayFont.variable} ${bodyFont.variable} ${monoFont.variable} antialiased flex min-h-screen flex-col bg-[#05050a] text-foreground`}
      >
        {/* глобальные атмосферные эффекты — на всех страницах */}
        <div className="noise-overlay" aria-hidden />
        <div className="vignette" aria-hidden />
        <AtmosphereFX />

        <SiteNav />
        {children}
        <SiteFooter />
        <Toaster />
      </body>
    </html>
  );
}
