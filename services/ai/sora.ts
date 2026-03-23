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
    "そう感じてしまうのも、無理のないことだと思います。\n\nいま強く残っているのは、出来事そのものというより、まだ整理しきれていない感覚なのかもしれません。\n\n答えがないというより、いくつかの思いが重なったまま残っているようにも見えます。",
  followUpQuestion:
    request.action === "summarize"
      ? ""
      : "もしよかったら、いま一番引っかかっているのは、出来事そのものですか、それともそのあとに残った感覚でしょうか。",
  insight:
    "今日の小さな気づきとして、整理できないまま残っていること自体が、まだ大切なものの証なのかもしれません。",
  futureMessage:
    "今振り返ると、あの頃の私は答えを急いでいたというより、言葉を置ける場所を探していたのだと思います。",
  nextQuestion:
    "次に言葉にするとしたら、いま残っている感覚のどこから触れられそうでしょうか。",
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

const clampReplyText = (value: string, maxLength = 500) =>
  value.length > maxLength ? `${value.slice(0, maxLength).trim()}…` : value;

const stripQuestionTone = (value: string) =>
  value
    .replace(/[？?]+\s*/g, "。")
    .replace(/。+/g, "。")
    .trim();

const getLatestUserText = (request: ChatRequest) =>
  (request.answers.length > 0
    ? request.answers[request.answers.length - 1]
    : request.userInput
  ).trim();

const getLongJapaneseChunks = (value: string) => {
  const normalized = value.replace(/\s+/g, "");

  if (normalized.length < 10) {
    return [];
  }

  const chunks: string[] = [];
  for (let index = 0; index <= normalized.length - 10; index += 5) {
    chunks.push(normalized.slice(index, index + 10));
  }

  return chunks;
};

const looksTooMirrored = (candidate: string, source: string) => {
  const normalizedCandidate = candidate.replace(/\s+/g, "");
  const chunks = getLongJapaneseChunks(source);

  return chunks.some((chunk) => normalizedCandidate.includes(chunk));
};

const normalizeSingleQuestion = (value: string) => {
  const trimmed = value.trim();

  if (!trimmed) {
    return "";
  }

  const lines = trimmed
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const firstQuestionLine =
    lines.find((line) => /[？?]/.test(line)) ||
    lines[0];

  const firstQuestionIndex = firstQuestionLine.search(/[？?]/);

  if (firstQuestionIndex >= 0) {
    return firstQuestionLine.slice(0, firstQuestionIndex + 1).trim();
  }

  return firstQuestionLine;
};

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
      clampReplyText(
        getTrimmedString(summary?.topic) ||
          getTrimmedString(summary?.theme) ||
          fallback.topic,
      ),
    emotion: clampReplyText(getTrimmedString(summary?.emotion) || fallback.emotion),
    coreIssue: clampReplyText(
      getTrimmedString(summary?.coreIssue) || fallback.coreIssue,
    ),
    whatYouNeed: clampReplyText(
      getTrimmedString(summary?.whatYouNeed) || fallback.whatYouNeed,
    ),
    soraMessage: clampReplyText(
      getTrimmedString(summary?.soraMessage) || fallback.soraMessage,
    ),
    theme:
      clampReplyText(
        getTrimmedString(summary?.topic) ||
          getTrimmedString(summary?.theme) ||
          fallback.topic,
      ),
  };
};

const sanitizeReply = (reply: Partial<SoraReply>, request: ChatRequest): SoraReply => {
  const fallback = fallbackReply(request);
  const normalizedReply = getObject(reply);
  const latestUserText = getLatestUserText(request);

  const empathicMessageCandidate = clampReplyText(
    getTrimmedString(normalizedReply?.empathicMessage) || fallback.empathicMessage,
  );
  const insightCandidate = clampReplyText(
    stripQuestionTone(getTrimmedString(normalizedReply?.insight) || fallback.insight),
  );
  const futureMessageCandidate = clampReplyText(
    stripQuestionTone(
      getTrimmedString(normalizedReply?.futureMessage) || fallback.futureMessage,
    ),
  );

  return {
    empathicMessage:
      looksTooMirrored(empathicMessageCandidate, latestUserText)
        ? fallback.empathicMessage
        : empathicMessageCandidate,
    followUpQuestion:
      request.action === "summarize"
        ? ""
        : clampReplyText(
            normalizeSingleQuestion(
              getTrimmedString(normalizedReply?.followUpQuestion) ||
                fallback.followUpQuestion,
            ),
          ),
    insight: looksTooMirrored(insightCandidate, latestUserText)
      ? fallback.insight
      : insightCandidate,
    futureMessage: futureMessageCandidate,
    nextQuestion:
      clampReplyText(
        normalizeSingleQuestion(
          getTrimmedString(normalizedReply?.nextQuestion) || fallback.nextQuestion,
        ),
      ),
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
