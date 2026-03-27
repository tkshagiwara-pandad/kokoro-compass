import { NextResponse } from "next/server";
import { getServerEnv } from "@/lib/env";
import { generateSoraReply } from "@/services/ai/sora";
import { ChatRequest, ChatResponse, consultationTopics } from "@/types/consultation";

export const runtime = "nodejs";

const isValidRequest = (body: unknown): body is ChatRequest => {
  if (!body || typeof body !== "object") {
    return false;
  }

  const candidate = body as Partial<ChatRequest>;

  return (
    (candidate.action === "start" ||
      candidate.action === "continue" ||
      candidate.action === "summarize") &&
    typeof candidate.userInput === "string" &&
    Array.isArray(candidate.answers) &&
    consultationTopics.includes(candidate.topic as (typeof consultationTopics)[number])
  );
};

const exceedsInputLimit = (body: ChatRequest) =>
  body.userInput.trim().length > 1200 ||
  body.answers.some((answer) => answer.trim().length > 1200);

export async function POST(request: Request) {
  try {
    if (!getServerEnv().isOpenAiConfigured) {
      return NextResponse.json(
        {
          error:
            "現在、記録を整える準備をしています。時間を置いてもう一度お試しください。",
        },
        { status: 503 },
      );
    }

    const body = (await request.json()) as unknown;

    if (!isValidRequest(body)) {
      return NextResponse.json(
        { error: "不正なリクエストです。" },
        { status: 400 },
      );
    }

    if (exceedsInputLimit(body)) {
      return NextResponse.json(
        { error: "少し長いようです。1200文字以内でお願いします。" },
        { status: 400 },
      );
    }

    const reply = await generateSoraReply(body);
    const response: ChatResponse = { reply };

    return NextResponse.json(response);
  } catch (error) {
    console.error("[api/chat] request failed", error);

    return NextResponse.json(
      {
        error:
          "応答の生成に失敗しました。時間を置いてもう一度お試しください。",
      },
      { status: 500 },
    );
  }
}
