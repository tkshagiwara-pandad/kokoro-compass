"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChatPanel } from "@/components/ChatPanel";
import { ConsultationForm } from "@/components/ConsultationForm";
import { FeedbackButton } from "@/components/FeedbackButton";
import { LayoutShell } from "@/components/LayoutShell";
import { NoticePanel } from "@/components/NoticePanel";
import { StepIndicator } from "@/components/StepIndicator";
import { SummaryPanel } from "@/components/SummaryPanel";
import { trackEvent } from "@/lib/analytics";
import { requestSoraReply } from "@/lib/api";
import { createChatMessage } from "@/lib/chat";
import { FEEDBACK_FORM_URL } from "@/lib/config";
import { pickSoraClosingLine, pickSoraPresenceLine } from "@/lib/sora-presence";
import { loadHistory, saveHistory, takeActiveRecordId } from "@/lib/storage";
import {
  ChatMessage,
  ChatRequest,
  ConsultationRecord,
  ConsultationStage,
  ConsultationTopic,
  EmotionalState,
  EmotionTag,
  HeartState,
  ReflectionSummary,
  SoraReply,
} from "@/types/consultation";

const INITIAL_TOPIC: ConsultationTopic = "恋愛";

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

export const ConsultationExperience = () => {
  const router = useRouter();
  const stepTwoRef = useRef<HTMLDivElement | null>(null);
  const lastStepTwoScrollKeyRef = useRef("");
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
  const [isLoading, setIsLoading] = useState(false);
  const [lastRequest, setLastRequest] = useState<ChatRequest | null>(null);
  const [latestReply, setLatestReply] = useState<SoraReply | null>(null);
  const [emotionTag, setEmotionTag] = useState<EmotionTag | null>(null);
  const [heartState, setHeartState] = useState<HeartState | null>(null);

  useEffect(() => {
    const loadedHistory = loadHistory();
    setHistory(loadedHistory);

    const activeRecordId = takeActiveRecordId();
    if (activeRecordId) {
      const activeRecord = loadedHistory.find((record) => record.id === activeRecordId);
      if (activeRecord) {
        applyRecord(activeRecord);
      }
    }
  }, []);

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

  const latestMemo = useMemo(() => {
    const latestRecord = history[0];

    if (!latestRecord) {
      return null;
    }

    return {
      label: `${formatRelativeDay(latestRecord.createdAt)} / ${latestRecord.topic}`,
      text:
        latestRecord.insight ||
        latestRecord.summary?.emotion ||
        "前回の相談で残した気づきを、ここで静かに見返せます。",
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

    if (previousRecord.emotionTag === "まだモヤモヤ" && emotionTag === "整理できた") {
      return "前回よりも、気持ちの輪郭が少し見えやすくなっているのかもしれません。";
    }

    if (previousRecord.topic === topic) {
      return `前回も「${topic}」について立ち止まっていました。今日は、その迷いを少し別の角度から見つめられているのかもしれません。`;
    }

    return null;
  }, [currentStage, emotionTag, history, topic, userInput]);

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
      return "対話は整いました。整理された内容を見返しながら、いまの気持ちの輪郭をたどれます。";
    }

    if (isLoading) {
      return "ソラが少し考えています。深呼吸するような気持ちで、少しだけお待ちください。";
    }

    if (messages.length === 0) {
      return "相談内容を書くと、ソラがやさしい問いをひとつずつ返します。";
    }

    if (answers.length === 0) {
      return "最初の問いに、いま一番近い気持ちを返してみてください。";
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
    setIsLoading(false);
    setLastRequest(null);
    setLatestReply(null);
    setEmotionTag(null);
    setHeartState(null);
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
    setEmotionTag(record.emotionTag || null);
    setHeartState(record.heartState || null);
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
      setFormError("相談内容を入力してください。");
      return;
    }

    setFormError("");
    setChatError("");
    setSaveError("");
    setSaveSuccess("");

    try {
      const initialUserMessage = createChatMessage("user", userInput.trim());
      const response = await fetchSora({
        action: "start",
        topic,
        userInput: userInput.trim(),
        answers: [],
      });
      trackEvent("consultation_started", { topic });
      setLatestReply(response.reply);
      const soraMessage = createChatMessage(
        "sora",
        `${response.reply.empathicMessage}\n\n${response.reply.followUpQuestion}`.trim(),
      );

      setMessages([initialUserMessage, soraMessage]);
      setAnswers([]);
      setReplyInput("");
      setEmotionTag(null);
      setHeartState(null);
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
      setChatError("返答を入力してから次へ進んでください。");
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
      setChatError("最後の返答を入力してから整理結果を表示してください。");
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
      });

      setChatError("");
      setMessages((current) => [...current, finalUserMessage]);
      setAnswers(nextAnswers);
      setReplyInput("");
      setSummary(response.reply.reflectionSummary);
      setSaveSuccess("");
      setSaveError("");
      setLatestReply(response.reply);
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
      userInput: userInput.trim(),
      emotion: summary.emotion,
      emotionTag: emotionTag || undefined,
      heartState: heartState || undefined,
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
      setSaveSuccess("相談内容をローカルに保存しました。");
      setSaveError("");
      router.push("/log");
    } catch {
      setSaveError("保存に失敗しました。ブラウザの設定を確認してください。");
      setSaveSuccess("");
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
    scrollToStepTwo();
  }, [currentStage, isLoading, latestReply, messages.length]);

  return (
    <LayoutShell
      eyebrow="Kokoro Compass"
      title="こころの羅針盤"
      description="ソラと対話しながら、感情や悩みの輪郭を静かに整えるための小さな相談室です。ここでは答えを急がず、いま必要な視点をやわらかく見つけていきます。"
      backLink={{ href: "/", label: "トップへ戻る" }}
    >
      <main className="space-y-6 lg:space-y-7">
        {latestMemo ? (
          <section className="rounded-lg border border-lilac/40 bg-purple-50/70 px-4 py-3 text-sm text-stone shadow-[0_10px_24px_rgba(137,119,154,0.04)]">
            <p className="text-[11px] uppercase tracking-[0.2em] text-plum/70">前回のあなた</p>
            <p className="mt-2 text-xs text-stone/76">{latestMemo.label}</p>
            <p className="mt-1 leading-7 text-ink/82">「{latestMemo.text}」</p>
            <p className="mt-1 text-xs leading-6 text-stone/72">今日も少し考えてみますか</p>
          </section>
        ) : null}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <StepIndicator currentStage={currentStage} />
        </div>

        <section className="grid gap-6 xl:grid-cols-[1fr_1.08fr_0.92fr] xl:items-start">
          <div className="transition duration-200">
            <ConsultationForm
            topic={topic}
            input={userInput}
            error={formError}
            inputMode={inputMode}
            onTopicChange={setTopic}
            onInputChange={setUserInput}
            onInputModeChange={setInputMode}
            onStart={handleStart}
              onReset={resetAll}
              started={messages.length > 0}
              isStartEnabled={isStartEnabled}
              isLoading={isLoading}
            />
          </div>
          <div
            ref={stepTwoRef}
            className={`scroll-mt-24 transition duration-200 ${
              currentStage === 1 ? "opacity-72 xl:pt-4" : "opacity-100"
            }`}
          >
          <ChatPanel
            messages={messages}
            replyInput={replyInput}
            chatError={chatError}
            canReply={canReply}
            canSummarize={canSummarize}
            inputMode={inputMode}
            onReplyInputChange={setReplyInput}
            onInputModeChange={setInputMode}
            onNext={handleNext}
            onSummarize={handleSummarize}
            messageHint={messageHint}
              isLoading={isLoading}
            onRetry={handleRetry}
            canRetry={Boolean(lastRequest)}
            latestReply={latestReply}
            emotionTag={emotionTag}
            onEmotionTagChange={setEmotionTag}
            reflectionShift={reflectionShift}
            soraPresenceLine={soraPresenceLine}
          />
          </div>
          <div
            className={`transition duration-200 ${
              currentStage === 1 ? "opacity-68 xl:pt-6" : "opacity-100"
            }`}
          >
            <SummaryPanel
              summary={summary}
              insight={latestReply?.insight || ""}
              futureMessage={latestReply?.futureMessage || ""}
              nextQuestion={latestReply?.nextQuestion || ""}
              emotionalState={latestReply?.emotionalState || null}
              heartState={heartState}
              saveError={saveError}
              saveSuccess={saveSuccess}
              onSave={handleSave}
              onOpenHistory={handleOpenHistory}
              onContinueThinking={scrollToStepTwo}
              onHeartStateChange={setHeartState}
              soraClosingLine={soraClosingLine}
            />
          </div>
        </section>

        <NoticePanel compact />

        <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[24px] border border-lilac/36 bg-white/62 p-5 shadow-soft">
            <p className="text-xs uppercase tracking-[0.22em] text-gold">My Log</p>
            <h2 className="mt-2 font-serif text-xl text-plum">マイログと人生の地図</h2>
            <p className="mt-3 text-sm leading-7 text-stone">
              保存した相談は、あとから気づきや最近のテーマを静かに見返せます。今の相談を終えたあとで、自分の流れをたどりたいときに開いてください。
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="/log"
                className="inline-flex items-center justify-center rounded-full border border-lilac/42 bg-white/76 px-4 py-2.5 text-sm text-stone transition hover:border-iris/45 hover:text-plum"
              >
                人生の地図を見る
              </Link>
              {history.length > 0 ? (
                <button
                  type="button"
                  onClick={() => handleSelectHistory(history[0])}
                  className="inline-flex items-center justify-center rounded-full border border-lilac/38 bg-white/72 px-4 py-2.5 text-sm text-stone transition hover:border-iris/45 hover:text-plum"
                >
                  最新の相談を開く
                </button>
              ) : null}
            </div>
          </div>

          <div className="rounded-[24px] border border-lilac/36 bg-white/62 px-5 py-4 shadow-soft">
            <p className="text-sm leading-7 text-stone">
              ベータ版のため、使いづらさや気になる点があれば短くても大丈夫です。感想をいただけると改善に役立ちます。
            </p>
            <div className="mt-4">
              <FeedbackButton
                href={FEEDBACK_FORM_URL}
                label="フィードバックを送る"
                className="inline-flex items-center justify-center rounded-full border border-lilac/40 bg-white/72 px-4 py-2.5 text-sm text-stone transition hover:border-iris/45 hover:text-plum"
              />
            </div>
          </div>
        </section>

        <div className="text-sm text-stone">
          <Link href="/" className="transition hover:text-plum">
            トップページへ戻る
          </Link>
        </div>
      </main>
    </LayoutShell>
  );
};
