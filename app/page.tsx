<<<<<<< HEAD
"use client";

import Link from "next/link";
import { useEffect } from "react";
import { BetaBadge } from "@/components/BetaBadge";
import { FeedbackButton } from "@/components/FeedbackButton";
import { LayoutShell } from "@/components/LayoutShell";
import { NoticePanel } from "@/components/NoticePanel";
import { trackEvent } from "@/lib/analytics";
import { FEEDBACK_FORM_URL } from "@/lib/config";

const themes = ["恋愛", "仕事", "人間関係", "将来不安", "なんとなく不安"] as const;

export default function LandingPage() {
  useEffect(() => {
    trackEvent("lp_viewed", { page: "/" });
  }, []);

  return (
    <LayoutShell
      eyebrow="Kokoro Compass"
      title="こころの羅針盤"
      description="答えをくれるAIではなく、答えに近づくためのAI。恋愛・仕事・人間関係・将来不安の悩みを、AIとの対話で静かに整理するベータ版サービスです。"
    >
      <main className="space-y-7 lg:space-y-9">
        <section className="surface-card overflow-hidden p-6 sm:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div className="space-y-5">
              <BetaBadge />
              <div className="space-y-4">
                <p className="text-sm tracking-[0.24em] text-gold">心を整理するAI相談</p>
                <h2 className="font-serif text-4xl leading-tight text-plum sm:text-5xl">
                  答えをくれるAIではなく
                  <br />
                  答えに近づくためのAI
                </h2>
                <p className="max-w-2xl text-base leading-8 text-stone">
                  こころの羅針盤は、ソラとのやさしい対話を通じて、
                  恋愛や仕事、人間関係、将来不安などの悩みを静かに見つめ直し、
                  自分の言葉で少しずつ整理していくためのベータ版サービスです。
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/consultation"
                  className="button-primary"
                  onClick={() => trackEvent("lp_cta_clicked", { destination: "/consultation" })}
                >
                  無料で試してみる
                </Link>
                <FeedbackButton
                  href={FEEDBACK_FORM_URL}
                  label="ご意見を送る"
                  className="inline-flex items-center justify-center rounded-full border border-lilac/40 bg-white/72 px-4 py-2.5 text-sm text-stone transition hover:border-iris/45 hover:text-plum"
                />
              </div>
              <p className="text-sm leading-7 text-stone">
                相談を続けて見返したいときは
                <Link href="/log" className="ml-2 text-plum transition hover:text-ink">
                  マイログ
                </Link>
                から最近の気づきをたどれます。
              </p>
            </div>

            <div className="soft-panel p-5 sm:p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-gold">相談テーマ</p>
              <div className="mt-4 grid gap-3">
                {themes.map((theme) => (
                  <div
                    key={theme}
                    className="rounded-2xl border border-lilac/60 bg-white/75 px-4 py-3 text-sm text-ink shadow-soft"
                  >
                    {theme}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <article className="surface-card p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-gold">1</p>
            <h3 className="mt-3 font-serif text-2xl text-plum">悩みを書く</h3>
            <p className="mt-3 text-sm leading-7 text-stone">
              まとまっていない気持ちのままでも大丈夫です。いま心にあることを、そのまま書き始められます。
            </p>
          </article>
          <article className="surface-card p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-gold">2</p>
            <h3 className="mt-3 font-serif text-2xl text-plum">ソラと対話する</h3>
            <p className="mt-3 text-sm leading-7 text-stone">
              ソラは答えを押しつけず、やわらかな問いかけで感情や迷いの輪郭を一緒に整えていきます。
            </p>
          </article>
          <article className="surface-card p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-gold">3</p>
            <h3 className="mt-3 font-serif text-2xl text-plum">整理を持ち帰る</h3>
            <p className="mt-3 text-sm leading-7 text-stone">
              テーマ、感情、問題の核、今必要なことを見返しながら、自分の心の位置を静かに確認できます。
            </p>
          </article>
        </section>

        <NoticePanel />
      </main>
    </LayoutShell>
=======
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            To get started, edit the page.tsx file.
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Looking for a starting point or more instructions? Head over to{" "}
            <a
              href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Templates
            </a>{" "}
            or the{" "}
            <a
              href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Learning
            </a>{" "}
            center.
          </p>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <a
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={16}
              height={16}
            />
            Deploy Now
          </a>
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>
      </main>
    </div>
>>>>>>> a1d476d (Initial commit from Create Next App)
  );
}
