import { consultationTopics, ConsultationTopic } from "@/types/consultation";

type ConsultationFormProps = {
  topic: ConsultationTopic;
  input: string;
  error: string;
  onTopicChange: (value: ConsultationTopic) => void;
  onInputChange: (value: string) => void;
  onStart: () => void;
  onReset: () => void;
  started: boolean;
  isStartEnabled: boolean;
  isLoading: boolean;
};

export const ConsultationForm = ({
  topic,
  input,
  error,
  onTopicChange,
  onInputChange,
  onStart,
  onReset,
  started,
  isStartEnabled,
  isLoading,
}: ConsultationFormProps) => {
  return (
    <section className="surface-card border-iris/32 bg-white/78 p-6 shadow-[0_22px_52px_rgba(104,88,120,0.1)] sm:p-7 lg:p-8">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.24em] text-gold">Step 1</p>
        <h2 className="mt-2 font-serif text-2xl text-plum">相談入力</h2>
        <p className="mt-3 text-sm leading-7 text-stone">
          まずはここから、今の気持ちをそのままの言葉で書いてみてください。うまくまとまっていなくても大丈夫です。
        </p>
      </div>

      <div className="space-y-5">
        <div className="rounded-[24px] border border-lilac/45 bg-white/76 p-4 sm:p-5">
          <span className="mb-3 block text-sm text-ink/80">相談テーマ</span>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {consultationTopics.map((option) => {
              const isSelected = option === topic;

              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => onTopicChange(option)}
                  disabled={isLoading}
                  className={`min-h-[54px] rounded-[18px] border px-4 py-3 text-sm transition ${
                    isSelected
                      ? "border-iris/70 bg-lilac/40 text-plum shadow-soft"
                      : "border-lilac/60 bg-white/92 text-stone hover:border-iris/60 hover:bg-mist"
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>

        <label className="block">
          <span className="mb-2 block text-sm text-ink/80">相談内容</span>
          <div className="mb-3 rounded-[22px] border border-iris/34 bg-white/82 px-4 py-3.5 shadow-[0_10px_24px_rgba(137,119,154,0.05)] sm:px-5">
            <p className="text-sm leading-7 text-stone">
              うまく書こうとしなくて大丈夫です。今いちばん心に引っかかっていることを、ひとことだけでも置いてみてください。
            </p>
            <p className="mt-2 text-xs leading-6 text-stone/78">
              例: 「最近仕事で少し疲れています」 「将来のことがなんとなく不安です」
              「人間関係で気になることがあります」
            </p>
          </div>
          <textarea
            value={input}
            onChange={(event) => onInputChange(event.target.value)}
            rows={12}
            placeholder="今いちばん心に引っかかっていることを、思いつくまま書いてみてください。まだ整理できていない気持ちでも大丈夫です。"
            className="field-base min-h-[272px] border-iris/42 bg-white shadow-[0_12px_28px_rgba(137,119,154,0.07)] sm:min-h-[296px]"
            disabled={isLoading}
          />
        </label>

        {error ? (
          <p className="rounded-2xl border border-rose-200 bg-rose-50/90 px-4 py-3 text-sm leading-6 text-rose-700">
            {error}
          </p>
        ) : null}

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onStart}
            disabled={!isStartEnabled || isLoading}
            className="button-primary min-w-[168px]"
          >
            {isLoading ? "ソラが整えています..." : "この内容でソラに話す"}
          </button>
          <button
            type="button"
            onClick={onReset}
            className="button-secondary"
            disabled={isLoading}
          >
            リセット
          </button>
        </div>

        <div className="soft-panel p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-gold">Guide</p>
          <p className="mt-2 text-sm leading-7 text-stone">
            {started
              ? "相談は始まっています。右へ進みながら、ソラの問いに短い言葉で返してみてください。"
              : "まずは左の入力欄に、心に引っかかっていることを一つだけ置いてみてください。長くなくても大丈夫です。"}
          </p>
        </div>
      </div>
    </section>
  );
};
