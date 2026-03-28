import { VoiceInputPanel } from "@/components/VoiceInputPanel";
import { consultationTopics, ConsultationTopic } from "@/types/consultation";

type InputMode = "text" | "voice";

type ConsultationFormProps = {
  topic: ConsultationTopic;
  input: string;
  error: string;
  hasPreviousRecord: boolean;
  inputMode: InputMode;
  onTopicChange: (value: ConsultationTopic) => void;
  onInputChange: (value: string) => void;
  onInputModeChange: (value: InputMode) => void;
  onStart: () => void;
  onReset: () => void;
  started: boolean;
  isStartEnabled: boolean;
  isLoading: boolean;
  maxLength: number;
};

export const ConsultationForm = ({
  topic,
  input,
  error,
  hasPreviousRecord,
  inputMode,
  onTopicChange,
  onInputChange,
  onInputModeChange,
  onStart,
  onReset,
  started,
  isStartEnabled,
  isLoading,
  maxLength,
}: ConsultationFormProps) => {
  return (
    <section className="surface-card border-iris/32 bg-white/78 p-6 shadow-[0_22px_52px_rgba(104,88,120,0.1)] sm:p-7 lg:p-8">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.24em] text-gold">Step 1</p>
        <h2 className="mt-2 font-serif text-2xl text-plum">今日の記録を、少しだけ残してみる</h2>
        <p className="mt-3 text-sm leading-7 text-stone">
          出来事より、いま残っている気持ちを少しだけ書いてみてください。
        </p>
        <p className="mt-3 text-sm leading-7 text-stone/88">
          2〜3回ほど言葉を重ねながら、気持ちを少しずつ残していきます。
        </p>
        <p className="mt-2 text-sm leading-7 text-stone/80">何もなくても、ひとことで大丈夫です。</p>
        {hasPreviousRecord ? (
          <p className="mt-2 text-sm leading-7 text-stone/80">
            前の続きでなくても大丈夫です。
          </p>
        ) : null}
        <div className="mt-4 flex flex-wrap gap-2">
          {["1 きっかけを選ぶ", "2 書く / 話す", "3 言葉を残す"].map((step) => (
            <span
              key={step}
              className="inline-flex rounded-full border border-lilac/34 bg-white/78 px-3 py-1 text-xs text-stone"
            >
              {step}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-5">
        <div className="rounded-[24px] border border-lilac/45 bg-white/76 p-4 sm:p-5">
          <span className="mb-3 block text-sm text-ink/80">今日に近いもの</span>
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
          <div className="mb-3">
            <span className="block text-sm text-ink">今日のことを少し書く</span>
            <p className="mt-1 text-xs leading-6 text-stone/76">言葉になりきっていなくても大丈夫です。</p>
          </div>
          <div className="mb-5 inline-flex rounded-[18px] border border-iris/34 bg-white/88 p-1.5 shadow-[0_10px_24px_rgba(137,119,154,0.05)]">
            {([
              { key: "text", label: "書く" },
              { key: "voice", label: "話す", icon: "○" },
            ] as const).map((option) => {
              const isSelected = option.key === inputMode;

              return (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => onInputModeChange(option.key)}
                  disabled={isLoading}
                  className={`inline-flex min-w-[88px] items-center justify-center gap-1.5 rounded-[14px] px-4 py-2.5 text-sm transition ${
                    isSelected
                      ? "bg-lilac/44 text-plum shadow-soft"
                      : "text-stone hover:bg-mist/55 hover:text-plum"
                  }`}
                >
                  {"icon" in option ? (
                    <span className="text-[11px] opacity-70" aria-hidden="true">
                      {option.icon}
                    </span>
                  ) : null}
                  {option.label}
                </button>
              );
            })}
          </div>

          <span className="mb-2 block text-sm text-ink/80">今日の記録</span>
          {inputMode === "text" ? (
            <>
              <div className="mb-4 rounded-[22px] border border-iris/34 bg-white/82 px-4 py-3.5 shadow-[0_10px_24px_rgba(137,119,154,0.05)] sm:px-5">
                <p className="text-sm leading-7 text-stone">
                  出来事より、心に残っている感覚を少しだけ残すつもりで大丈夫です。
                </p>
                <p className="mt-2 text-xs leading-6 text-stone/78">
                  例: 「最近仕事のあとに重さが残ります」 「将来のことを考えると少し落ち着きません」
                  「人との距離感が気になっています」
                </p>
              </div>
              <textarea
                value={input}
                onChange={(event) => onInputChange(event.target.value)}
                rows={12}
                maxLength={maxLength}
                placeholder="まだ整理されていないままで大丈夫です"
                className="field-base min-h-[140px] border-iris/42 bg-white shadow-[0_12px_28px_rgba(137,119,154,0.07)] sm:min-h-[304px]"
                disabled={isLoading}
              />
            </>
          ) : (
            <VoiceInputPanel
              value={input}
              onChange={onInputChange}
              disabled={isLoading}
              maxLength={maxLength}
            />
          )}
        </label>

        {error ? (
          <p className="rounded-2xl border border-rose-200 bg-rose-50/90 px-4 py-3 text-sm leading-6 text-rose-700">
            {error}
          </p>
        ) : null}

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onStart}
            disabled={!isStartEnabled || isLoading}
            className="button-primary min-w-[168px]"
          >
            {isLoading ? "言葉を整えています..." : "言葉を残す"}
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

        {isLoading && !started ? (
          <div className="rounded-2xl border border-lilac/36 bg-mist/34 px-4 py-3 text-sm leading-7 text-stone">
            ソラがあなたの言葉を整理しています…
          </div>
        ) : null}

        <p className="text-sm leading-7 text-stone">
          {started
            ? "いま残している言葉を、もう少しだけ続けて書けます。"
            : "送ると、ソラが静かに整理を手伝います。"}
        </p>
      </div>
    </section>
  );
};
