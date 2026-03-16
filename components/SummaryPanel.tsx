import { EmotionalStateMeter } from "@/components/EmotionalStateMeter";
import { EmotionalState, ReflectionSummary } from "@/types/consultation";

type SummaryPanelProps = {
  summary: ReflectionSummary | null;
  insight: string;
  futureMessage: string;
  nextQuestion: string;
  emotionalState: EmotionalState | null;
  saveError: string;
  saveSuccess: string;
  onSave: () => void;
  onOpenHistory: () => void;
};

const summaryItems = [
  { key: "topic", label: "テーマ" },
  { key: "emotion", label: "感情" },
  { key: "coreIssue", label: "問題の核" },
  { key: "whatYouNeed", label: "今必要なこと" },
  { key: "soraMessage", label: "ソラからのメッセージ" },
] as const;

export const SummaryPanel = ({
  summary,
  insight,
  futureMessage,
  nextQuestion,
  emotionalState,
  saveError,
  saveSuccess,
  onSave,
  onOpenHistory,
}: SummaryPanelProps) => {
  return (
    <section className="surface-card p-6 sm:p-7">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.24em] text-gold">Step 3</p>
        <h2 className="mt-2 font-serif text-2xl text-plum">心の整理結果</h2>
        <p className="mt-3 text-sm leading-7 text-stone">
          ソラが今の対話をもとに、見えてきた輪郭を静かにまとめます。
        </p>
      </div>

      {summary ? (
        <div className="space-y-3.5">
          {summaryItems.map((item) => (
            <article
              key={item.key}
              className="rounded-[22px] border border-lilac/50 bg-white/88 p-4 sm:p-5"
            >
              <p className="mb-2 text-xs uppercase tracking-[0.22em] text-gold">
                {item.label}
              </p>
              <p className="text-sm leading-7 text-ink">
                {summary[item.key]}
              </p>
            </article>
          ))}

          <article className="rounded-[20px] border border-lilac/40 bg-mist/32 p-4">
            <p className="mb-2 text-xs uppercase tracking-[0.22em] text-gold">
              今日の小さな気づき
            </p>
            <p className="text-sm leading-7 text-ink">{insight}</p>
          </article>

          <article className="rounded-[24px] border border-gold/35 bg-[linear-gradient(180deg,rgba(255,255,255,0.99),rgba(248,244,250,0.92))] p-4 sm:p-5 shadow-soft">
            <p className="mb-2 text-xs uppercase tracking-[0.22em] text-gold">
              未来のあなたからの言葉
            </p>
            <p className="text-sm leading-7 text-ink">{futureMessage}</p>
          </article>

          <article className="rounded-[18px] border border-lilac/30 bg-mist/22 p-4">
            <p className="mb-2 text-xs uppercase tracking-[0.22em] text-gold">
              次の問い
            </p>
            <p className="text-sm leading-7 text-ink">{nextQuestion}</p>
          </article>

          {emotionalState ? (
            <article className="rounded-[18px] border border-lilac/28 bg-mist/18 p-4">
              <p className="mb-3 text-xs uppercase tracking-[0.22em] text-gold">
                心の状態メーター
              </p>
              <EmotionalStateMeter state={emotionalState} compact />
            </article>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={onSave} className="button-primary">
              保存
            </button>
            <button
              type="button"
              onClick={onOpenHistory}
              className="button-secondary"
            >
              履歴を開く
            </button>
          </div>

          {saveError ? (
            <p className="rounded-2xl border border-rose-200 bg-rose-50/90 px-4 py-3 text-sm leading-6 text-rose-700">
              {saveError}
            </p>
          ) : null}
          {saveSuccess ? (
            <p className="rounded-2xl border border-emerald-200 bg-emerald-50/90 px-4 py-3 text-sm leading-6 text-emerald-700">
              {saveSuccess}
            </p>
          ) : null}
        </div>
      ) : (
        <div className="flex min-h-[430px] items-center justify-center rounded-[28px] border border-lilac/55 bg-mist/60 p-6 text-center text-sm leading-7 text-stone/80">
          対話が整うと、ここに「答え」ではなく、
          今の心を見つめるための整理が表示されます。
        </div>
      )}
    </section>
  );
};
