import { ChatRequest, ChatResponse } from "@/types/consultation";

const GENERIC_ERROR_MESSAGE =
  "うまく応答を作れませんでした。少し時間を置いてもう一度お試しください。";

export const requestSoraReply = async (
  payload: ChatRequest,
): Promise<ChatResponse> => {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = (await response.json().catch(() => null)) as
    | (Partial<ChatResponse> & { error?: string })
    | null;

  if (!response.ok || !data?.reply) {
    throw new Error(data?.error || GENERIC_ERROR_MESSAGE);
  }

  return {
    reply: {
      empathicMessage: data.reply.empathicMessage || "",
      followUpQuestion: data.reply.followUpQuestion || "",
      insight: data.reply.insight || "",
      futureMessage: data.reply.futureMessage || "",
      nextQuestion: data.reply.nextQuestion || "",
      emotionalState: {
        anxiety: data.reply.emotionalState?.anxiety ?? 0,
        fatigue: data.reply.emotionalState?.fatigue ?? 0,
        hope: data.reply.emotionalState?.hope ?? 0,
      },
      reflectionSummary: {
        topic:
          data.reply.reflectionSummary?.topic ||
          data.reply.reflectionSummary?.theme ||
          "",
        emotion: data.reply.reflectionSummary?.emotion || "",
        coreIssue: data.reply.reflectionSummary?.coreIssue || "",
        whatYouNeed: data.reply.reflectionSummary?.whatYouNeed || "",
        soraMessage: data.reply.reflectionSummary?.soraMessage || "",
        theme:
          data.reply.reflectionSummary?.topic ||
          data.reply.reflectionSummary?.theme ||
          "",
      },
    },
  };
};
