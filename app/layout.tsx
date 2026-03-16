import type { Metadata } from "next";
import "./globals.css";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "こころの羅針盤 | 心を整理するAI相談",
    template: "%s | こころの羅針盤",
  },
  description:
    "こころの羅針盤は、恋愛・仕事・人間関係などの悩みをAIとの対話で整理する、心を整えるための相談サービスです。",
  openGraph: {
    title: "こころの羅針盤 | 心を整理するAI相談",
    description:
      "恋愛・仕事・人間関係などの悩みをAIとの対話で整理する、心を整えるための相談サービスです。",
    locale: "ja_JP",
    type: "website",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "こころの羅針盤",
      },
    ],
  },
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
