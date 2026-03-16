import "server-only";
import OpenAI from "openai";
import { defaultEmotionalState, normalizeEmotionalState } from "@/lib/emotional-state";
import { getOpenAiConfig, getServerEnv } from "@/lib/env";
import { buildSoraUserPrompt, SORA_SYSTEM_PROMPT } from "@/services/ai/prompts";
import { ChatRequest, EmotionalState, SoraReply } from "@/types/consultation";

const soraReplySchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "empathicMessage",
    "followUpQuestion",
    "insight",
    "futureMessage",
    "nextQuestion",
    "emotionalState",
    "reflectionSummary",
  ],
  properties: {
    empathicMessage: {
      type: "string",
    },
    followUpQuestion: {
      type: "string",
    },
    insight: {
      type: "string",
    },
    futureMessage: {
      type: "string",
    },
    nextQuestion: {
      type: "string",
    },
    emotionalState: {
      type: "object",
      additionalProperties: false,
      required: ["anxiety", "fatigue", "hope"],
      properties: {
        anxiety: { type: "integer" },
        fatigue: { type: "integer" },
        hope: { type: "integer" },
      },
    },
    reflectionSummary: {
      type: "object",
      additionalProperties: false,
      required: ["topic", "emotion", "coreIssue", "whatYouNeed", "soraMessage"],
      properties: {
        topic: { type: "string" },
        emotion: { type: "string" },
        coreIssue: { type: "string" },
        whatYouNeed: { type: "string" },
        soraMessage: { type: "string" },
      },
    },
  },
} as const;

const fallbackReply = (request: ChatRequest): SoraReply => ({
  empathicMessage:
    "話してくださってありがとうございます。うまく言葉にならない揺れも、ここではそのままで大丈夫です。",
  followUpQuestion:
    request.action === "summarize"
      ? ""
      : "いま一番強く残っている気持ちは、不安、寂しさ、迷いのどれに近いでしょうか。",
  insight:
    "今日の小さな気づきとして、あなたは答えよりもまず安心できる足場を求めているのかもしれません。",
  futureMessage:
    "今振り返ると、あの頃の私は答えを急いでいたというより、安心して立ち止まれる場所を探していたのだと思います。",
  nextQuestion:
    "本当は、どんな時間や場所にいると少しほっとできるでしょうか。",
  emotionalState: defaultEmotionalState,
  reflectionSummary: {
    topic: `${request.topic}にまつわる心の整理`,
    emotion: "いくつもの気持ちが重なり、まだ輪郭を探している途中のようです。",
    coreIssue:
      "答えそのものよりも、自分の本音をどこから見つめればよいかが少し曖昧になっているようです。",
    whatYouNeed:
      "今すぐ結論を急がず、まずは今の気持ちを一文だけ静かに言葉にしてみることが助けになります。",
    soraMessage:
      "心は急がせなくて大丈夫です。静かに見つめ直す時間の中で、次の輪郭は少しずつ見えてきます。",
  },
});

const getTrimmedString = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

const getObject = (value: unknown) =>
  value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;

const extractJsonObject = (raw: string) => {
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fenced?.[1]) {
    return fenced[1].trim();
  }

  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");

  if (start >= 0 && end > start) {
    return raw.slice(start, end + 1).trim();
  }

  return raw.trim();
};

const parseStructuredReply = (payload: unknown) => {
  if (!payload) {
    return null;
  }

  if (typeof payload === "string") {
    const normalized = extractJsonObject(payload);
    return JSON.parse(normalized) as unknown;
  }

  if (typeof payload === "object") {
    return payload;
  }

  return null;
};

const normalizeReflectionSummary = (
  value: unknown,
  fallback: SoraReply["reflectionSummary"],
): SoraReply["reflectionSummary"] => {
  const summary = getObject(value);

  return {
    topic:
      getTrimmedString(summary?.topic) ||
      getTrimmedString(summary?.theme) ||
      fallback.topic,
    emotion: getTrimmedString(summary?.emotion) || fallback.emotion,
    coreIssue: getTrimmedString(summary?.coreIssue) || fallback.coreIssue,
    whatYouNeed: getTrimmedString(summary?.whatYouNeed) || fallback.whatYouNeed,
    soraMessage: getTrimmedString(summary?.soraMessage) || fallback.soraMessage,
    theme:
      getTrimmedString(summary?.topic) ||
      getTrimmedString(summary?.theme) ||
      fallback.topic,
  };
};

const sanitizeReply = (reply: Partial<SoraReply>, request: ChatRequest): SoraReply => {
  const fallback = fallbackReply(request);
  const normalizedReply = getObject(reply);

  return {
    empathicMessage:
      getTrimmedString(normalizedReply?.empathicMessage) || fallback.empathicMessage,
    followUpQuestion:
      request.action === "summarize"
        ? ""
        : getTrimmedString(normalizedReply?.followUpQuestion) ||
          fallback.followUpQuestion,
    insight: getTrimmedString(normalizedReply?.insight) || fallback.insight,
    futureMessage:
      getTrimmedString(normalizedReply?.futureMessage) || fallback.futureMessage,
    nextQuestion:
      getTrimmedString(normalizedReply?.nextQuestion) || fallback.nextQuestion,
    emotionalState: normalizeEmotionalState(
      getObject(normalizedReply?.emotionalState) as Partial<EmotionalState> | undefined,
    ),
    reflectionSummary: normalizeReflectionSummary(
      normalizedReply?.reflectionSummary,
      fallback.reflectionSummary,
    ),
  };
};

const extractStructuredPayload = (response: unknown) => {
  const candidate = response as {
    output_parsed?: unknown;
    output_text?: string;
    output?: Array<{ content?: Array<{ text?: string; json?: unknown }> }>;
  };

  if (candidate.output_parsed && typeof candidate.output_parsed === "object") {
    return candidate.output_parsed;
  }

  if (
    typeof candidate.output_text === "string" &&
    candidate.output_text.trim()
  ) {
    return candidate.output_text.trim();
  }

  for (const outputItem of candidate.output ?? []) {
    if ("content" in outputItem && Array.isArray(outputItem.content)) {
      for (const contentItem of outputItem.content) {
        if ("json" in contentItem && contentItem.json && typeof contentItem.json === "object") {
          return contentItem.json;
        }

        if ("text" in contentItem && typeof contentItem.text === "string") {
          const text = contentItem.text.trim();
          if (text) {
            return text;
          }
        }
      }
    }
  }

  return "";
};

const getClient = () => {
  const { apiKey } = getOpenAiConfig();

  return new OpenAI({ apiKey });
};

export const generateSoraReply = async (request: ChatRequest): Promise<SoraReply> => {
  try {
    const client = getClient();
    const { model } = getOpenAiConfig();
    const response = await client.responses.create({
      model,
      instructions: SORA_SYSTEM_PROMPT,
      input: buildSoraUserPrompt(request),
      text: {
        format: {
          type: "json_schema",
          name: "sora_reply",
          strict: true,
          schema: soraReplySchema,
        },
      },
    });

    const payload = extractStructuredPayload(response);
    if (!payload) {
      console.error("[sora] empty structured response", {
        action: request.action,
        topic: request.topic,
      });
      return fallbackReply(request);
    }

    try {
      const parsed = parseStructuredReply(payload) as Partial<SoraReply> | null;
      if (!parsed) {
        console.error("[sora] structured response was not parseable", {
          action: request.action,
          topic: request.topic,
          payloadType: typeof payload,
        });
        return fallbackReply(request);
      }
      return sanitizeReply(parsed, request);
    } catch (error) {
      console.error("[sora] failed to parse structured response", {
        action: request.action,
        topic: request.topic,
        payload,
        error,
      });
      return fallbackReply(request);
    }
  } catch (error) {
    console.error("[sora] generateSoraReply failed", {
      action: request.action,
      topic: request.topic,
      model: getServerEnv().openAiModel,
      error,
    });

    throw error;
  }
};
