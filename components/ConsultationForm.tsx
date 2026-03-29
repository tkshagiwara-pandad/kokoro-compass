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
    <section className="surface-card border-iris/24 bg-white/74 p-5 shadow-[0_14px_36px_rgba(104,88,120,0.06)] sm:p-6 lg:p-7">
      <div className="mb-4">
        <div className="rounded-[16px] border border-lilac/18 bg-white/46 px-4 py-2.5">
          <p className="text-[10px] uppercase tracking-[0.18em] text-plum/56">今日の記録</p>
          <p className="mt-1 text-[15px] leading-7 text-ink/84">{todayLabel}</p>
          <p className="text-[11px] leading-6 text-stone/66">{todayStatusText}</p>
        </div>
        <p className="mt-2 text-sm leading-6 text-stone/72">
          何もなくても、ひとことで大丈夫です。
        </p>
        <p className="mt-1 text-[11px] leading-6 text-stone/62">
          たとえば「今日は何もなかったけど、少し疲れている」でも大丈夫です。
        </p>
        {hasPreviousRecord ? (
          <p className="mt-1 text-[11px] leading-6 text-stone/62">
            前の続きでなくても大丈夫です。
          </p>
        ) : null}
      </div>

      <div className="space-y-3">
        <label className="block">
          <div className="mb-2.5">
            <span className="block text-[12px] font-normal text-ink/68">今日のことを少し書く</span>
          </div>
          <div className="mb-3.5 inline-flex rounded-[16px] border border-iris/20 bg-white/82 p-1">
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
                  className={`inline-flex min-w-[84px] items-center justify-center gap-1.5 rounded-[13px] px-3.5 py-2 text-sm transition ${
                    isSelected
                      ? "bg-lilac/36 text-plum"
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
                rows={8}
                maxLength={maxLength}
                placeholder="今日は何もなかったけど、少し疲れている"
                className="field-base min-h-[120px] border-lilac/20 bg-white/76 leading-7 shadow-none sm:min-h-[196px]"
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

        <div className="mt-4.5 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onStart}
            disabled={!isStartEnabled || isLoading}
            className="button-primary min-w-[148px] opacity-95"
          >
            {isLoading ? "言葉を整えています..." : startButtonLabel}
          </button>
          <button
            type="button"
            onClick={onReset}
            className="text-sm text-stone/72 transition hover:text-plum"
            disabled={isLoading}
          >
            リセット
          </button>
        </div>

        {isLoading && !started ? (
          <div className="rounded-[18px] border border-lilac/20 bg-white/54 px-4 py-3 text-sm leading-7 text-stone/78">
            ソラがあなたの言葉を整理しています…
          </div>
        ) : null}
      </div>
    </section>
  );
};
