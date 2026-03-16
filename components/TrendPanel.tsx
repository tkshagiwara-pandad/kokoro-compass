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
    return "まだ記録は少ないですが、少しずつ残していくと心が向かいやすい方向が見えてきます。";
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

  return (
    <section className="rounded-[24px] border border-lilac/45 bg-white/65 p-5 shadow-soft">
      <div className="mb-4">
        <p className="text-xs uppercase tracking-[0.24em] text-gold">My Log</p>
        <h2 className="mt-2 font-serif text-xl text-plum">人生の地図</h2>
        <p className="mt-2 text-sm leading-7 text-stone">
          保存した相談から、最近のテーマや小さな気づきの流れを静かに見返せます。
        </p>
      </div>

      <div className="grid gap-3 lg:grid-cols-[1.1fr_1.2fr_0.9fr]">
        <article className="rounded-[20px] border border-lilac/45 bg-mist/40 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-gold">最近のテーマ</p>
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
        </article>

        <article className="rounded-[20px] border border-lilac/45 bg-mist/40 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-gold">直近3件の気づき</p>
          <div className="mt-3 space-y-2">
            {recentRecords.map((record) => (
              <div key={record.id} className="rounded-2xl bg-white/82 px-4 py-3 text-sm leading-7 text-ink">
                {record.insight}
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[20px] border border-lilac/45 bg-mist/40 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-gold">AIコメント</p>
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
                まだ相談ログがないため、ここに最近の流れが表示されます。
              </p>
            )}
          </div>
        </article>
      </div>
    </section>
  );
};
