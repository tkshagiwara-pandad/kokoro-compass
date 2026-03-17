import { useState } from "react";
import { formatRelativeDate } from "@/lib/format";
import { getRecordDisplayTitle } from "@/lib/consultation-title";
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
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const visibleRecords = records.slice(0, visibleCount);

  return (
    <section className="rounded-[24px] border border-lilac/42 bg-white/68 p-5 shadow-soft">
      <div className="mb-4">
        <p className="text-xs uppercase tracking-[0.24em] text-gold">History</p>
        <h2 className="mt-2 font-serif text-xl text-plum">残してきた言葉</h2>
        <p className="mt-2 text-sm leading-7 text-stone">
          日付やテーマだけでなく、その日の小さな気づきを静かに見返せます。
        </p>
      </div>

      <div className="grid gap-3.5 lg:grid-cols-2">
        {visibleRecords.length > 0 ? (
          visibleRecords.map((record) => (
            <article
              key={record.id}
              className="relative rounded-[22px] border border-lilac/40 bg-mist/32 p-5 shadow-soft"
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <div className="space-y-2">
                  <span className="inline-flex rounded-full bg-white px-3 py-1 text-xs text-plum shadow-soft">
                    {record.topic}
                  </span>
                  <p className="text-sm leading-6 text-ink">{getRecordDisplayTitle(record)}</p>
                </div>
                <div className="relative flex shrink-0 items-start gap-2">
                  <span className="text-[11px] leading-5 text-stone">
                    {formatRelativeDate(record.createdAt)}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setOpenMenuId((current) => (current === record.id ? null : record.id))
                    }
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-lilac/26 bg-white/84 text-stone transition hover:border-iris/40 hover:text-plum"
                    aria-label="メニューを開く"
                    aria-expanded={openMenuId === record.id}
                  >
                    ︙
                  </button>
                  {openMenuId === record.id ? (
                    <div className="absolute right-0 top-9 z-10 min-w-[120px] rounded-2xl border border-lilac/24 bg-white p-2 shadow-soft">
                      <button
                        type="button"
                        onClick={() => {
                          const confirmed = window.confirm("この記録を削除しますか？");
                          setOpenMenuId(null);

                          if (confirmed) {
                            onDelete(record.id);
                          }
                        }}
                        className="w-full rounded-xl px-3 py-2 text-left text-sm text-rose-700 transition hover:bg-rose-50"
                      >
                        削除
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
              <p className="line-clamp-3 text-sm leading-7 text-ink/82">{record.userInput}</p>
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
              <div className="mt-4 rounded-2xl border border-lilac/26 bg-white/84 p-4">
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
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-[22px] border border-lilac/45 bg-mist/35 p-6 text-sm leading-7 text-stone lg:col-span-2">
            <p className="font-serif text-xl text-plum">あなたの心の地図</p>
            <p className="mt-3">まだ言葉は残っていません。</p>
            <p className="mt-3">
              こころの羅針盤では、
              <br />
              あなたが残した言葉から
              <br />
              心の動きを静かにたどることができます。
            </p>
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
