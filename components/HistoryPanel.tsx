import Link from "next/link";
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

type HistoryGroupKey = "today" | "yesterday" | "thisWeek" | "earlier";

const historyGroupOrder: HistoryGroupKey[] = ["today", "yesterday", "thisWeek", "earlier"];

const HISTORY_GROUP_LABELS: Record<HistoryGroupKey, string> = {
  today: "今日",
  yesterday: "昨日",
  thisWeek: "このごろ",
  earlier: "少し前",
};

const getHistoryGroupKey = (createdAt: string): HistoryGroupKey => {
  const createdDate = new Date(createdAt);
  const now = new Date();

  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfCreated = new Date(
    createdDate.getFullYear(),
    createdDate.getMonth(),
    createdDate.getDate(),
  );

  const diffDays = Math.floor(
    (startOfToday.getTime() - startOfCreated.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffDays <= 0) {
    return "today";
  }

  if (diffDays === 1) {
    return "yesterday";
  }

  if (diffDays <= 7) {
    return "thisWeek";
  }

  return "earlier";
};

export const HistoryPanel = ({
  records,
  onSelect,
  onDelete,
  visibleCount = 4,
  selectLabel = "この言葉を開く",
}: HistoryPanelProps) => {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const visibleRecords = records.slice(0, visibleCount);
  const groupedRecords: Array<{ key: HistoryGroupKey; records: ConsultationRecord[] }> =
    historyGroupOrder
      .map((key) => ({
        key,
        records: visibleRecords.filter((record) => getHistoryGroupKey(record.createdAt) === key),
      }))
      .filter((group) => group.records.length > 0);

  return (
    <section className="rounded-[22px] border border-lilac/28 bg-white/56 p-5">
      <div className="mb-4">
        <h2 className="font-serif text-xl text-plum">最近残した言葉</h2>
        <p className="mt-2 text-sm leading-7 text-stone/82">
          日付やテーマよりも、そのときの言葉を静かにたどれるようにしています。
        </p>
      </div>

      <div className="space-y-5">
        {visibleRecords.length > 0 ? (
          groupedRecords.map((group) => (
            <section key={group.key} className="space-y-3.5">
              <p className="text-[10px] uppercase tracking-[0.16em] text-plum/52">
                {HISTORY_GROUP_LABELS[group.key]}
              </p>
              <div className="grid gap-3.5 lg:grid-cols-2">
                {group.records.map((record) => (
                  <article
                    key={record.id}
                    className="relative rounded-[20px] border border-lilac/24 bg-white/64 p-4"
                  >
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div className="space-y-2">
                        <span className="inline-flex rounded-full bg-white/78 px-3 py-1 text-[11px] text-plum/72">
                          {record.topic}
                        </span>
                        <p className="line-clamp-3 text-[15px] leading-7 text-ink/88">
                          {record.userInput}
                        </p>
                        <p className="text-xs leading-6 text-stone/72">{getRecordDisplayTitle(record)}</p>
                      </div>
                      <div className="relative flex shrink-0 items-start gap-2">
                        <span className="text-[11px] leading-5 text-stone/68">
                          {formatRelativeDate(record.createdAt)}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setOpenMenuId((current) => (current === record.id ? null : record.id))
                          }
                          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-lilac/18 bg-white/74 text-stone/72 transition hover:border-iris/30 hover:text-plum"
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
                    {record.emotionTag ? (
                      <p className="mt-1 text-xs leading-6 text-stone/70">
                        今の気持ち: {record.emotionTag}
                      </p>
                    ) : null}
                    {record.heartState ? (
                      <p className="mt-1 text-xs leading-6 text-stone/70">
                        心の現在地: {record.heartState}
                      </p>
                    ) : null}
                    <div className="mt-4 rounded-[18px] border border-lilac/18 bg-white/74 p-3.5">
                      <p className="text-[10px] uppercase tracking-[0.16em] text-gold/86">今日の気づき</p>
                      <p className="mt-1 text-sm leading-6 text-ink/84">{record.insight}</p>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => onSelect(record)}
                        className="text-sm text-stone/78 transition hover:text-plum"
                      >
                        {selectLabel}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))
        ) : (
          <div className="rounded-[20px] border border-lilac/24 bg-white/48 p-5 text-sm leading-7 text-stone lg:col-span-2">
            <p className="font-serif text-xl text-plum">心の地図</p>
            <p className="mt-3">まだ残っている言葉はありません。</p>
            <p className="mt-3">
              最初の記録を残すと、
              <br />
              ここに少しずつ心の流れが見えてきます。
            </p>
            <div className="mt-4">
              <Link href="/consultation" className="text-sm text-stone/78 transition hover:text-plum">
                記録を始める
              </Link>
            </div>
          </div>
        )}
      </div>
      {records.length > visibleRecords.length ? (
        <p className="mt-4 text-xs leading-6 text-stone/66">
          まずは最新 {visibleRecords.length} 件を表示しています。
        </p>
      ) : null}
    </section>
  );
};
