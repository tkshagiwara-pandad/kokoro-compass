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
      description="気持ちを言葉にして、少し整理して、あとから振り返るための場所です。人に話すほどではないけれど残しておきたい心の動きを、ソラと静かにたどれます。"
    >
      <main className="space-y-7 lg:space-y-9">
        <section className="surface-card overflow-hidden p-6 sm:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div className="space-y-5">
              <BetaBadge />
              <div className="space-y-4">
                <p className="text-sm tracking-[0.24em] text-gold">心の動きを残す場所</p>
                <h2 className="font-serif text-4xl leading-tight text-plum sm:text-5xl">
                  答えをくれるものではなく
                  <br />
                  心の動きを残していくための場所
                </h2>
                <p className="max-w-2xl text-base leading-8 text-stone">
                  こころの羅針盤は、
                  出来事ではなく、心の動きを少しずつ書き留めていくための日記アプリです。
                  まだ整理されていない気持ちも、ソラがそっと言葉の輪郭を整えます。
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/consultation"
                  className="button-primary"
                  onClick={() => trackEvent("lp_cta_clicked", { destination: "/consultation" })}
                >
                  記録を始めてみる
                </Link>
                <FeedbackButton
                  href={FEEDBACK_FORM_URL}
                  label="ご意見を送る"
                  className="inline-flex items-center justify-center rounded-full border border-lilac/40 bg-white/72 px-4 py-2.5 text-sm text-stone transition hover:border-iris/45 hover:text-plum"
                />
              </div>
              <p className="text-sm leading-7 text-stone">
                残した言葉を振り返りたいときは
                <Link href="/log" className="ml-2 text-plum transition hover:text-ink">
                  心の地図
                </Link>
                から最近の気づきをたどれます。
              </p>
            </div>

            <div className="soft-panel p-5 sm:p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-gold">心に残りやすいきっかけ</p>
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
            <h3 className="mt-3 font-serif text-2xl text-plum">気持ちを残す</h3>
            <p className="mt-3 text-sm leading-7 text-stone">
              まとまっていないままで大丈夫です。いま心に残っていることを、そのまま書き始められます。
            </p>
          </article>
          <article className="surface-card p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-gold">2</p>
            <h3 className="mt-3 font-serif text-2xl text-plum">少しだけ整理する</h3>
            <p className="mt-3 text-sm leading-7 text-stone">
              ソラは答えを押しつけず、やわらかな問いで心の動きに少しだけ輪郭を与えます。
            </p>
          </article>
          <article className="surface-card p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-gold">3</p>
            <h3 className="mt-3 font-serif text-2xl text-plum">あとから振り返る</h3>
            <p className="mt-3 text-sm leading-7 text-stone">
              その日の気づきや、くり返し残りやすいテーマを見返しながら、自分の流れを静かにたどれます。
            </p>
          </article>
        </section>

        <NoticePanel />
      </main>
    </LayoutShell>
  );
}
