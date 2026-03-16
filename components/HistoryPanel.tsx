import { formatJapaneseDateTime } from "@/lib/format";
import { ConsultationRecord } from "@/types/consultation";

type HistoryPanelProps = {
  records: ConsultationRecord[];
  onSelect: (record: ConsultationRecord) => void;
  onDelete: (id: string) => void;
  visibleCount?: number;
  selectLabel?: string;
};

export const HistoryPanel = ({
  records,
  onSelect,
  onDelete,
  visibleCount = 4,
  selectLabel = "履歴を開く",
}: HistoryPanelProps) => {
  const visibleRecords = records.slice(0, visibleCount);

  return (
    <section className="rounded-[24px] border border-lilac/42 bg-white/68 p-5 shadow-soft">
      <div className="mb-4">
        <p className="text-xs uppercase tracking-[0.24em] text-gold">History</p>
        <h2 className="mt-2 font-serif text-xl text-plum">相談履歴</h2>
        <p className="mt-2 text-sm leading-7 text-stone">
          ローカルに残った記録を、あとから静かにたどれます。
        </p>
      </div>

      <div className="grid gap-3.5 lg:grid-cols-2">
        {visibleRecords.length > 0 ? (
          visibleRecords.map((record) => (
            <article
              key={record.id}
              className="rounded-[22px] border border-lilac/40 bg-mist/32 p-4 shadow-soft"
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <div className="space-y-2">
                  <span className="inline-flex rounded-full bg-white px-3 py-1 text-xs text-plum shadow-soft">
                    {record.topic}
                  </span>
                  <p className="text-[11px] leading-5 text-stone/85">
                    テーマ: {record.summary.topic}
                  </p>
                </div>
                <span className="shrink-0 text-[11px] leading-5 text-stone">
                  {formatJapaneseDateTime(record.createdAt)}
                </span>
              </div>
              <p className="line-clamp-4 text-sm leading-7 text-ink">{record.userInput}</p>
              <p className="mt-3 text-xs leading-6 text-stone">
                感情: {record.emotion}
              </p>
              {record.emotionTag ? (
                <p className="mt-1 text-xs leading-6 text-stone">
                  今の気持ち: {record.emotionTag}
                </p>
              ) : null}
              {record.heartState ? (
                <p className="mt-1 text-xs leading-6 text-stone">
                  心の現在地: {record.heartState}
                </p>
              ) : null}
              <div className="mt-3 rounded-2xl border border-lilac/26 bg-white/84 px-3 py-3">
                <p className="text-[11px] uppercase tracking-[0.18em] text-gold">今日の気づき</p>
                <p className="mt-1 text-sm leading-6 text-ink">{record.insight}</p>
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => onSelect(record)}
                  className="button-secondary"
                >
                  {selectLabel}
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(record.id)}
                  className="button-accent"
                >
                  削除
                </button>
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-[22px] border border-lilac/45 bg-mist/35 p-5 text-sm leading-7 text-stone lg:col-span-2">
            相談を重ねると
            <br />
            ここにあなたの記録が残ります。
          </div>
        )}
      </div>
      {records.length > visibleRecords.length ? (
        <p className="mt-4 text-xs leading-6 text-stone">
          まずは最新 {visibleRecords.length} 件を表示しています。
        </p>
      ) : null}
    </section>
  );
};
