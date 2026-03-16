import { ConsultationStage } from "@/types/consultation";

const steps = [
  { id: 1, label: "STEP 1", title: "相談を書く" },
  { id: 2, label: "STEP 2", title: "ソラが質問する" },
  { id: 3, label: "STEP 3", title: "心の整理を見る" },
] as const;

type StepIndicatorProps = {
  currentStage: ConsultationStage;
};

export const StepIndicator = ({ currentStage }: StepIndicatorProps) => {
  return (
    <section className="surface-card w-full p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-gold">Progress</p>
          <p className="mt-1 text-sm text-stone">いまの流れが分かるように、3つの段階で表示しています。</p>
        </div>
        <div className="rounded-full border border-lilac/45 bg-white/84 px-4 py-2 text-sm text-plum shadow-soft">
          STEP {currentStage} / 3
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {steps.map((step) => {
          const isActive = step.id === currentStage;
          const isComplete = step.id < currentStage;

          return (
            <div
              key={step.id}
              className={`rounded-[24px] border px-4 py-4 transition ${
                isActive
                  ? "border-iris/70 bg-white shadow-soft"
                  : isComplete
                    ? "border-gold/50 bg-gold/10"
                    : "border-lilac/60 bg-mist/55"
              }`}
            >
              <div className="mb-2 flex items-center gap-3">
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs ${
                    isActive
                      ? "bg-plum text-white"
                      : isComplete
                        ? "bg-gold text-white"
                        : "bg-white text-stone"
                  }`}
                >
                  {step.id}
                </span>
                <p className="text-xs tracking-[0.24em] text-stone">
                  {step.label}
                </p>
              </div>
              <h2 className="font-serif text-lg text-plum">{step.title}</h2>
            </div>
          );
        })}
      </div>
    </section>
  );
};
