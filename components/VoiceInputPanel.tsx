"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { requestTranscription } from "@/lib/api";

type VoiceInputPanelProps = {
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
  introMessage?: string;
  helperMessage?: string;
  transcriptLabel?: string;
  transcriptHint?: string;
};

const MIN_AUDIO_BYTES = 1024;

const getSupportedMimeType = () => {
  if (typeof window === "undefined" || typeof MediaRecorder === "undefined") {
    return "";
  }

  const candidates = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/mp4",
  ];

  return candidates.find((candidate) => MediaRecorder.isTypeSupported(candidate)) || "";
};

export const VoiceInputPanel = ({
  value,
  onChange,
  disabled,
  introMessage,
  helperMessage,
  transcriptLabel,
  transcriptHint,
}: VoiceInputPanelProps) => {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [error, setError] = useState("");

  const isSupported = useMemo(
    () =>
      typeof window !== "undefined" &&
      typeof navigator !== "undefined" &&
      Boolean(navigator.mediaDevices?.getUserMedia) &&
      typeof MediaRecorder !== "undefined",
    [],
  );

  const stopTracks = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  };

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current?.state !== "inactive") {
        mediaRecorderRef.current?.stop();
      }
      stopTracks();
    };
  }, []);

  const startRecording = async () => {
    if (!isSupported || disabled || isRecording || isTranscribing) {
      return;
    }

    try {
      setError("");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = getSupportedMimeType();
      const mediaRecorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);

      streamRef.current = stream;
      chunksRef.current = [];
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onerror = () => {
        setError("録音をうまく始められませんでした。もう一度お試しください。");
        setIsRecording(false);
        stopTracks();
      };

      mediaRecorder.onstop = async () => {
        stopTracks();
        setIsRecording(false);

        const blob = new Blob(chunksRef.current, {
          type: mimeType || "audio/webm",
        });
        chunksRef.current = [];

        if (blob.size < MIN_AUDIO_BYTES) {
          setError("声がまだ短すぎるようです。もう少しだけ話してみてください。");
          return;
        }

        try {
          setIsTranscribing(true);
          setError("");
          const text = await requestTranscription(blob);

          if (!text.trim()) {
            setError("声をうまく文字に整えられませんでした。もう一度お試しください。");
            return;
          }

          const nextValue = value.trim() ? `${value.trim()}\n${text.trim()}` : text.trim();
          onChange(nextValue);
        } catch (transcriptionError) {
          setError(
            transcriptionError instanceof Error
              ? transcriptionError.message
              : "文字起こしに失敗しました。時間を置いてもう一度お試しください。",
          );
        } finally {
          setIsTranscribing(false);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch {
      setError("マイクを使えませんでした。設定を確認して、もう一度お試しください。");
      stopTracks();
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
  };

  const handlePrimaryAction = () => {
    if (isRecording) {
      stopRecording();
      return;
    }

    void startRecording();
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={handlePrimaryAction}
          disabled={disabled || !isSupported || isTranscribing}
          className={`min-h-[48px] w-full rounded-full px-5 py-3 text-sm transition sm:w-auto ${
            isRecording
              ? "border border-iris/55 bg-white text-plum shadow-soft"
              : "bg-plum text-white hover:bg-ink disabled:cursor-not-allowed disabled:bg-lilac disabled:text-white/75"
          }`}
        >
          {isRecording ? "録音を止める" : "録音を始める"}
        </button>

        {value.trim() && !isRecording && !isTranscribing ? (
          <button
            type="button"
            onClick={() => {
              setError("");
              onChange("");
            }}
            disabled={disabled}
            className="text-sm text-stone transition hover:text-plum"
          >
            もう一度話す
          </button>
        ) : null}
      </div>

      <div className="rounded-[20px] border border-iris/24 bg-white/78 px-4 py-2.5 sm:px-5">
        <p className="text-sm leading-6 text-stone">
          {introMessage ||
            "今の気持ちを、そのまま話してみてください。"}
        </p>
        <p className="mt-1 text-xs leading-5 text-stone/74">
          {helperMessage ||
            "声は一度文字に整えてから表示されます。必要なら少し直してから送れます。"}
        </p>
      </div>

      <div className="rounded-2xl border border-lilac/30 bg-mist/18 px-4 py-2">
        {!isSupported ? (
          <p className="text-sm leading-6 text-stone">
            この環境では音声入力を使えないようです。書くモードから相談できます。
          </p>
        ) : isRecording ? (
          <p className="text-sm leading-6 text-plum">
            いま聞き取っています。話し終えたら止めてください。
          </p>
        ) : isTranscribing ? (
          <p className="text-sm leading-6 text-stone">
            声を文字に整えています。少しだけお待ちください。
          </p>
        ) : value.trim() ? (
          <p className="text-sm leading-6 text-stone">
            文字になった内容を見直して、そのまま次へ進めます。
          </p>
        ) : (
          <p className="text-sm leading-6 text-stone">
            話した内容は、この下に文字として置かれていきます。
          </p>
        )}
      </div>

      {error ? (
        <p className="rounded-2xl border border-rose-200 bg-rose-50/90 px-4 py-3 text-sm leading-6 text-rose-700">
          {error}
        </p>
      ) : null}

      <label className="block">
        <span className="mb-2 block text-sm text-ink/80">
          {transcriptLabel || "文字にした内容"}
        </span>
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          rows={4}
          placeholder="話した内容がここに表示されます。必要なら少し整えてから、そのままソラに話せます。"
          className="field-base min-h-[124px] border-iris/42 bg-white shadow-[0_12px_28px_rgba(137,119,154,0.07)] sm:min-h-[140px]"
          disabled={disabled || isTranscribing}
        />
      </label>

      {value.trim() ? (
        <p className="text-xs leading-5 text-stone/70">
          {transcriptHint ||
            "内容を整えたら、そのまま相談を始められます。"}
        </p>
      ) : null}
    </div>
  );
};
