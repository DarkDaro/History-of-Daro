import type { Metadata, Viewport } from "next";
import { Russo_One, Play, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { SiteNav, SiteFooter } from "@/components/site-chrome";
import { AtmosphereFX } from "@/components/cyber";
import { MotionProvider } from "@/components/motion-provider";
import { ScrollTopButton } from "@/components/scroll-top";
import { JsonLd } from "@/components/seo";
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
  icons: {
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: `${SITE_NAME} — цикл романов`,
    description:
      "Хи-Мигата, 2147 год: воздух и память продаются, а человек по имени Даро числится на балансе семи корпораций — и вышел из него.",
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
      "Хи-Мигата, 2147 год: воздух и память продаются, а человек по имени Даро числится на балансе семи корпораций — и вышел из него.",
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
        {/* a11y: переход к содержанию с клавиатуры (виден при фокусе) */}
        <a href="#main-content" className="skip-link">
          Перейти к содержанию
        </a>

        {/* глобальные атмосферные эффекты — на всех страницах */}
        <div className="noise-overlay" aria-hidden />
        <div className="vignette" aria-hidden />
        <AtmosphereFX />

        {/* Schema.org: сайт цикла */}
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: `${SITE_NAME} — цикл романов`,
            url: SITE_URL,
            description: SITE_DESCRIPTION,
            inLanguage: "ru-RU",
          }}
        />

        <SiteNav />
        <div id="main-content" className="contents">
          <MotionProvider>{children}</MotionProvider>
        </div>
        <SiteFooter />
        <ScrollTopButton />
        <Toaster />
      </body>
    </html>
  );
}
