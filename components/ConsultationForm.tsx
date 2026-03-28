import { VoiceInputPanel } from "@/components/VoiceInputPanel";

type InputMode = "text" | "voice";

type ConsultationFormProps = {
  input: string;
  error: string;
  hasPreviousRecord: boolean;
  todayLabel: string;
  todayStatusText: string;
  startButtonLabel: string;
  inputMode: InputMode;
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
  input,
  error,
  hasPreviousRecord,
  todayLabel,
  todayStatusText,
  startButtonLabel,
  inputMode,
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
      <div className="mb-5">
        <div className="rounded-[18px] border border-lilac/24 bg-white/52 px-4 py-2.5">
          <p className="text-[10px] uppercase tracking-[0.18em] text-plum/56">今日の記録</p>
          <p className="mt-1 text-[15px] leading-7 text-ink/84">{todayLabel}</p>
          <p className="text-xs leading-6 text-stone/70">{todayStatusText}</p>
        </div>
        <p className="mt-2 text-sm leading-6 text-stone/74">
          何もなくても、ひとことで大丈夫です。
        </p>
        {hasPreviousRecord ? (
          <p className="mt-1 text-xs leading-6 text-stone/68">
            前の続きでなくても大丈夫です。
          </p>
        ) : null}
      </div>

      <div className="space-y-4">
        <label className="block">
          <div className="mb-3">
            <span className="block text-[13px] font-normal text-ink/72">今日のことを少し書く</span>
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

          {inputMode === "text" ? (
            <>
              <textarea
                value={input}
                onChange={(event) => onInputChange(event.target.value)}
                rows={9}
                maxLength={maxLength}
                placeholder="今日は何もなかった、でも大丈夫"
                className="field-base min-h-[132px] border-lilac/30 bg-white/84 shadow-none sm:min-h-[240px]"
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
            {isLoading ? "言葉を整えています..." : startButtonLabel}
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
      </div>
    </section>
  );
};
