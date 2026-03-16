import { SoraResponseCards } from "@/components/SoraResponseCards";
import { ChatMessage, SoraReply } from "@/types/consultation";

type ChatPanelProps = {
  messages: ChatMessage[];
  replyInput: string;
  chatError: string;
  canReply: boolean;
  canSummarize: boolean;
  onReplyInputChange: (value: string) => void;
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
  onReplyInputChange,
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
        <div className="max-h-[380px] min-h-[260px] space-y-3 overflow-y-auto rounded-[28px] border border-lilac/30 bg-mist/28 p-4 sm:p-5">
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
          ) : (
            <div className="flex h-full min-h-[300px] items-center justify-center text-center text-sm leading-7 text-stone/75">
              相談を始めると、ここにソラからの問いかけが静かに届きます。
            </div>
          )}
        </div>

        <SoraResponseCards
          reply={latestReply}
          sections={["empathicMessage", "followUpQuestion"]}
        />

        <div className="sticky bottom-2 z-10 rounded-[26px] border border-iris/50 bg-white/98 p-4 shadow-[0_22px_48px_rgba(91,77,104,0.16)] backdrop-blur sm:bottom-3 sm:p-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-xs uppercase tracking-[0.22em] text-gold">
              あなたの返答
            </p>
            <p className="text-xs text-stone">読む → 書く</p>
          </div>
          <p className="mb-3 text-sm leading-7 text-stone">
            いま感じていることを、そのまま続けてソラに話してみてください。
          </p>
          <textarea
            value={replyInput}
            onChange={(event) => onReplyInputChange(event.target.value)}
            rows={4}
            placeholder="いま感じていることを、そのまま書いてみてください。短い言葉でも、まだまとまっていない気持ちでも大丈夫です。"
            className="field-base min-h-[152px] border-iris/50 bg-white shadow-[0_14px_30px_rgba(137,119,154,0.1)] disabled:bg-mist/60"
            disabled={isLoading || (!canReply && !canSummarize)}
          />

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

        <SoraResponseCards
          reply={latestReply}
          sections={["insight", "futureMessage"]}
        />
      </div>
    </section>
  );
};
