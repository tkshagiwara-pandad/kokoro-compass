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
        <h2 className="font-serif text-2xl text-plum">今日の記録</h2>
        <p className="mt-2 text-sm leading-7 text-stone/82">
          その日の言葉を、あとから静かに読み直せるようにしています。
        </p>
      </div>

      {summary ? (
        <div className="space-y-5">
          <article className="rounded-[20px] border border-lilac/24 bg-white/76 p-5">
            <p className="mb-2 text-[10px] uppercase tracking-[0.16em] text-plum/56">
              そのときに残した言葉
            </p>
            <p className="text-[15px] leading-8 text-ink/88 sm:text-base">
              {userInput}
            </p>
          </article>

          <article className="rounded-[18px] border border-lilac/20 bg-white/52 p-4 sm:p-5">
            <p className="mb-2 text-[10px] uppercase tracking-[0.16em] text-plum/54">
              そのときの問い
            </p>
            <p className="text-[15px] leading-7 text-ink/78 sm:leading-8">{nextQuestion}</p>
          </article>

          <article className="rounded-[18px] border border-lilac/18 bg-white/48 p-4 sm:p-5">
            <p className="mb-2 text-[10px] uppercase tracking-[0.16em] text-plum/52">
              ソラが返していた言葉
            </p>
            <p className="text-[15px] leading-7 text-ink/74 sm:leading-8">{summary.soraMessage}</p>
          </article>

          <article className="rounded-[18px] border border-lilac/18 bg-white/46 p-4 sm:p-5">
            <p className="mb-3 text-[10px] uppercase tracking-[0.16em] text-plum/54">
              このときのメモ
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-[10px] uppercase tracking-[0.14em] text-plum/50">テーマ</p>
                <p className="mt-1 text-sm leading-7 text-ink/76">{summary.topic}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.14em] text-plum/50">感情</p>
                <p className="mt-1 text-sm leading-7 text-ink/76">{summary.emotion}</p>
              </div>
            </div>
          </article>

          <article className="rounded-[18px] border border-lilac/18 bg-white/54 p-4">
            <p className="mb-2 text-[10px] uppercase tracking-[0.16em] text-plum/54">
              今日の小さな気づき
            </p>
            <p className="text-[15px] leading-7 text-ink/78 sm:leading-8">{insight}</p>
          </article>

          {futureMessage ? (
            <article className="rounded-[18px] border border-lilac/16 bg-white/44 p-4 sm:p-5">
              <p className="mb-2 text-[10px] uppercase tracking-[0.16em] text-plum/52">
                あとから残った言葉
              </p>
              <p className="text-[15px] leading-7 text-ink/74 sm:leading-8">{futureMessage}</p>
            </article>
          ) : null}

          {emotionalState ? (
            <article className="rounded-[18px] border border-lilac/14 bg-white/42 p-4">
              <p className="mb-3 text-[10px] uppercase tracking-[0.16em] text-plum/50">
                このときの心の動き
              </p>
              <EmotionalStateMeter state={emotionalState} compact />
            </article>
          ) : null}

          {isSaved ? (
            <article className="rounded-[18px] border border-lilac/18 bg-white/68 p-4 sm:p-5">
              {savedPreview ? (
                <div className="rounded-[16px] border border-lilac/14 bg-white/74 px-4 py-3">
                  <p className="text-[15px] leading-7 text-ink/84 line-clamp-2">{savedPreview}</p>
                </div>
              ) : null}
              <p className="mt-4 text-[11px] uppercase tracking-[0.18em] text-plum/58">
                今日の言葉を残しました
              </p>
              <p className="mt-1 text-sm leading-7 text-stone/78">
                言葉になりきらないままでも、ここに置いておけます。
              </p>
              {savedAtLabel ? (
                <p className="mt-2 text-xs leading-6 text-stone/60">{savedAtLabel}</p>
              ) : null}
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={onRestart}
                  className="button-primary touch-manipulation opacity-95"
                >
                  もうひとつ残す
                </button>
                <button
                  type="button"
                  onClick={onOpenHistory}
                  className="touch-manipulation text-sm text-stone/78 transition hover:text-plum"
                >
                  心の地図を見る
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
