import { NextResponse } from "next/server";
import OpenAI from "openai";
import { getOpenAiConfig, getServerEnv } from "@/lib/env";

export const runtime = "nodejs";

const TRANSCRIPTION_MODEL = "gpt-4o-mini-transcribe";

export async function POST(request: Request) {
  try {
    if (!getServerEnv().isOpenAiConfigured) {
      return NextResponse.json(
        {
          error:
            "現在、音声入力を利用できません。少し時間を置いてもう一度お試しください。",
        },
        { status: 503 },
      );
    }

    const formData = await request.formData();
    const audio = formData.get("audio");

    if (!(audio instanceof File) || audio.size === 0) {
      return NextResponse.json(
        { error: "録音データを受け取れませんでした。もう一度お試しください。" },
        { status: 400 },
      );
    }

    const client = new OpenAI({ apiKey: getOpenAiConfig().apiKey });
    const transcription = await client.audio.transcriptions.create({
      file: audio,
      model: TRANSCRIPTION_MODEL,
      language: "ja",
      prompt:
        "心の整理のための相談内容です。話し言葉の自然さを残しつつ、丁寧に文字起こししてください。",
    });

    const text = transcription.text?.trim();

    if (!text) {
      return NextResponse.json(
        { error: "音声を認識できませんでした。もう一度試してみてください。" },
        { status: 422 },
      );
    }

    return NextResponse.json({ text });
  } catch (error) {
    console.error("[api/transcribe] request failed", error);

    return NextResponse.json(
      {
        error: "音声を認識できませんでした。もう一度試してみてください。",
      },
      { status: 500 },
    );
  }
}
