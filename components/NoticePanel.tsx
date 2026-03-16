import { BETA_NOTICE_ITEMS } from "@/lib/config";

type NoticePanelProps = {
  compact?: boolean;
};

export const NoticePanel = ({ compact = false }: NoticePanelProps) => {
  return (
    <section className={`soft-panel ${compact ? "p-4" : "p-5 sm:p-6"}`}>
      <p className="text-xs uppercase tracking-[0.2em] text-gold">ご利用にあたって</p>
      <div className="mt-3 space-y-2 text-sm leading-7 text-stone">
        {BETA_NOTICE_ITEMS.map((item) => (
          <p key={item}>{item}</p>
        ))}
      </div>
    </section>
  );
};
