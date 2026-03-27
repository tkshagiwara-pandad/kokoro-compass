import { EmotionalStateMeter } from "@/components/EmotionalStateMeter";
import { EmotionalState, ReflectionSummary } from "@/types/consultation";

type SummaryPanelProps = {
  summary: ReflectionSummary | null;
  userInput: string;
  insight: string;
  futureMessage: string;
  nextQuestion: string;
  emotionalState: EmotionalState | null;
  savedPreview: string;
  savedAtLabel: string;
  saveError: string;
  saveSuccess: string;
  isSaved: boolean;
  onSave: () => void;
  onOpenHistory: () => void;
  onContinueThinking: () => void;
  onRestart: () => void;
  soraClosingLine: string;
};

export const SummaryPanel = ({
  summary,
  userInput,
  insight,
  futureMessage,
  nextQuestion,
  emotionalState,
  savedPreview,
  savedAtLabel,
  saveError,
  saveSuccess,
  isSaved,
  onSave,
  onOpenHistory,
  onContinueThinking,
  onRestart,
  soraClosingLine,
}: SummaryPanelProps) => {
  return (
    <section className="surface-card p-6 sm:p-7">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.24em] text-gold">Step 3</p>
        <h2 className="mt-2 font-serif text-2xl text-plum">今日の記録</h2>
        <p className="mt-3 text-sm leading-7 text-stone">
          その日の言葉を、あとから静かに読み直せるようにしています。
        </p>
      </div>

      {summary ? (
        <div className="space-y-4.5">
          <article className="rounded-[24px] border border-lilac/45 bg-white/92 p-5 shadow-soft">
            <p className="mb-2 text-xs uppercase tracking-[0.22em] text-gold">
              そのときに残した言葉
            </p>
            <p className="text-[15px] leading-8 text-ink sm:text-base">
              {userInput}
            </p>
          </article>

          <article className="rounded-[20px] border border-lilac/30 bg-mist/16 p-4 sm:p-5">
            <p className="mb-2 text-xs uppercase tracking-[0.22em] text-gold">
              そのときの問い
            </p>
            <p className="text-[15px] leading-7 text-ink/88 sm:leading-8">{nextQuestion}</p>
          </article>

          <article className="rounded-[20px] border border-lilac/28 bg-white/84 p-4 sm:p-5">
            <p className="mb-2 text-xs uppercase tracking-[0.2em] text-gold">
              ソラが返していた言葉
            </p>
            <p className="text-[15px] leading-7 text-ink/86 sm:leading-8">{summary.soraMessage}</p>
          </article>

          <article className="rounded-[18px] border border-lilac/24 bg-mist/14 p-4 sm:p-5">
            <p className="mb-3 text-xs uppercase tracking-[0.22em] text-gold">
              このときのメモ
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-plum/60">テーマ</p>
                <p className="mt-1 text-sm leading-7 text-ink/84">{summary.topic}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-plum/60">感情</p>
                <p className="mt-1 text-sm leading-7 text-ink/84">{summary.emotion}</p>
              </div>
            </div>
          </article>

          <article className="rounded-[18px] border border-lilac/24 bg-white/82 p-4">
            <p className="mb-2 text-xs uppercase tracking-[0.22em] text-gold">
              今日の小さな気づき
            </p>
            <p className="text-[15px] leading-7 text-ink sm:leading-8">{insight}</p>
          </article>

          {futureMessage ? (
            <article className="rounded-[18px] border border-gold/26 bg-[linear-gradient(180deg,rgba(255,255,255,1),rgba(248,244,250,0.78))] p-4 sm:p-5">
              <p className="mb-2 text-xs uppercase tracking-[0.2em] text-gold">
                あとから残った言葉
              </p>
              <p className="text-[15px] leading-7 text-ink sm:leading-8">{futureMessage}</p>
            </article>
          ) : null}

          {emotionalState ? (
            <article className="rounded-[18px] border border-lilac/18 bg-mist/10 p-4">
              <p className="mb-3 text-xs uppercase tracking-[0.22em] text-gold">
                このときの心の動き
              </p>
              <EmotionalStateMeter state={emotionalState} compact />
            </article>
          ) : null}

          {isSaved ? (
            <article className="rounded-[18px] border border-lilac/24 bg-mist/12 p-4">
              <p className="mb-2 text-xs uppercase tracking-[0.22em] text-gold">
                今日の言葉を残しました
              </p>
              <p className="text-sm leading-7 text-stone">
                言葉になりきらないままでも、ここに置いておけます。
              </p>
              {savedPreview ? (
                <div className="mt-4 rounded-[16px] border border-lilac/18 bg-white/72 px-4 py-3">
                  <p className="text-sm leading-7 text-ink/84 line-clamp-2">{savedPreview}</p>
                </div>
              ) : null}
              {savedAtLabel ? (
                <p className="mt-3 text-xs leading-6 text-stone/68">{savedAtLabel}</p>
              ) : null}
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={onOpenHistory}
                  className="button-primary touch-manipulation"
                >
                  心の地図を見る
                </button>
                <button
                  type="button"
                  onClick={onRestart}
                  className="button-secondary touch-manipulation"
                >
                  もうひとつ残す
                </button>
              </div>
            </article>
          ) : (
            <article className="rounded-[18px] border border-lilac/24 bg-mist/12 p-4">
              <p className="mb-2 text-xs uppercase tracking-[0.22em] text-gold">
                今日はここまでにしますか？
              </p>
              <p className="text-sm leading-7 text-stone">
                ここまでで少し整理できたら、記録として残して終えても大丈夫です。
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <button type="button" onClick={onSave} className="button-primary touch-manipulation">
                  今日の記録を残す
                </button>
                <button
                  type="button"
                  onClick={onContinueThinking}
                  className="button-secondary touch-manipulation"
                >
                  もう少し書く
                </button>
                <button
                  type="button"
                  onClick={onOpenHistory}
                  className="button-secondary touch-manipulation"
                >
                  心の地図を見る
                </button>
              </div>
            </article>
          )}

          <article className="rounded-[18px] border border-lilac/24 bg-white/84 px-4 py-4">
            <div className="flex items-center gap-2">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-lilac/70" aria-hidden="true" />
              <p className="text-[11px] uppercase tracking-[0.2em] text-plum/62">
                ソラより
              </p>
            </div>
            <p className="mt-2 text-sm leading-7 text-ink/88">{soraClosingLine}</p>
          </article>

          {saveError ? (
            <p className="rounded-2xl border border-rose-200 bg-rose-50/90 px-4 py-3 text-sm leading-6 text-rose-700">
              {saveError}
            </p>
          ) : null}
          {saveSuccess && !isSaved ? (
            <p className="rounded-2xl border border-emerald-200 bg-emerald-50/90 px-4 py-3 text-sm leading-6 text-emerald-700">
              {saveSuccess}
            </p>
          ) : null}
        </div>
      ) : (
        <div className="flex min-h-[430px] items-center justify-center rounded-[28px] border border-lilac/55 bg-mist/60 p-6 text-center text-sm leading-7 text-stone/80">
          記録が整うと、ここに「答え」ではなく、
          今の心を見つめるための整理が表示されます。
        </div>
      )}
    </section>
  );
};
