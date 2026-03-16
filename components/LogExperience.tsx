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
      setError("履歴の更新に失敗しました。ブラウザの設定を確認してください。");
    }
  };

  return (
    <LayoutShell
      eyebrow="My Log"
      title="マイログ"
      description="これまでの相談を静かに見返しながら、最近よく現れるテーマや気づきの流れをたどるためのページです。"
      backLink={{ href: "/consultation", label: "相談画面へ戻る" }}
    >
      <main className="space-y-6 lg:space-y-7">
        <TrendPanel records={history} />

        <HistoryPanel
          records={history}
          onSelect={handleSelect}
          onDelete={handleDelete}
          visibleCount={history.length}
          selectLabel="相談画面で開く"
        />

        {error ? (
          <p className="rounded-2xl border border-rose-200 bg-rose-50/90 px-4 py-3 text-sm leading-6 text-rose-700">
            {error}
          </p>
        ) : null}

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-[24px] border border-lilac/38 bg-white/68 px-5 py-4 shadow-soft">
          <p className="text-sm leading-7 text-stone">
            ログはこの端末の `localStorage` に保存されています。必要に応じて相談画面へ戻り、続きを整理できます。
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/consultation" className="button-secondary">
              相談画面へ戻る
            </Link>
            <FeedbackButton
              href={FEEDBACK_FORM_URL}
              label="使ってみた感想を送る"
              className="inline-flex items-center justify-center rounded-full border border-lilac/40 bg-white/72 px-4 py-2.5 text-sm text-stone transition hover:border-iris/45 hover:text-plum"
            />
          </div>
        </div>
      </main>
    </LayoutShell>
  );
};
