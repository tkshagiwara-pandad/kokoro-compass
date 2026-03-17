import { ConsultationRecord } from "@/types/consultation";
import { EmotionalStateMeter } from "@/components/EmotionalStateMeter";
import { formatJapaneseDateTime } from "@/lib/format";

type TrendPanelProps = {
  records: ConsultationRecord[];
};

const lifeMapThemes = ["仕事", "恋愛", "人間関係", "将来"] as const;
type LifeMapTheme = (typeof lifeMapThemes)[number];

const mapTopicToLifeTheme = (topic: ConsultationRecord["topic"]): LifeMapTheme =>
  topic === "将来不安" || topic === "なんとなく不安" ? "将来" : topic;

const getLifeMapCounts = (records: ConsultationRecord[]) => {
  const counts: Record<LifeMapTheme, number> = {
    仕事: 0,
    恋愛: 0,
    人間関係: 0,
    将来: 0,
  };

  records.forEach((record) => {
    counts[mapTopicToLifeTheme(record.topic)] += 1;
  });

  return counts;
};

const getRecentInsights = (records: ConsultationRecord[]) => records.slice(0, 3);

const buildLifeMapComment = (counts: Record<LifeMapTheme, number>) => {
  const rankedThemes = [...lifeMapThemes]
    .map((theme) => ({ theme, count: counts[theme] }))
    .filter((entry) => entry.count > 0)
    .sort((left, right) => right.count - left.count);

  if (rankedThemes.length === 0) {
    return "相談を重ねていくと、心が向かいやすいテーマや、くり返し立ち止まりやすい場所が少しずつ見えてきます。";
  }

  if (rankedThemes.length === 1) {
    return `最近は「${rankedThemes[0].theme}」が心の中心に現れやすいようです。いま大切にしたい感覚を、ひとつだけ言葉にしてみるのもよさそうです。`;
  }

  return `最近は「${rankedThemes[0].theme}」と「${rankedThemes[1].theme}」が重なって現れています。別々の悩みに見えても、心の奥では同じ願いを整えようとしているのかもしれません。`;
};

export const TrendPanel = ({ records }: TrendPanelProps) => {
  const recentRecords = getRecentInsights(records);
  const lifeMapCounts = getLifeMapCounts(records);
  const lifeMapComment = buildLifeMapComment(lifeMapCounts);
  const hasRecords = records.length > 0;

  return (
    <section className="rounded-[24px] border border-lilac/40 bg-white/70 p-5 shadow-soft">
      <div className="mb-4">
        <p className="text-xs uppercase tracking-[0.24em] text-gold">My Log</p>
        <h2 className="mt-2 font-serif text-xl text-plum">あなたの心の地図</h2>
        <p className="mt-2 text-sm leading-7 text-stone">
          {hasRecords
            ? "こころの羅針盤で残された言葉から、あなたの心の動きを静かにたどることができます。"
            : "相談が増えると、あなたの思考の傾向がここに少しずつ現れてきます。"}
        </p>
      </div>

      <div className="mb-4 rounded-[20px] border border-lilac/30 bg-white/84 px-4 py-3.5">
        <div className="flex items-center gap-2">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-lilac/70" aria-hidden="true" />
          <p className="text-[11px] uppercase tracking-[0.2em] text-plum/62">ソラのひとこと</p>
        </div>
        <p className="mt-2 text-sm leading-7 text-stone">
          {hasRecords
            ? "ここまで残してきた言葉にも、少しずつ流れがあるのかもしれません。"
            : "ここから少しずつ、あなたの言葉を残していけます。"}
        </p>
      </div>

      <div className="grid gap-3.5 lg:grid-cols-[1.05fr_1.1fr_0.95fr]">
        <article className="rounded-[20px] border border-lilac/38 bg-mist/30 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-gold">最近よく考えているテーマ</p>
          {hasRecords ? (
            <div className="mt-3 grid gap-2">
              {lifeMapThemes.map((theme) => (
                <div
                  key={theme}
                  className="flex items-center justify-between rounded-2xl border border-lilac/35 bg-white/82 px-4 py-3"
                >
                  <span className="text-sm text-ink">{theme}</span>
                  <span className="rounded-full bg-mist px-2.5 py-1 text-xs text-plum">
                    {lifeMapCounts[theme]}件
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-3 rounded-2xl border border-dashed border-lilac/38 bg-white/78 px-4 py-4">
              <p className="text-sm leading-7 text-ink">
                相談を重ねると、仕事や恋愛、人間関係、将来への気がかりがどのくらい現れやすいかが、ここに静かに残っていきます。
              </p>
              <div className="mt-3 grid gap-2">
                {lifeMapThemes.map((theme) => (
                  <div
                    key={theme}
                    className="flex items-center justify-between rounded-2xl border border-lilac/28 bg-mist/20 px-4 py-2.5"
                  >
                    <span className="text-sm text-stone">{theme}</span>
                    <span className="rounded-full bg-white/90 px-2.5 py-1 text-[11px] text-stone">
                      これから流れが見えてきます
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </article>

        <article className="rounded-[20px] border border-lilac/38 bg-mist/30 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-gold">最近の気づき</p>
          {recentRecords.length > 0 ? (
            <div className="mt-3 space-y-2">
              {recentRecords.map((record) => (
                <div key={record.id} className="rounded-2xl bg-white/82 px-4 py-3 text-sm leading-7 text-ink">
                  {record.insight}
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-3 rounded-2xl border border-dashed border-lilac/38 bg-white/78 px-4 py-4">
              <p className="text-sm leading-7 text-stone">
                ここには、その時々の小さな気づきが静かに残っていきます。あとから見返すと、同じような揺れ方や、少しずつ変わってきた視点に気づけることがあります。
              </p>
            </div>
          )}
        </article>

        <article className="rounded-[20px] border border-lilac/38 bg-mist/30 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-gold">最近の流れ</p>
          <p className="mt-3 text-sm leading-7 text-ink">{lifeMapComment}</p>
          <div className="mt-4 border-t border-lilac/30 pt-4">
            <p className="text-xs uppercase tracking-[0.22em] text-gold">
              心の状態の流れ
            </p>
          </div>
          <div className="mt-3 space-y-3">
            {recentRecords.length > 0 ? (
              recentRecords.map((record) => (
                <div
                  key={record.id}
                  className="rounded-2xl border border-lilac/35 bg-white/82 px-4 py-3"
                >
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <span className="text-xs text-plum">{record.topic}</span>
                    <span className="text-[11px] text-stone">
                      {formatJapaneseDateTime(record.createdAt)}
                    </span>
                  </div>
                  <EmotionalStateMeter state={record.emotionalState} compact />
                </div>
              ))
            ) : (
              <p className="text-sm leading-7 text-stone">
                相談を重ねると、不安や疲れ、希望の流れがここに静かに重なって見えてきます。
              </p>
            )}
          </div>
        </article>
      </div>
    </section>
  );
};
