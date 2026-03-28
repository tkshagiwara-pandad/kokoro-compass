"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FeedbackButton } from "@/components/FeedbackButton";
import { HistoryPanel } from "@/components/HistoryPanel";
import { LayoutShell } from "@/components/LayoutShell";
import { TrendPanel } from "@/components/TrendPanel";
import { FEEDBACK_FORM_URL } from "@/lib/config";
import { loadHistory, saveHistory, setActiveRecordId } from "@/lib/storage";
import { ConsultationRecord } from "@/types/consultation";

export const LogExperience = () => {
  const router = useRouter();
  const [history, setHistory] = useState<ConsultationRecord[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  const handleSelect = (record: ConsultationRecord) => {
    setActiveRecordId(record.id);
    router.push("/consultation");
  };

  const handleDelete = (id: string) => {
    try {
      saveHistory(history.filter((record) => record.id !== id));
      setHistory(loadHistory());
      setError("");
    } catch {
      setError("記録の更新に失敗しました。ブラウザの設定を確認してください。");
    }
  };

  return (
    <LayoutShell
      eyebrow="Mind Map"
      title="心の地図"
      description="残してきた言葉を、あとから静かにたどれます。"
      backLink={{ href: "/consultation", label: "記録画面へ戻る" }}
    >
      <main className="space-y-6 lg:space-y-7">
        <section className="rounded-[20px] border border-lilac/24 bg-white/52 px-5 py-4">
          <p className="text-[10px] uppercase tracking-[0.16em] text-plum/56">残してきた言葉</p>
          <p className="mt-2 font-serif text-2xl text-plum">{history.length}件</p>
        </section>

        <TrendPanel records={history} />

        <HistoryPanel
          records={history}
          onSelect={handleSelect}
          onDelete={handleDelete}
          visibleCount={history.length}
          selectLabel="この記録を開く"
        />

        {error ? (
          <p className="rounded-2xl border border-rose-200 bg-rose-50/90 px-4 py-3 text-sm leading-6 text-rose-700">
            {error}
          </p>
        ) : null}

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-[20px] border border-lilac/24 bg-white/56 px-5 py-4">
          <div className="space-y-2">
            <p className="text-sm leading-7 text-stone/82">
              残した言葉はこの端末の `localStorage` に保存されています。必要に応じて記録画面へ戻り、続きを書き足せます。
            </p>
            <p className="text-sm leading-7 text-stone/76">
              今日の体験はいかがでしたか？30秒で終わります。
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/consultation" className="text-sm text-stone/78 transition hover:text-plum">
              今日の言葉を残す
            </Link>
            <FeedbackButton
              href={FEEDBACK_FORM_URL}
              label="フィードバック"
              className="inline-flex items-center justify-center rounded-full border border-lilac/40 bg-white/72 px-4 py-2.5 text-sm text-stone transition hover:border-iris/45 hover:text-plum"
            />
          </div>
        </div>

        <p className="text-center text-sm leading-7 text-stone/78">
          また必要なときに、
          <br />
          ここへ戻ってきてください。
        </p>
      </main>
    </LayoutShell>
  );
};
