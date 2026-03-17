export const consultationTopics = [
  "恋愛",
  "仕事",
  "人間関係",
  "将来不安",
  "なんとなく不安",
] as const;

export type ConsultationTopic = (typeof consultationTopics)[number];

export type Sender = "user" | "sora";

export type ChatMessage = {
  id: string;
  sender: Sender;
  content: string;
  createdAt: string;
};

export type ReflectionSummary = {
  topic: string;
  emotion: string;
  coreIssue: string;
  whatYouNeed: string;
  soraMessage: string;
  theme?: string;
};

export type EmotionalState = {
  anxiety: number;
  fatigue: number;
  hope: number;
};

export const emotionTagOptions = [
  "少し楽になった",
  "まだモヤモヤ",
  "整理できた",
  "よくわからない",
] as const;

export type EmotionTag = (typeof emotionTagOptions)[number];

export const heartStateOptions = [
  "まだ混ざっている",
  "少し見えてきた",
  "言葉になってきた",
  "少し落ち着いた",
] as const;

export type HeartState = (typeof heartStateOptions)[number];

export type SoraReply = {
  empathicMessage: string;
  followUpQuestion: string;
  insight: string;
  futureMessage: string;
  nextQuestion: string;
  emotionalState: EmotionalState;
  reflectionSummary: ReflectionSummary;
};

export type ChatAction = "start" | "continue" | "summarize";

export type ChatRequest = {
  action: ChatAction;
  topic: ConsultationTopic;
  userInput: string;
  answers: string[];
  previousInsight?: string;
  previousTitle?: string;
};

export type ChatResponse = {
  reply: SoraReply;
};

export type ConsultationRecord = {
  id: string;
  createdAt: string;
  topic: ConsultationTopic;
  title?: string;
  userInput: string;
  emotion: string;
  emotionTag?: EmotionTag;
  heartState?: HeartState;
  summary: ReflectionSummary;
  insight: string;
  futureMessage: string;
  nextQuestion: string;
  emotionalState: EmotionalState;
  messages: ChatMessage[];
};

export type ConsultationStage = 1 | 2 | 3;
