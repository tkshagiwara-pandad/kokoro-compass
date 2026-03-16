import { EmotionalState } from "@/types/consultation";

export const defaultEmotionalState: EmotionalState = {
  anxiety: 6,
  fatigue: 5,
  hope: 4,
};

export const normalizeEmotionalState = (
  state: Partial<EmotionalState> | undefined,
): EmotionalState => ({
  anxiety:
    typeof state?.anxiety === "number"
      ? Math.min(10, Math.max(0, Math.round(state.anxiety)))
      : defaultEmotionalState.anxiety,
  fatigue:
    typeof state?.fatigue === "number"
      ? Math.min(10, Math.max(0, Math.round(state.fatigue)))
      : defaultEmotionalState.fatigue,
  hope:
    typeof state?.hope === "number"
      ? Math.min(10, Math.max(0, Math.round(state.hope)))
      : defaultEmotionalState.hope,
});
