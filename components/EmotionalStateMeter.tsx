import { EmotionalState } from "@/types/consultation";

type EmotionalStateMeterProps = {
  state: EmotionalState;
  compact?: boolean;
};

const items = [
  { key: "anxiety", label: "不安" },
  { key: "fatigue", label: "疲れ" },
  { key: "hope", label: "希望" },
] as const;

const buildBar = (value: number) => `${"█".repeat(value)}${"░".repeat(10 - value)}`;

export const EmotionalStateMeter = ({
  state,
  compact = false,
}: EmotionalStateMeterProps) => {
  return (
    <div className={compact ? "space-y-2" : "space-y-3"}>
      {items.map((item) => (
        <div key={item.key} className="space-y-1">
          <div
            className={`flex items-center justify-between ${
              compact ? "text-xs" : "text-sm"
            } text-stone`}
          >
            <span>{item.label}</span>
            <span>{state[item.key]}/10</span>
          </div>
          <div
            className={`rounded-full border border-lilac/25 bg-white/78 font-mono tracking-[0.12em] text-plum ${
              compact ? "px-2.5 py-1 text-[10px]" : "px-3 py-2 text-xs"
            }`}
          >
            {buildBar(state[item.key])}
          </div>
        </div>
      ))}
    </div>
  );
};
