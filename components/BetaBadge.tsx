type BetaBadgeProps = {
  label?: string;
};

export const BetaBadge = ({
  label = "β版 / テスト公開中",
}: BetaBadgeProps) => {
  return (
    <span className="inline-flex items-center rounded-full border border-gold/50 bg-white/80 px-3 py-1 text-[11px] tracking-[0.18em] text-gold shadow-soft">
      {label}
    </span>
  );
};
