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
    default: "こころの羅針盤 | 心の動きを残す記録アプリ",
    template: "%s | こころの羅針盤",
  },
  description:
    "こころの羅針盤は、出来事ではなく心の動きを少しずつ残していくための静かな記録アプリです。ソラがそっと整理を手伝い、あとから自分の流れを振り返れます。",
  openGraph: {
    title: "こころの羅針盤 | 心の動きを残す記録アプリ",
    description:
      "出来事ではなく心の動きを少しずつ残していくための静かな記録アプリです。ソラがそっと整理を手伝い、あとから自分の流れを振り返れます。",
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
