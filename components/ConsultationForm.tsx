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
    <section className="surface-card p-6 sm:p-7 lg:p-8">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.24em] text-gold">Step 1</p>
        <h2 className="mt-2 font-serif text-2xl text-plum">相談入力</h2>
        <p className="mt-3 text-sm leading-7 text-stone">
          今の気持ちを、そのままの言葉で書いてください。うまくまとまっていなくても大丈夫です。
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
          <textarea
            value={input}
            onChange={(event) => onInputChange(event.target.value)}
            rows={11}
            placeholder="いま心に引っかかっていることを、そのまま書いてみてください。まだ整理できていない気持ちでも大丈夫です。"
            className="field-base min-h-[240px] bg-white/92"
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
            className="button-primary"
          >
            {isLoading ? "ソラが整えています..." : "相談を始める"}
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
              : "まずは心に引っかかっていることを一つだけ書いてみてください。長くなくても大丈夫です。"}
          </p>
        </div>
      </div>
    </section>
  );
};
