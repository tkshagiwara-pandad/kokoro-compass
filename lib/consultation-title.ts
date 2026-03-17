import { ConsultationRecord, ConsultationTopic, ReflectionSummary } from "@/types/consultation";

const topicFallbackTitles: Record<ConsultationTopic, string> = {
  恋愛: "まだ手放せない気持ち",
  仕事: "このままでいいのか",
  人間関係: "距離の取り方に迷う",
  将来不安: "先の見えなさの中で",
  なんとなく不安: "まだ輪郭のない不安",
};

const normalizeTitleSource = (value: string) =>
  value
    .replace(/^今日の小さな気づきとして、?/, "")
    .replace(/^もしかすると、?/, "")
    .replace(/[。.!！?？].*$/, "")
    .replace(/かもしれません$/, "")
    .replace(/のようです$/, "")
    .replace(/ようです$/, "")
    .replace(/\s+/g, " ")
    .trim();

const clampTitle = (value: string) => value.slice(0, 20).trim();

export const buildConsultationTitle = ({
  topic,
  insight,
  userInput,
  summary,
}: {
  topic: ConsultationTopic;
  insight?: string;
  userInput: string;
  summary?: ReflectionSummary | null;
}) => {
  const candidates = [
    insight,
    summary?.topic,
    summary?.coreIssue,
    userInput,
  ]
    .map((value) => normalizeTitleSource(value || ""))
    .filter((value) => value.length >= 6);

  const candidate = candidates.find((value) => value.length <= 20) || candidates[0];

  if (candidate) {
    return clampTitle(candidate);
  }

  return topicFallbackTitles[topic];
};

export const getRecordDisplayTitle = (record: ConsultationRecord) =>
  record.title ||
  buildConsultationTitle({
    topic: record.topic,
    insight: record.insight,
    userInput: record.userInput,
    summary: record.summary,
  });
