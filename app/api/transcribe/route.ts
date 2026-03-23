import { NextResponse } from "next/server";
import OpenAI from "openai";
import { getOpenAiConfig, getServerEnv } from "@/lib/env";

export const runtime = "nodejs";

const TRANSCRIPTION_MODEL = "gpt-4o-mini-transcribe";

export async function POST(request: Request) {
  const env = getServerEnv();

  try {
    if (!env.isOpenAiConfigured) {
      console.error("[api/transcribe] OPENAI_API_KEY missing", {
        hasApiKey: Boolean(env.openAiApiKey),
      });

      return NextResponse.json(
        {
          error: "OPENAI_API_KEY missing",
          debugCode: "openai_api_key_missing",
        },
        { status: 500 },
      );
    }

    const formData = await request.formData();
    const audio = formData.get("audio");

    if (!(audio instanceof File) || audio.size === 0) {
      console.error("[api/transcribe] invalid audio payload", {
        isFile: audio instanceof File,
        fileType: audio instanceof File ? audio.type : null,
        fileSize: audio instanceof File ? audio.size : null,
        fileName: audio instanceof File ? audio.name : null,
        hasApiKey: Boolean(env.openAiApiKey),
      });

      return NextResponse.json(
        {
          error: "録音データを受け取れませんでした。もう一度お試しください。",
          debugCode: "invalid_audio_payload",
        },
        { status: 400 },
      );
    }

    console.log("[api/transcribe] received audio file", {
      fileType: audio.type,
      fileSize: audio.size,
      fileName: audio.name,
      hasApiKey: Boolean(env.openAiApiKey),
      model: TRANSCRIPTION_MODEL,
    });

    console.log("[api/transcribe] OpenAI request start", {
      model: TRANSCRIPTION_MODEL,
      fileType: audio.type,
      fileSize: audio.size,
      fileName: audio.name,
    });

    const client = new OpenAI({ apiKey: getOpenAiConfig().apiKey });
    const transcription = await client.audio.transcriptions.create({
      file: audio,
      model: TRANSCRIPTION_MODEL,
      language: "ja",
      prompt:
        "心の整理のための相談内容です。話し言葉の自然さを残しつつ、丁寧に文字起こししてください。",
    });

    console.log("[api/transcribe] OpenAI request success", {
      textLength: transcription.text?.length ?? 0,
    });

    const text = transcription.text?.trim();

    if (!text) {
      return NextResponse.json(
        {
          error: "音声を認識できませんでした。もう一度試してみてください。",
          debugCode: "transcribe_response_empty",
        },
        { status: 422 },
      );
    }

    return NextResponse.json({ text });
  } catch (error) {
    const openAiError = error as {
      name?: string;
      message?: string;
      stack?: string;
      status?: number;
      code?: string;
      type?: string;
      error?: unknown;
      response?: { status?: number; body?: unknown };
    };

    console.error("[api/transcribe] request failed", {
      name: openAiError?.name || "unknown_error",
      message: openAiError?.message || "unknown",
      stack: openAiError?.stack || null,
      status: openAiError?.status || openAiError?.response?.status || null,
      code: openAiError?.code || null,
      type: openAiError?.type || null,
      responseBody: openAiError?.response?.body || openAiError?.error || null,
    });

    return NextResponse.json(
      {
        error: "transcribe failed",
        debugCode: "openai_request_failed",
      },
      { status: openAiError?.status || openAiError?.response?.status || 503 },
    );
  }
}
