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
      description="答えを探す前に、心を整える。恋愛・仕事・人間関係・将来不安の悩みを、AIとの対話で静かに整理するベータ版サービスです。"
    >
      <main className="space-y-6 lg:space-y-8">
        <section className="surface-card overflow-hidden p-6 sm:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div className="space-y-5">
              <BetaBadge />
              <div className="space-y-4">
                <p className="text-sm tracking-[0.24em] text-gold">心を整理するAI相談</p>
                <h2 className="font-serif text-4xl leading-tight text-plum sm:text-5xl">
                  答えを探す前に、
                  <br />
                  心を整える。
                </h2>
                <p className="max-w-2xl text-base leading-8 text-stone">
                  こころの羅針盤は、ソラとのやさしい対話を通じて、
                  恋愛や仕事、人間関係、将来不安などの悩みを静かに見つめ直すためのベータ版サービスです。
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
                <FeedbackButton href={FEEDBACK_FORM_URL} label="ご意見を送る" />
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
  );
}
