import { defaultEmotionalState, normalizeEmotionalState } from "@/lib/emotional-state";
import { buildConsultationTitle } from "@/lib/consultation-title";
import { ConsultationRecord, EmotionalState, EmotionTag, HeartState } from "@/types/consultation";

const STORAGE_KEY = "kokoro-compass-history";
const ACTIVE_RECORD_KEY = "kokoro-compass-active-record-id";
const DRAFT_KEY = "kokoro-compass-draft";
const SESSION_COUNT_KEY = "sora_sessions_count";
const HAS_SEEN_INTRO_KEY = "kokoro-compass-has-seen-intro";
export const MAX_LOGS_FREE = 1000;

export type ConsultationDraft = {
  topic: ConsultationRecord["topic"];
  inputMode: "text" | "voice";
  userInput: string;
  replyInput: string;
};

const sortRecords = (records: ConsultationRecord[]) =>
  [...records].sort(
    (left, right) =>
      new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
  );

const normalizeRecord = (
  record: ConsultationRecord & {
    emotion?: string;
    emotionTag?: EmotionTag;
    heartState?: HeartState;
    title?: string;
    insight?: string;
    futureMessage?: string;
    nextQuestion?: string;
    emotionalState?: Partial<EmotionalState>;
    summary?: ConsultationRecord["summary"] & { topic?: string; theme?: string };
  },
): ConsultationRecord => ({
  ...record,
  title:
    record.title ||
    buildConsultationTitle({
      topic: record.topic,
      insight: record.insight,
      userInput: record.userInput,
      summary: record.summary,
    }),
  summary: {
    ...record.summary,
    topic:
      record.summary?.topic ||
      record.summary?.theme ||
      "いまの心にまつわる整理",
    theme:
      record.summary?.topic ||
      record.summary?.theme ||
      "いまの心にまつわる整理",
  },
  emotion:
    record.emotion ||
    record.summary?.emotion ||
    "いくつもの気持ちが重なり、まだ輪郭を探している途中のようです。",
  emotionTag: record.emotionTag,
  heartState: record.heartState,
  insight:
    record.insight ||
    "今日の小さな気づきとして、まず安心できる感覚を取り戻すことが大切なのかもしれません。",
  futureMessage:
    record.futureMessage ||
    "焦らなくて大丈夫です。今のあなたは、自分の心と丁寧に向き合えています。",
  nextQuestion:
    record.nextQuestion ||
    "本当は、どんな瞬間に少しほっとできるでしょうか。",
  emotionalState: normalizeEmotionalState(record.emotionalState),
});

export const sampleRecords: ConsultationRecord[] = sortRecords([
  {
    id: "sample-record-love",
    createdAt: "2026-03-15T20:15:00.000Z",
    topic: "恋愛",
    title: "まだ手放せない気持ち",
    emotion: "寂しさと確かめたい気持ちが重なり、心が敏感になっているようです。",
    userInput:
      "相手のことを大切に思っているのに、連絡の間が空くたびに気持ちが離れてしまったのではと不安になります。",
    messages: [
      {
        id: "sample-love-1",
        sender: "sora",
        content:
          "話してくださってありがとうございます。相手を思う気持ちがあるからこそ、静かな時間まで意味を持って感じられるのですね。いま特に胸に残っているのは、不安、寂しさ、それとも確かめたい気持ちのどれに近いでしょう。",
        createdAt: "2026-03-15T20:15:20.000Z",
      },
      {
        id: "sample-love-2",
        sender: "user",
        content: "寂しさと、相手の気持ちを確かめたくなる焦りです。",
        createdAt: "2026-03-15T20:16:10.000Z",
      },
    ],
    summary: {
      topic: "相手との距離に揺れる心の整理",
      emotion: "寂しさと確かめたい気持ちが重なり、心が敏感になっているようです。",
      coreIssue:
        "相手の反応そのものより、関係の中で自分の安心をどこに置けばよいかが揺らいでいるようです。",
      whatYouNeed:
        "相手の行動を読む前に、自分が求めている安心の形を一言で書き出してみることが助けになります。",
      soraMessage:
        "誰かを大切に思うとき、不安が生まれるのは自然なことです。まずは心が求めているぬくもりを、自分で静かに受け止めてあげてください。",
    },
    insight:
      "今日の小さな気づきとして、あなたは関係の確かさよりも安心感を求めているのかもしれません。",
    futureMessage:
      "大丈夫です。気持ちが揺れる日々の中でも、あなたはちゃんと大切なものを見失っていません。",
    nextQuestion:
      "どんな言葉や距離感があると、少し安心して相手を見つめられるでしょうか。",
    emotionalState: {
      anxiety: 7,
      fatigue: 4,
      hope: 5,
    },
  },
  {
    id: "sample-record-work",
    createdAt: "2026-03-14T09:30:00.000Z",
    topic: "仕事",
    title: "このままでいいのか",
    emotion: "安心を手放したくない気持ちと、変化を望む気持ちが並んでいます。",
    userInput:
      "今の仕事を続けるべきか迷っています。安定はあるけれど、このままでよいのかという思いが消えません。",
    messages: [
      {
        id: "sample-work-1",
        sender: "sora",
        content:
          "ここまで抱えてきた迷いを言葉にしてくださってありがとうございます。安定と違和感のあいだで、心が静かに引っ張られているのですね。いま一番重く感じるのは、疲れ、迷い、それとも未来への焦りでしょうか。",
        createdAt: "2026-03-14T09:30:20.000Z",
      },
      {
        id: "sample-work-2",
        sender: "user",
        content: "迷いと、何も変えないまま時間が過ぎることへの焦りです。",
        createdAt: "2026-03-14T09:31:05.000Z",
      },
    ],
    summary: {
      topic: "安定と本音のあいだにある迷い",
      emotion: "安心を手放したくない気持ちと、変化を望む気持ちが並んでいます。",
      coreIssue:
        "仕事そのものの良し悪しより、自分の時間をどんな方向へ使いたいかがまだ定まりきっていないようです。",
      whatYouNeed:
        "今の仕事で守れているものと、失っている感覚をそれぞれ一つずつ並べてみると、次の輪郭が見えやすくなります。",
      soraMessage:
        "すぐに結論を出さなくても、違和感は大切な合図になります。焦りの下にある願いを、少し丁寧に見つめてみましょう。",
    },
    insight:
      "今日の小さな気づきとして、あなたは正解よりも納得できる歩み方を探しているのかもしれません。",
    futureMessage:
      "焦らなくて大丈夫です。迷っている今も、あなたは本音に近づくための時間を進んでいます。",
    nextQuestion:
      "もし少しだけ自由に選べるなら、どんな働き方や時間の使い方を試してみたいでしょうか。",
    emotionalState: {
      anxiety: 6,
      fatigue: 6,
      hope: 4,
    },
  },
  {
    id: "sample-record-relationship",
    createdAt: "2026-03-12T18:40:00.000Z",
    topic: "人間関係",
    title: "距離の取り方に迷う",
    emotion: "疲れと罪悪感が重なり、心の休まる場所が少なくなっているようです。",
    userInput:
      "人に気を遣いすぎてしまい、会ったあとにどっと疲れます。距離を取りたいのに、冷たいと思われそうで怖いです。",
    messages: [
      {
        id: "sample-rel-1",
        sender: "sora",
        content:
          "人との関わりの中で気を張り続けてきたのですね。会ったあとに疲れが残るのは、それだけ丁寧に相手を見てきた証でもあります。いま強いのは、しんどさ、罪悪感、それともわかってほしい気持ちでしょうか。",
        createdAt: "2026-03-12T18:40:25.000Z",
      },
      {
        id: "sample-rel-2",
        sender: "user",
        content: "しんどさと、距離を取ることへの罪悪感です。",
        createdAt: "2026-03-12T18:41:10.000Z",
      },
    ],
    summary: {
      topic: "人との距離感を整えたい気持ち",
      emotion: "疲れと罪悪感が重なり、心の休まる場所が少なくなっているようです。",
      coreIssue:
        "相手を思いやる力が強いぶん、自分の境界線を引くことにためらいが生まれているようです。",
      whatYouNeed:
        "関係を切るのではなく、自分が安心できる距離を一つだけ具体的に決めてみることが助けになります。",
      soraMessage:
        "やさしさは、無理を続けることとは少し違います。自分を守る距離にも、静かな思いやりが宿っています。",
    },
    insight:
      "今日の小さな気づきとして、あなたは人に合わせる力が強いぶん、自分の休息を後回しにしやすいのかもしれません。",
    futureMessage:
      "大丈夫です。少しずつ距離を整えることは、冷たさではなく自分への思いやりでもあります。",
    nextQuestion:
      "あなたが安心して息をつける人との距離感は、どのくらいに近いでしょうか。",
    emotionalState: {
      anxiety: 5,
      fatigue: 7,
      hope: 3,
    },
  },
]).map(normalizeRecord);

export const loadHistory = (): ConsultationRecord[] => {
  if (typeof window === "undefined") {
    return [];
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as Array<
      ConsultationRecord & {
        emotion?: string;
        emotionTag?: EmotionTag;
        heartState?: HeartState;
        title?: string;
        insight?: string;
        futureMessage?: string;
        nextQuestion?: string;
        emotionalState?: Partial<EmotionalState>;
      }
    >;
    return parsed.length > 0 ? sortRecords(parsed.map(normalizeRecord)) : [];
  } catch {
    return [];
  }
};

export const saveHistory = (records: ConsultationRecord[]) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(sortRecords(records).map(normalizeRecord)),
  );
};

export const setActiveRecordId = (id: string) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(ACTIVE_RECORD_KEY, id);
};

export const loadDraft = (): ConsultationDraft | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(DRAFT_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as ConsultationDraft;
  } catch {
    return null;
  }
};

export const saveDraft = (draft: ConsultationDraft) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
};

export const clearDraft = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(DRAFT_KEY);
};

export const incrementSessionCount = () => {
  if (typeof window === "undefined") {
    return 0;
  }

  const current = Number(window.localStorage.getItem(SESSION_COUNT_KEY) || "0");
  const next = current + 1;
  window.localStorage.setItem(SESSION_COUNT_KEY, String(next));
  return next;
};

export const loadHasSeenIntro = () => {
  if (typeof window === "undefined") {
    return false;
  }

  return window.localStorage.getItem(HAS_SEEN_INTRO_KEY) === "true";
};

export const saveHasSeenIntro = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(HAS_SEEN_INTRO_KEY, "true");
};

export const takeActiveRecordId = () => {
  if (typeof window === "undefined") {
    return null;
  }

  const id = window.localStorage.getItem(ACTIVE_RECORD_KEY);

  if (id) {
    window.localStorage.removeItem(ACTIVE_RECORD_KEY);
  }

  return id;
};
