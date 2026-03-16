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
}: ChatPanelProps) => {
  return (
    <section className="surface-card p-6 sm:p-7 lg:p-8">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.24em] text-gold">Step 2</p>
        <h2 className="mt-2 font-serif text-2xl text-plum">ソラとの対話</h2>
        <p className="mt-3 text-sm leading-7 text-stone">
          共感と問いかけを通じて、今の心の輪郭をゆっくり見つけます。
        </p>
      </div>

      <div className="space-y-5.5">
        <div className="max-h-[320px] min-h-[220px] space-y-3 overflow-y-auto rounded-[28px] border border-lilac/30 bg-mist/28 p-4 sm:max-h-[380px] sm:min-h-[260px] sm:p-5">
          {messages.length > 0 ? (
            messages.map((message) => (
              <div
                key={message.id}
                className={`max-w-[90%] rounded-[24px] px-4 py-3 text-sm leading-7 ${
                  message.sender === "sora"
                    ? "border border-lilac/50 bg-white text-ink shadow-soft"
                    : "ml-auto bg-plum text-white shadow-soft"
                }`}
              >
                <p className="mb-1 text-xs uppercase tracking-[0.18em] opacity-60">
                  {message.sender === "sora" ? "ソラ" : "あなた"}
                </p>
                <p>{message.content}</p>
              </div>
            ))
          ) : isLoading ? (
            <div className="flex h-full min-h-[300px] items-center justify-center">
              <div className="max-w-md rounded-[24px] border border-lilac/36 bg-white/92 px-5 py-4 text-center shadow-soft">
                <p className="text-xs uppercase tracking-[0.22em] text-gold">Thinking</p>
                <p className="mt-2 text-sm leading-7 text-stone">
                  ソラがあなたの言葉を整理しています…
                </p>
              </div>
            </div>
          ) : (
            <div className="flex h-full min-h-[300px] items-center justify-center text-center text-sm leading-7 text-stone/75">
              相談を始めると、ここにソラからの問いかけが静かに届きます。
            </div>
          )}
        </div>

        {latestReply?.empathicMessage ? (
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.2em] text-plum/62">ソラの言葉</p>
            <SoraResponseCards
              reply={latestReply}
              sections={["empathicMessage"]}
            />
          </div>
        ) : null}

        <div className="sticky bottom-0 z-10 rounded-[26px] border border-iris/55 bg-white/98 p-4 shadow-[0_22px_48px_rgba(91,77,104,0.16)] backdrop-blur sm:bottom-3 sm:p-5">
          <div className="rounded-[22px] border border-lilac/34 bg-mist/20 p-4 sm:p-5">
            {latestReply?.followUpQuestion ? (
              <div className="mb-4">
                <p className="text-[11px] uppercase tracking-[0.2em] text-gold">いまの問い</p>
                <p className="mt-1 text-sm leading-6.5 text-ink">
                  {latestReply.followUpQuestion}
                </p>
              </div>
            ) : null}

            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-[11px] uppercase tracking-[0.2em] text-plum/62">
                ここで返してみてください
              </p>
              <p className="text-xs text-stone">
                {inputMode === "voice" ? "話して返す" : "書いて返す"}
              </p>
            </div>

            <div className="mb-4 inline-flex rounded-full border border-lilac/44 bg-white/88 p-1">
              {([
                { key: "text", label: "書く" },
                { key: "voice", label: "話す" },
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
                introMessage="いま感じていることを、そのまま続けて話してみてください。短くても大丈夫です。"
                helperMessage="声は一度文字になってから見直せます。必要なら少し整えて、そのまま次へ進めます。"
                transcriptLabel="返答を文字にした内容"
                transcriptHint="内容を整えたら、下の「次へ」または「心の整理を見る」からそのまま進められます。"
              />
            ) : (
              <>
                <p className="mb-3 text-sm leading-7 text-stone">
                  いま感じていることを、そのまま続けてソラに話してみてください。
                </p>
                <p className="mb-3 text-xs leading-6 text-stone/78">
                  うまく説明しようとしなくて大丈夫です。短い言葉でも、ひとつの感情だけでもかまいません。
                </p>
                <textarea
                  value={replyInput}
                  onChange={(event) => onReplyInputChange(event.target.value)}
                  rows={5}
                  placeholder="続けてソラに話してみてください。いま感じていることを、ひとことずつでも大丈夫です。"
                  className="field-base min-h-[176px] border-iris/52 bg-white shadow-[0_14px_30px_rgba(137,119,154,0.1)] disabled:bg-mist/60 sm:min-h-[188px]"
                  disabled={isLoading || (!canReply && !canSummarize)}
                />
                <p className="mt-2 text-xs leading-6 text-stone/72">
                  例: 「少し不安です」 「気持ちがまだまとまりません」
                  「本当はどうしたいのか分からないです」
                </p>
              </>
            )}
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
              {isLoading ? "ソラが少し考えています..." : "次へ"}
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
      </div>
    </section>
  );
};
