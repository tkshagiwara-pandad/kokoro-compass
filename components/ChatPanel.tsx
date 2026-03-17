import { RefObject } from "react";
import { VoiceInputPanel } from "@/components/VoiceInputPanel";
import { SoraResponseCards } from "@/components/SoraResponseCards";
import { ChatMessage, SoraReply } from "@/types/consultation";

type InputMode = "text" | "voice";

type ChatPanelProps = {
  messages: ChatMessage[];
  replyInput: string;
  chatError: string;
  canReply: boolean;
  canSummarize: boolean;
  inputMode: InputMode;
  onReplyInputChange: (value: string) => void;
  onInputModeChange: (value: InputMode) => void;
  onNext: () => void;
  onSummarize: () => void;
  messageHint: string;
  isLoading: boolean;
  onRetry: () => void;
  canRetry: boolean;
  latestReply: SoraReply | null;
  reflectionShift: string | null;
  soraPresenceLine: string;
  responseTopRef?: RefObject<HTMLDivElement | null>;
  maxLength: number;
};

export const ChatPanel = ({
  messages,
  replyInput,
  chatError,
  canReply,
  canSummarize,
  inputMode,
  onReplyInputChange,
  onInputModeChange,
  onNext,
  onSummarize,
  messageHint,
  isLoading,
  onRetry,
  canRetry,
  latestReply,
  reflectionShift,
  soraPresenceLine,
  responseTopRef,
  maxLength,
}: ChatPanelProps) => {
  return (
    <section className="surface-card p-6 sm:p-7 lg:p-8">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.24em] text-gold">Step 2</p>
        <h2 className="mt-2 font-serif text-2xl text-plum">ソラとの対話</h2>
        <p className="mt-3 text-sm leading-7 text-stone">
          いまの気持ちを、少しずつ整えていく時間です。
        </p>
      </div>

      <div className="space-y-5.5">
        <div
          ref={responseTopRef}
          className="rounded-xl border border-gray-100 bg-white px-4 py-3.5 shadow-sm"
        >
          <div className="flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-lilac/70" aria-hidden="true" />
            <p className="text-[11px] uppercase tracking-[0.2em] text-plum/62">ソラ</p>
          </div>
          <p className="mt-2 text-sm leading-7 text-stone">
            ここでは、急がずに言葉にして大丈夫です。
          </p>
          <p className="mt-1 text-xs leading-6 text-stone/72">
            {soraPresenceLine}
          </p>
        </div>

        {latestReply?.empathicMessage ? (
          <div className="space-y-2">
            <SoraResponseCards
              reply={latestReply}
              sections={["empathicMessage"]}
            />
          </div>
        ) : null}

        <div className="relative z-10 rounded-xl border border-gray-100 bg-white p-4 shadow-sm lg:sticky lg:bottom-3 sm:p-5">
          <div className="rounded-xl bg-mist/14 p-4 sm:p-5">
            {latestReply?.followUpQuestion ? (
              <div className="mb-4">
                <p className="text-[11px] uppercase tracking-[0.2em] text-gold">いまの問い</p>
                <p className="mt-1 text-sm leading-relaxed text-ink">
                  {latestReply.followUpQuestion}
                </p>
              </div>
            ) : null}

            <div className="space-y-3 rounded-xl bg-white p-3.5 sm:p-4">
              <p className="text-sm leading-6 text-stone/78">少し言葉にしてみる</p>
              <div className="inline-flex rounded-full border border-lilac/44 bg-white/88 p-1">
                {([
                  { key: "text", label: "書く" },
                  { key: "voice", label: "音声で入力" },
                ] as const).map((option) => {
                  const isSelected = option.key === inputMode;

                  return (
                    <button
                      key={option.key}
                      type="button"
                      onClick={() => onInputModeChange(option.key)}
                      disabled={isLoading}
                      className={`rounded-full px-4 py-2 text-sm transition ${
                        isSelected
                          ? "bg-lilac/44 text-plum shadow-soft"
                          : "text-stone hover:text-plum"
                      }`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>

              {inputMode === "voice" ? (
                <VoiceInputPanel
                  value={replyInput}
                  onChange={onReplyInputChange}
                  disabled={isLoading || (!canReply && !canSummarize)}
                  maxLength={maxLength}
                  introMessage="いま感じていることを、そのまま続けて話してみてください。"
                  helperMessage="声は文字になってから、静かに見直せます。"
                  transcriptHint="内容を整えたら、下のボタンからそのまま進められます。"
                />
              ) : (
                <>
                  <textarea
                    value={replyInput}
                    onChange={(event) => onReplyInputChange(event.target.value)}
                    rows={4}
                    maxLength={maxLength}
                    placeholder="思いつくことを、そのまま書いて大丈夫です。"
                    className="field-base min-h-[168px] border-gray-100 bg-white leading-relaxed shadow-sm disabled:bg-mist/60 sm:min-h-[180px]"
                    disabled={isLoading || (!canReply && !canSummarize)}
                  />
                </>
              )}
            </div>
          </div>

          {chatError ? (
            <div className="mt-3 rounded-2xl border border-rose-200 bg-rose-50/90 px-4 py-3 text-sm leading-6 text-rose-700">
              <p>{chatError}</p>
              {canRetry ? (
                <button
                  type="button"
                  onClick={onRetry}
                  className="mt-3 rounded-full border border-rose-200 bg-white px-4 py-2 text-sm text-rose-700 transition hover:bg-rose-50"
                >
                  もう一度試す
                </button>
              ) : null}
            </div>
          ) : null}

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onNext}
              disabled={isLoading || !canReply}
              className="button-secondary min-w-[126px] border-iris bg-white"
            >
              {isLoading ? "ソラが言葉を整えています" : "次へ"}
            </button>
            <button
              type="button"
              onClick={onSummarize}
              disabled={isLoading || !canSummarize}
              className="button-accent min-w-[158px]"
            >
              心の整理を見る
            </button>
          </div>

          <p className="mt-3 text-xs leading-6 text-stone/68">{messageHint}</p>
        </div>

        {latestReply?.insight ? (
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.2em] text-plum/62">今日の小さな気づき</p>
            <SoraResponseCards
              reply={latestReply}
              sections={["insight"]}
            />
          </div>
        ) : null}

        {reflectionShift ? (
          <div className="rounded-[20px] border border-lilac/32 bg-mist/22 px-4 py-4">
            <p className="text-[11px] uppercase tracking-[0.2em] text-plum/62">前回との変化</p>
            <p className="mt-2 text-sm leading-7 text-ink/88">{reflectionShift}</p>
          </div>
        ) : null}

        {messages.length > 0 ? (
          <div className="max-h-[320px] space-y-3 overflow-y-auto rounded-xl border border-gray-100 bg-mist/20 p-4 sm:max-h-[380px] sm:p-5">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`max-w-[90%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                  message.sender === "sora"
                    ? "border border-gray-100 bg-white text-ink shadow-sm"
                    : "ml-auto bg-plum text-white shadow-soft"
                }`}
              >
                <p className="mb-1 text-xs uppercase tracking-[0.18em] opacity-60">
                  {message.sender === "sora" ? "ソラ" : "あなた"}
                </p>
                <p>{message.content}</p>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
};
