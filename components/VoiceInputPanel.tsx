"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { requestTranscription } from "@/lib/api";

type VoiceInputPanelProps = {
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
  maxLength?: number;
  introMessage?: string;
  helperMessage?: string;
  transcriptLabel?: string;
  transcriptHint?: string;
};

type VoiceStatus = "idle" | "requestingPermission" | "recording" | "transcribing" | "error";

type SupportInfo = {
  hasGetUserMedia: boolean;
  hasMediaRecorder: boolean;
  supportedMimeTypes: string[];
};

const MIN_AUDIO_BYTES = 1024;

const getSupportedMimeTypes = (): string[] => {
  if (
    typeof window === "undefined" ||
    typeof MediaRecorder === "undefined" ||
    typeof MediaRecorder.isTypeSupported !== "function"
  ) {
    return [];
  }

  const candidates = ["audio/mp4", "audio/webm;codecs=opus", "audio/webm"];
  return candidates.filter((candidate) => MediaRecorder.isTypeSupported(candidate));
};

const getVoiceErrorMessage = (error: unknown) => {
  if (error instanceof DOMException) {
    switch (error.name) {
      case "NotAllowedError":
      case "PermissionDeniedError":
        return "マイクの使用が許可されていません。ブラウザ設定からマイクを許可してください。";
      case "NotFoundError":
      case "DevicesNotFoundError":
        return "マイクが見つかりませんでした。";
      case "NotReadableError":
        return "マイクを利用できませんでした。他のアプリで使用中でないか確認してください。";
      case "AbortError":
        return "音声入力を始められませんでした。少し時間を置いてもう一度お試しください。";
      case "OverconstrainedError":
        return "マイクの設定を確認できませんでした。ブラウザ設定を見直してください。";
      case "NotSupportedError":
      case "TypeError":
        return "このブラウザでは音声入力が利用できない可能性があります。Safari または最新版ブラウザでお試しください。";
      default:
        break;
    }
  }

  if (error instanceof Error) {
    const message = `${error.name} ${error.message}`.toLowerCase();
    if (message.includes("permission") || message.includes("denied") || message.includes("allowed")) {
      return "マイクの使用が許可されていません。ブラウザ設定からマイクを許可してください。";
    }
  }

  return "音声入力を始められませんでした。少し時間を置いてもう一度お試しください。";
};

const getMimeExtension = (mimeType: string) => {
  if (mimeType.includes("mp4") || mimeType.includes("m4a")) {
    return "m4a";
  }

  return "webm";
};

export const VoiceInputPanel = ({
  value,
  onChange,
  disabled,
  maxLength = 1200,
  introMessage,
  helperMessage,
  transcriptLabel,
  transcriptHint,
}: VoiceInputPanelProps) => {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const selectedMimeTypeRef = useRef("");
  const [status, setStatus] = useState<VoiceStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const supportInfo = useMemo<SupportInfo>(() => {
    const info = {
      hasGetUserMedia:
        typeof window !== "undefined" &&
        typeof navigator !== "undefined" &&
        Boolean(navigator.mediaDevices?.getUserMedia),
      hasMediaRecorder: typeof window !== "undefined" && typeof MediaRecorder !== "undefined",
      supportedMimeTypes: getSupportedMimeTypes(),
    };

    if (process.env.NODE_ENV !== "production") {
      // Debug log for Safari voice input support.
      console.log("[VoiceInputPanel] support check", info);
    }

    return info;
  }, []);

  const isSupported = supportInfo.hasGetUserMedia && supportInfo.hasMediaRecorder;
  const isRecording = status === "recording";
  const isTranscribing = status === "transcribing";
  const isPreparing = status === "requestingPermission";

  const stopTracks = () => {
    streamRef.current?.getTracks().forEach((track) => {
      try {
        track.stop();
      } catch {
        // Ignore double-stop errors.
      }
    });
    streamRef.current = null;
  };

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        try {
          mediaRecorderRef.current.stop();
        } catch {
          // Ignore stop errors during unmount.
        }
      }
      stopTracks();
    };
  }, []);

  const startRecording = async () => {
    if (!isSupported || disabled || isRecording || isTranscribing || isPreparing) {
      return;
    }

    setErrorMessage("");
    setStatus("requestingPermission");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = supportInfo.supportedMimeTypes[0] || "";

      if (process.env.NODE_ENV !== "production") {
        // Debug log for selected recorder format.
        console.log("[VoiceInputPanel] selected mimeType", mimeType || "(default)");
      }

      const mediaRecorder =
        mimeType && typeof MediaRecorder !== "undefined"
          ? new MediaRecorder(stream, { mimeType })
          : new MediaRecorder(stream);

      streamRef.current = stream;
      mediaRecorderRef.current = mediaRecorder;
      selectedMimeTypeRef.current = mimeType || mediaRecorder.mimeType || "";
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onerror = (event) => {
        if (process.env.NODE_ENV !== "production") {
          // Debug log for MediaRecorder runtime errors.
          console.log("[VoiceInputPanel] MediaRecorder error", event);
        }

        setErrorMessage(
          "マイクを利用できませんでした。他のアプリで使用中でないか確認してください。",
        );
        setStatus("error");
        stopTracks();
      };

      mediaRecorder.onstop = async () => {
        stopTracks();

        const blob = new Blob(chunksRef.current, {
          type: selectedMimeTypeRef.current || "audio/webm",
        });
        chunksRef.current = [];

        if (blob.size < MIN_AUDIO_BYTES) {
          setErrorMessage("音声を認識できませんでした。もう一度試してみてください。");
          setStatus("error");
          return;
        }

        try {
          setStatus("transcribing");
          setErrorMessage("");

          const normalizedBlob = new Blob([blob], {
            type: selectedMimeTypeRef.current || blob.type || "audio/webm",
          });

          const text = await requestTranscription(normalizedBlob);

          if (!text.trim()) {
            setErrorMessage("音声を認識できませんでした。もう一度試してみてください。");
            setStatus("error");
            return;
          }

          const nextValue = value.trim() ? `${value.trim()}\n${text.trim()}` : text.trim();
          onChange(nextValue);
          setStatus("idle");
        } catch (transcriptionError) {
          if (process.env.NODE_ENV !== "production") {
            // Debug log for transcribe API failures.
            console.log("[VoiceInputPanel] transcribe API error", transcriptionError);
          }

          setErrorMessage(
            transcriptionError instanceof Error
              ? transcriptionError.message
              : "音声を認識できませんでした。もう一度試してみてください。",
          );
          setStatus("error");
        }
      };

      mediaRecorder.start();
      setStatus("recording");
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        // Debug log for getUserMedia failures.
        console.log("[VoiceInputPanel] getUserMedia error", {
          name: error instanceof Error ? error.name : "unknown",
          message: error instanceof Error ? error.message : String(error),
        });
      }

      setErrorMessage(getVoiceErrorMessage(error));
      setStatus("error");
      stopTracks();
    }
  };

  const stopRecording = () => {
    const recorder = mediaRecorderRef.current;

    if (!recorder || recorder.state === "inactive") {
      return;
    }

    recorder.stop();
  };

  const handlePrimaryAction = () => {
    if (isRecording) {
      stopRecording();
      return;
    }

    void startRecording();
  };

  const statusMessage = (() => {
    if (!isSupported) {
      return "このブラウザでは音声入力が利用できない可能性があります。Safari または最新版ブラウザでお試しください。";
    }

    if (status === "requestingPermission") {
      return "マイクを準備しています";
    }

    if (status === "recording") {
      return "話し終えたらもう一度押してください";
    }

    if (status === "transcribing") {
      return "言葉を文字にしています";
    }

    if (value.trim()) {
      return "音声を入力しました";
    }

    return "";
  })();

  return (
    <div className="space-y-2">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={handlePrimaryAction}
          disabled={disabled || !isSupported || isTranscribing || isPreparing}
          className={`min-h-[48px] w-full rounded-full px-5 py-3 text-sm transition sm:w-auto ${
            isRecording
              ? "border border-iris/55 bg-white text-plum shadow-soft"
              : "bg-plum text-white hover:bg-ink disabled:cursor-not-allowed disabled:bg-lilac disabled:text-white/75"
          }`}
        >
          {isRecording ? "録音を止める" : isPreparing ? "マイクを準備しています" : "録音を始める"}
        </button>

        {value.trim() && !isRecording && !isTranscribing && !isPreparing ? (
          <button
            type="button"
            onClick={() => {
              setErrorMessage("");
              setStatus("idle");
              onChange("");
            }}
            disabled={disabled}
            className="text-sm text-stone transition hover:text-plum"
          >
            録り直す
          </button>
        ) : null}
      </div>

      <div className="rounded-[20px] border border-iris/24 bg-white/78 px-4 py-2.5 sm:px-5">
        <p className="text-sm leading-6 text-stone">
          {introMessage || "今の気持ちを、そのまま話してみてください。"}
        </p>
        <p className="mt-1 text-xs leading-5 text-stone/74">
          {helperMessage || "声は文字になってから、静かに見直せます。"}
        </p>
      </div>

      {statusMessage ? (
        <div className="rounded-2xl border border-lilac/30 bg-mist/18 px-4 py-2">
          <p className={`text-sm leading-6 ${status === "recording" ? "text-plum" : "text-stone"}`}>
            {statusMessage}
          </p>
        </div>
      ) : null}

      {errorMessage ? (
        <p className="rounded-2xl border border-rose-200 bg-rose-50/90 px-4 py-3 text-sm leading-6 text-rose-700">
          {errorMessage}
        </p>
      ) : null}

      <label className="block">
        <span className="mb-2 block text-sm text-ink/80">{transcriptLabel || "話した内容"}</span>
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          rows={4}
          maxLength={maxLength}
          placeholder="思いついたことがここに入ります。必要なら少し整えてから、そのまま送れます。"
          className="field-base min-h-[124px] border-iris/42 bg-white shadow-[0_12px_28px_rgba(137,119,154,0.07)] sm:min-h-[140px]"
          disabled={disabled || isTranscribing}
        />
      </label>

      {value.trim() ? (
        <p className="text-xs leading-5 text-stone/70">
          {transcriptHint || "内容を整えたら、そのまま送れます。"}
        </p>
      ) : null}
    </div>
  );
};
