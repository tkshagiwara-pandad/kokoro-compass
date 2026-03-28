"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChatPanel } from "@/components/ChatPanel";
import { ConsultationForm } from "@/components/ConsultationForm";
import { FeedbackButton } from "@/components/FeedbackButton";
import { LayoutShell } from "@/components/LayoutShell";
import { NoticePanel } from "@/components/NoticePanel";
import { SummaryPanel } from "@/components/SummaryPanel";
import { trackEvent } from "@/lib/analytics";
import { requestSoraReply } from "@/lib/api";
import { createChatMessage } from "@/lib/chat";
import { buildConsultationTitle } from "@/lib/consultation-title";
import { FEEDBACK_FORM_URL } from "@/lib/config";
import { pickSoraClosingLine, pickSoraPresenceLine } from "@/lib/sora-presence";
import {
  clearDraft,
  incrementSessionCount,
  loadDraft,
  loadHasSeenIntro,
  loadHistory,
  saveDraft,
  saveHasSeenIntro,
  saveHistory,
  takeActiveRecordId,
} from "@/lib/storage";
import {
  ChatMessage,
  ChatRequest,
  ConsultationRecord,
  ConsultationStage,
  ConsultationTopic,
  EmotionalState,
  ReflectionSummary,
  SoraReply,
} from "@/types/consultation";

const INITIAL_TOPIC: ConsultationTopic = "恋愛";
const MAX_INPUT_LENGTH = 1200;

const formatRelativeDay = (createdAt: string) => {
  const diff = Date.now() - new Date(createdAt).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days <= 0) {
    return "今日";
  }

  if (days === 1) {
    return "1日前";
  }

  return `${days}日前`;
};

const isSameDay = (left: Date, right: Date) =>
  left.getFullYear() === right.getFullYear() &&
  left.getMonth() === right.getMonth() &&
  left.getDate() === right.getDate();

export const ConsultationExperience = () => {
  const router = useRouter();
  const stepTwoRef = useRef<HTMLDivElement | null>(null);
  const stepTwoResponseRef = useRef<HTMLDivElement | null>(null);
  const lastStepTwoScrollKeyRef = useRef("");
  const scrollTimeoutRef = useRef<number | null>(null);
  const [topic, setTopic] = useState<ConsultationTopic>(INITIAL_TOPIC);
  const [inputMode, setInputMode] = useState<"text" | "voice">("text");
  const [userInput, setUserInput] = useState("");
  const [replyInput, setReplyInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [summary, setSummary] = useState<ReflectionSummary | null>(null);
  const [history, setHistory] = useState<ConsultationRecord[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [formError, setFormError] = useState("");
  const [chatError, setChatError] = useState("");
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState("");
  const [saveCompleted, setSaveCompleted] = useState(false);
  const [savedPreview, setSavedPreview] = useState("");
  const [savedAtLabel, setSavedAtLabel] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [lastRequest, setLastRequest] = useState<ChatRequest | null>(null);
  const [latestReply, setLatestReply] = useState<SoraReply | null>(null);
  const [showIntroCard, setShowIntroCard] = useState(false);
  const saveFeedbackTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const loadedHistory = loadHistory();
    setHistory(loadedHistory);
    setShowIntroCard(!loadHasSeenIntro());

    const activeRecordId = takeActiveRecordId();
    if (activeRecordId) {
      const activeRecord = loadedHistory.find((record) => record.id === activeRecordId);
      if (activeRecord) {
        applyRecord(activeRecord);
        return;
      }
    }

    const draft = loadDraft();
    if (draft) {
      setTopic(draft.topic);
      setInputMode(draft.inputMode);
      setUserInput(draft.userInput);
      setReplyInput(draft.replyInput);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        window.clearTimeout(scrollTimeoutRef.current);
      }
      if (saveFeedbackTimeoutRef.current) {
        window.clearTimeout(saveFeedbackTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (summary) {
      return;
    }

    saveDraft({
      topic,
      inputMode,
      userInput,
      replyInput,
    });
  }, [inputMode, replyInput, summary, topic, userInput]);

  const currentStage: ConsultationStage = summary
    ? 3
    : messages.length > 0
      ? 2
      : 1;

  const canReply = useMemo(
    () => messages.length > 0 && answers.length < 2 && summary === null,
    [answers.length, messages.length, summary],
  );

  const canSummarize = useMemo(
    () => messages.length > 0 && answers.length === 2 && summary === null,
    [answers.length, messages.length, summary],
  );

  const isStartEnabled = userInput.trim().length > 0;

  const todayRecordsCount = useMemo(() => {
    const today = new Date();

    return history.filter((record) => isSameDay(new Date(record.createdAt), today)).length;
  }, [history]);

  const todayLabel = useMemo(
    () =>
      new Intl.DateTimeFormat("ja-JP", {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "short",
      }).format(new Date()),
    [],
  );

  const todayStatusText =
    todayRecordsCount > 0 ? "今日はすでにひとつ残っています。" : "今日はまだ何も残っていません。";

  const startButtonLabel =
    todayRecordsCount > 0 ? "今日の記録をもうひとつ残す" : "記録を残す";

  const previousMemory = useMemo(() => {
    const latestRecord = history[0];

    if (!latestRecord) {
      return null;
    }

    return {
      title: latestRecord.title || buildConsultationTitle({
        topic: latestRecord.topic,
        insight: latestRecord.insight,
        userInput: latestRecord.userInput,
        summary: latestRecord.summary,
      }),
      insight: latestRecord.insight || latestRecord.userInput,
      label: `${formatRelativeDay(latestRecord.createdAt)}の気づき`,
    };
  }, [history]);

  const reflectionShift = useMemo(() => {
    const previousRecord = history[0];

    if (!previousRecord || currentStage === 1) {
      return null;
    }

    if (previousRecord.topic === topic && userInput.trim().length > previousRecord.userInput.trim().length + 20) {
      return `前回よりも「${topic}」について、もう少し詳しく言葉にできているのかもしれません。`;
    }

    if (previousRecord.topic === topic) {
      return `前回も「${topic}」について立ち止まっていました。今日は、その迷いを少し別の角度から見つめられているのかもしれません。`;
    }

    return null;
  }, [currentStage, history, topic, userInput]);

  const soraPresenceLine = useMemo(
    () => pickSoraPresenceLine(`${topic}:${userInput}:${messages.length}`),
    [messages.length, topic, userInput],
  );

  const soraClosingLine = useMemo(
    () =>
      pickSoraClosingLine(
        `${topic}:${latestReply?.insight || ""}:${summary?.topic || ""}:${messages.length}`,
      ),
    [latestReply?.insight, messages.length, summary?.topic, topic],
  );

  const messageHint = useMemo(() => {
    if (summary) {
      return "記録は整いました。残した言葉を見返しながら、いまの気持ちの輪郭をたどれます。";
    }

    if (isLoading) {
      return "ソラが言葉を整えています。少しだけ、このままでお待ちください。";
    }

    if (messages.length === 0) {
      return "心に残っていることを書くと、ソラがやさしい問いをひとつずつ返します。";
    }

    if (answers.length === 0) {
      return "最初の問いに、いま一番近い気持ちを返してみてください。";
    }

    if (answers.length === 1) {
      return "最後に、もうひとつだけ。いま残っている気持ちを少し言葉にしてみてください。";
    }

    return "ここまでで少し整理できたら、このまま心の整理を見ることもできます。続けても、ここで区切っても大丈夫です。";
  }, [answers.length, isLoading, messages.length, summary]);

  const resetAll = () => {
    setTopic(INITIAL_TOPIC);
    setInputMode("text");
    setUserInput("");
    setReplyInput("");
    setMessages([]);
    setSummary(null);
    setAnswers([]);
    setFormError("");
    setChatError("");
    setSaveError("");
    setSaveSuccess("");
    setSaveCompleted(false);
    setSavedPreview("");
    setSavedAtLabel("");
    setIsLoading(false);
    setLastRequest(null);
    setLatestReply(null);
    clearDraft();
  };

  const handleUserInputChange = (value: string) => {
    const nextValue = value.slice(0, MAX_INPUT_LENGTH);
    setUserInput(nextValue);

    if (value.length > MAX_INPUT_LENGTH) {
      setFormError("少し長いようです。1200文字以内でお願いします。");
      return;
    }

    setFormError((current) =>
      current === "少し長いようです。1200文字以内でお願いします。" ? "" : current,
    );
  };

  const handleReplyInputChange = (value: string) => {
    const nextValue = value.slice(0, MAX_INPUT_LENGTH);
    setReplyInput(nextValue);

    if (value.length > MAX_INPUT_LENGTH) {
      setChatError("少し長いようです。1200文字以内でお願いします。");
      return;
    }

    setChatError((current) =>
      current === "少し長いようです。1200文字以内でお願いします。" ? "" : current,
    );
  };

  const applyRecord = (record: ConsultationRecord) => {
    setTopic(record.topic);
    setInputMode("text");
    setUserInput(record.userInput);
    setMessages(record.messages);
    setSummary(record.summary);
    setLatestReply({
      empathicMessage: "",
      followUpQuestion: "",
      insight: record.insight,
      futureMessage: record.futureMessage,
      nextQuestion: record.nextQuestion,
      emotionalState: record.emotionalState,
      reflectionSummary: record.summary,
    });
    setAnswers(
      record.messages
        .filter((message) => message.sender === "user")
        .slice(1)
        .map((message) => message.content),
    );
    setReplyInput("");
    setFormError("");
    setChatError("");
    setSaveError("");
    setSaveSuccess("");
    setSaveCompleted(false);
  };

  const fetchSora = async (payload: ChatRequest) => {
    setIsLoading(true);
    setLastRequest(payload);

    try {
      return await requestSoraReply(payload);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStart = async () => {
    if (!userInput.trim()) {
      setFormError("心に残っていることを書いてください。");
      return;
    }

    if (userInput.trim().length > MAX_INPUT_LENGTH) {
      setFormError("少し長いようです。1200文字以内でお願いします。");
      return;
    }

    setFormError("");
    setChatError("");
    setSaveError("");
    setSaveSuccess("");
    setSaveCompleted(false);
    saveHasSeenIntro();
    setShowIntroCard(false);

    try {
      const initialUserMessage = createChatMessage("user", userInput.trim());
      const response = await fetchSora({
        action: "start",
        topic,
        userInput: userInput.trim(),
        answers: [],
        previousInsight: previousMemory?.insight,
        previousTitle: previousMemory?.title,
      });
      incrementSessionCount();
      trackEvent("consultation_started", { topic });
      setLatestReply(response.reply);
      const soraMessage = createChatMessage(
        "sora",
        `${response.reply.empathicMessage}\n\n${response.reply.followUpQuestion}`.trim(),
      );

      setMessages([initialUserMessage, soraMessage]);
      setAnswers([]);
      setReplyInput("");
      setSummary(null);
      setChatError("");
      scrollToStepTwo();
    } catch (error) {
      setChatError(
        error instanceof Error
          ? error.message
          : "うまく応答を作れませんでした。少し時間を置いてもう一度お試しください。",
      );
      setSummary(null);
    }
  };

  const handleNext = async () => {
    if (!replyInput.trim()) {
      setChatError("返したい言葉を書いてから続けてください。");
      return;
    }

    if (replyInput.trim().length > MAX_INPUT_LENGTH) {
      setChatError("少し長いようです。1200文字以内でお願いします。");
      return;
    }

    setChatError("");

    const newAnswer = replyInput.trim();
    const userMessage = createChatMessage("user", newAnswer);
    const nextAnswers = [...answers, newAnswer];

    try {
      const response = await fetchSora({
        action: "continue",
        topic,
        userInput: userInput.trim(),
        answers: nextAnswers,
        previousInsight: previousMemory?.insight,
        previousTitle: previousMemory?.title,
      });
      const soraMessage = createChatMessage(
        "sora",
        `${response.reply.empathicMessage}\n\n${response.reply.followUpQuestion}`.trim(),
      );

      setMessages((current) => [...current, userMessage, soraMessage]);
      setAnswers(nextAnswers);
      setReplyInput("");
      setSummary(null);
      setChatError("");
      setLatestReply(response.reply);
    } catch (error) {
      setChatError(
        error instanceof Error
          ? error.message
          : "うまく応答を作れませんでした。少し時間を置いてもう一度お試しください。",
      );
    }
  };

  const handleSummarize = async () => {
    if (!replyInput.trim()) {
      setChatError("最後の言葉を書いてから、今日の記録を開いてください。");
      return;
    }

    if (replyInput.trim().length > MAX_INPUT_LENGTH) {
      setChatError("少し長いようです。1200文字以内でお願いします。");
      return;
    }

    const finalAnswer = replyInput.trim();
    const finalUserMessage = createChatMessage("user", finalAnswer);
    const nextAnswers = [...answers, finalAnswer];

    try {
      const response = await fetchSora({
        action: "summarize",
        topic,
        userInput: userInput.trim(),
        answers: nextAnswers,
        previousInsight: previousMemory?.insight,
        previousTitle: previousMemory?.title,
      });

      setChatError("");
      setMessages((current) => [...current, finalUserMessage]);
      setAnswers(nextAnswers);
      setReplyInput("");
      setSummary(response.reply.reflectionSummary);
      setSaveSuccess("");
      setSaveError("");
      setSaveCompleted(false);
      setLatestReply(response.reply);
      clearDraft();
      trackEvent("consultation_completed", { topic, answersCount: nextAnswers.length });
    } catch (error) {
      setChatError(
        error instanceof Error
          ? error.message
          : "うまく応答を作れませんでした。少し時間を置いてもう一度お試しください。",
      );
    }
  };

  const handleSave = () => {
    if (!summary) {
      return;
    }

    const record: ConsultationRecord = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      topic,
      title: buildConsultationTitle({
        topic,
        insight: latestReply?.insight,
        userInput: userInput.trim(),
        summary,
      }),
      userInput: userInput.trim(),
      emotion: summary.emotion,
      summary,
      insight:
        latestReply?.insight ||
        "今日の小さな気づきとして、まず安心できる感覚を大切にすることが助けになるかもしれません。",
      futureMessage:
        latestReply?.futureMessage ||
        "焦らなくて大丈夫です。今のあなたは、ちゃんと自分の心に近づいています。",
      nextQuestion:
        latestReply?.nextQuestion ||
        "本当は、どんな時間があると少しほっとできるでしょうか。",
      emotionalState: latestReply?.emotionalState || {
        anxiety: 6,
        fatigue: 5,
        hope: 4,
      },
      messages,
    };

    try {
      saveHistory([record, ...history]);
      setHistory(loadHistory());
      setSaveSuccess("言葉を保存しました");
      setSaveError("");
      setSaveCompleted(true);
      setSavedPreview(record.userInput.trim().replace(/\s+/g, " ").slice(0, 90));
      setSavedAtLabel(
        new Intl.DateTimeFormat("ja-JP", {
          hour: "numeric",
          minute: "2-digit",
        }).format(new Date(record.createdAt)),
      );
      if (saveFeedbackTimeoutRef.current) {
        window.clearTimeout(saveFeedbackTimeoutRef.current);
      }
      clearDraft();
      saveFeedbackTimeoutRef.current = window.setTimeout(() => {
        setSaveSuccess("");
      }, 1500);
    } catch {
      setSaveError("保存に失敗しました。ブラウザの設定を確認してください。");
      setSaveSuccess("");
      setSaveCompleted(false);
    }
  };

  const handleSelectHistory = (record: ConsultationRecord) => {
    applyRecord(record);
  };

  const handleOpenHistory = () => {
    router.push("/log");
  };

  const handleRetry = async () => {
    if (!lastRequest || isLoading) {
      return;
    }

    setChatError("");

    if (lastRequest.action === "start") {
      await handleStart();
      return;
    }

    if (lastRequest.action === "continue") {
      await handleNext();
      return;
    }

    await handleSummarize();
  };

  const scrollToStepTwo = () => {
    requestAnimationFrame(() => {
      stepTwoRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  const scrollToStepTwoResponse = () => {
    if (typeof window === "undefined") {
      return;
    }

    const element = stepTwoResponseRef.current;

    if (!element) {
      scrollToStepTwo();
      return;
    }

    if (scrollTimeoutRef.current) {
      window.clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = window.setTimeout(() => {
      const top = window.scrollY + element.getBoundingClientRect().top - 12;

      window.scrollTo({
        top: Math.max(top, 0),
        behavior: "smooth",
      });
    }, 100);
  };

  useEffect(() => {
    if (isLoading || currentStage !== 2 || !latestReply) {
      return;
    }

    const scrollKey = [
      messages.length,
      latestReply.empathicMessage,
      latestReply.followUpQuestion,
      latestReply.insight,
    ].join("::");

    if (lastStepTwoScrollKeyRef.current === scrollKey) {
      return;
    }

    lastStepTwoScrollKeyRef.current = scrollKey;
    scrollToStepTwoResponse();
  }, [currentStage, isLoading, latestReply, messages.length]);

  return (
    <LayoutShell
      eyebrow="Kokoro Compass"
      title="こころの羅針盤"
      description="今日の言葉を少し残して、あとから静かにたどるための場所です。"
      backLink={{ href: "/", label: "トップへ戻る" }}
    >
      <main className="space-y-5 lg:space-y-6">
        <section className="grid gap-5 xl:grid-cols-[1fr_1.08fr_0.92fr] xl:items-start">
          <div className="transition duration-200">
            <ConsultationForm
            input={userInput}
            error={formError}
            hasPreviousRecord={history.length > 0}
            todayLabel={todayLabel}
            todayStatusText={todayStatusText}
            startButtonLabel={startButtonLabel}
            inputMode={inputMode}
            onInputChange={handleUserInputChange}
            onInputModeChange={setInputMode}
            onStart={handleStart}
            onReset={resetAll}
            started={messages.length > 0}
            isStartEnabled={isStartEnabled}
            isLoading={isLoading}
            maxLength={MAX_INPUT_LENGTH}
            />
          </div>
          <div
            ref={stepTwoRef}
            className={`scroll-mt-24 transition duration-200 ${
              currentStage === 1 ? "opacity-80 xl:pt-3" : "opacity-100"
            }`}
          >
          <ChatPanel
            messages={messages}
            replyInput={replyInput}
            chatError={chatError}
            canReply={canReply}
            canSummarize={canSummarize}
            inputMode={inputMode}
            onReplyInputChange={handleReplyInputChange}
            onInputModeChange={setInputMode}
            onNext={handleNext}
            onSummarize={handleSummarize}
            messageHint={messageHint}
            isLoading={isLoading}
            onRetry={handleRetry}
            canRetry={Boolean(lastRequest)}
            latestReply={latestReply}
            reflectionShift={reflectionShift}
            soraPresenceLine={soraPresenceLine}
            responseTopRef={stepTwoResponseRef}
            maxLength={MAX_INPUT_LENGTH}
          />
          </div>
          <div
            className={`transition duration-200 ${
              currentStage === 1 ? "opacity-78 xl:pt-4" : "opacity-100"
            }`}
          >
            <SummaryPanel
              summary={summary}
              userInput={userInput.trim()}
              insight={latestReply?.insight || ""}
              futureMessage={latestReply?.futureMessage || ""}
              nextQuestion={latestReply?.nextQuestion || ""}
              emotionalState={latestReply?.emotionalState || null}
              savedPreview={savedPreview}
              savedAtLabel={savedAtLabel}
              saveError={saveError}
              saveSuccess={saveSuccess}
              isSaved={saveCompleted}
              onSave={handleSave}
              onOpenHistory={handleOpenHistory}
              onContinueThinking={scrollToStepTwo}
              onRestart={resetAll}
              soraClosingLine={soraClosingLine}
            />
          </div>
        </section>

        {previousMemory ? (
          <section className="rounded-[16px] border border-lilac/18 bg-white/42 px-4 py-3 text-sm text-stone/80">
            <p className="text-[10px] uppercase tracking-[0.18em] text-plum/56">前に残した言葉</p>
            <p className="mt-2 text-xs text-stone/76">{previousMemory.label}</p>
            <p className="mt-1 leading-7 text-ink/78">「{previousMemory.title}」</p>
            <p className="mt-1 text-xs leading-6 text-stone/66">前の続きでなくても大丈夫です。</p>
          </section>
        ) : null}

        {showIntroCard ? (
          <section className="rounded-[16px] border border-lilac/18 bg-white/38 px-4 py-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.18em] text-plum/56">こころの羅針盤</p>
                <p className="mt-2 text-sm leading-7 text-stone/78">
                  ここには、その日の言葉を少しずつ残していけます。
                </p>
                <p className="text-sm leading-7 text-stone/68">まとまっていなくても、そのままで大丈夫です。</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  saveHasSeenIntro();
                  setShowIntroCard(false);
                }}
                className="shrink-0 text-[11px] text-stone/66 transition hover:text-plum"
              >
                閉じる
              </button>
            </div>
          </section>
        ) : null}

        <NoticePanel compact />

        <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[20px] border border-lilac/24 bg-white/54 p-5">
            <p className="text-[10px] uppercase tracking-[0.16em] text-plum/56">心の地図</p>
            <h2 className="mt-2 font-serif text-xl text-plum">残してきた言葉をたどる</h2>
            <p className="mt-3 text-sm leading-7 text-stone/80">
              残した言葉は、あとから静かに読み返せます。
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="/log"
                className="text-sm text-stone/78 transition hover:text-plum"
              >
                心の地図を見る
              </Link>
              {history.length > 0 ? (
                <button
                  type="button"
                  onClick={() => handleSelectHistory(history[0])}
                  className="text-sm text-stone/72 transition hover:text-plum"
                >
                  前の言葉を開く
                </button>
              ) : null}
            </div>
          </div>

          <div className="rounded-[20px] border border-lilac/24 bg-white/50 px-5 py-4">
            <p className="text-sm leading-7 text-stone/78">
              使いづらさや気になる点があれば、短くても大丈夫です。
            </p>
            <div className="mt-4">
              <FeedbackButton
                href={FEEDBACK_FORM_URL}
                label="フィードバックを送る"
                className="text-sm text-stone/72 transition hover:text-plum"
              />
            </div>
          </div>
        </section>

        <div className="text-sm text-stone/72">
          <Link href="/" className="transition hover:text-plum">
            トップページへ戻る
          </Link>
        </div>
      </main>
    </LayoutShell>
  );
};
