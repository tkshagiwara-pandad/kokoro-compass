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
      <main className="space-y-5 lg:space-y-6">
        <section className="rounded-[18px] border border-lilac/16 bg-white/44 px-5 py-4">
          <p className="text-[10px] uppercase tracking-[0.14em] text-plum/54">残してきた言葉</p>
          <p className="mt-2 text-sm leading-7 text-stone/78">
            {history.length > 0
              ? `いまは ${history.length} つの言葉が、ここに静かに残っています。`
              : "まだ残っている言葉はありません。"}
          </p>
        </section>

        <TrendPanel records={history} />

        <HistoryPanel
          records={history}
          onSelect={handleSelect}
          onDelete={handleDelete}
          visibleCount={history.length}
          selectLabel="読み直す"
        />

        {error ? (
          <p className="rounded-2xl border border-rose-200 bg-rose-50/90 px-4 py-3 text-sm leading-6 text-rose-700">
            {error}
          </p>
        ) : null}

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-[18px] border border-lilac/16 bg-white/48 px-5 py-4">
          <div className="space-y-2">
            <p className="text-sm leading-7 text-stone/78">
              残した言葉は、この端末に静かに残ります。
            </p>
            <p className="text-sm leading-7 text-stone/70">
              気になることがあれば、短くても大丈夫です。
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/consultation" className="text-sm text-stone/78 transition hover:text-plum">
              今日の言葉を残す
            </Link>
            <FeedbackButton
              href={FEEDBACK_FORM_URL}
              label="フィードバック"
              className="text-sm text-stone/72 transition hover:text-plum"
            />
          </div>
        </div>

        <p className="text-center text-sm leading-7 text-stone/68">
          また必要なときに、
          <br />
          ここへ戻ってきてください。
        </p>
      </main>
    </LayoutShell>
  );
};
