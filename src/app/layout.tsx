import type { Metadata, Viewport } from "next";
import { Russo_One, Play, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
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
  title: `${SITE_NAME} — цикл романов | Киберпанк. Дистопия. Неонуар.`,
  description: SITE_DESCRIPTION,
  keywords: [
    "История Даро",
    "киберпанк",
    "дистопия",
    "неонуар",
    "фантастика",
    "книги",
    "романы",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `${SITE_NAME} — цикл романов`,
    description:
      "Киберпанк-дистопия, боевик, неонуар. Мегаполис Даро ждёт.",
    type: "website",
    locale: "ru_RU",
    siteName: SITE_NAME,
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — цикл романов`,
    description:
      "Киберпанк-дистопия, боевик, неонуар. Мегаполис Даро ждёт.",
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
        className={`${displayFont.variable} ${bodyFont.variable} ${monoFont.variable} antialiased bg-[#05050a] text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
