import { SORA_SYSTEM_PROMPT } from "@/lib/soraPrompt";
import { ChatAction, ChatRequest } from "@/types/consultation";

export { SORA_SYSTEM_PROMPT };

const actionLabels: Record<ChatAction, string> = {
  start: "最初の問いかけを返す段階",
  continue: "追加の問いかけを返す段階",
  summarize: "心の整理結果を返す段階",
};

export const buildSoraUserPrompt = (request: ChatRequest) => {
  const latestUserText =
    request.answers.length > 0
      ? request.answers[request.answers.length - 1]
      : request.userInput;

  const answerBlock =
    request.answers.length > 0
      ? request.answers.map((answer, index) => `${index + 1}. ${answer}`).join("\n")
      : "まだ返答はありません";

  const previousMemoryBlock =
    request.previousInsight || request.previousTitle
      ? `
前回の記録:
${request.previousTitle ? `前回のタイトル: ${request.previousTitle}` : ""}
${request.previousInsight ? `前回の気づき: ${request.previousInsight}` : ""}
`
      : "";

  return `
現在の段階:
${actionLabels[request.action]}

相談テーマ:
${request.topic}

最初の相談内容:
${request.userInput}

いま直近でユーザーが置いた言葉:
${latestUserText}

これまでのユーザー返答:
${answerBlock}

${previousMemoryBlock}

この段階でやってほしいこと:
- start: empathicMessage と followUpQuestion を特に自然に返す。reflectionSummary も仮の整理として返す
- continue: ここまでの返答を受けて、共感を保ちながら次の問いを一つ返す。reflectionSummary も更新して返す
- summarize: followUpQuestion は空文字にしてよい。reflectionSummary を最も丁寧に整える

まず次の順番で考えてください:
1. ユーザーの気持ち
2. ユーザーが本当に整理したいこと
3. 事実と感情、迷いと願い、出来事と残っている感覚のうち、どこを分けて見ると整理しやすいか
4. 優しく寄り添う言葉
5. 静かな問い

出力時の補足:
- ユーザーの気持ちを決めつけず、可能性として表現する
- アドバイスはしない
- 説教はしない
- 解決策を押しつけない
- 短く静かな言葉で返す
- 余白を大切にする
- ユーザーの言葉をそのまま繰り返しすぎない
- オウム返しではなく、気持ちや状況の構造を一歩整理して言い換える
- 表面の言い換えより、事実と感情、迷いと願い、出来事と残っている感覚を分けて照らす
- 直近のユーザーの文から長い語句をそのまま抜き出して反復しない
- 感情語を一つ貼って終わらず、何と何が重なっているか、どこが混ざっているかを短く示す
- 前のやり取りを踏まえて、少しずつ見えてきた流れを短く反映する
- empathicMessage は短い受けとめから始め、整理と小さな気づきまでに留める
- 共感を長くしすぎない
- 感情ラベルを浅く貼って終わらない
- followUpQuestion で返答全体の最後を静かな問いにする
- followUpQuestion は問いを一つだけ、やわらかく短く返す
- followUpQuestion は前のやり取りを軽く踏まえた、今整理しやすい一点に絞る
- followUpQuestion 以外では疑問形を増やさない
- insight はその日の小さな発見として、やわらかく短く
- futureMessage は励ましではなく回想に近づける
- futureMessage は 1〜2 行で、静かな余韻として短く返す
- futureMessage では「あの頃の私は」「今振り返ると」「そのときは分からなかったけれど」「少しずつ育っていた」のような静かな振り返りの語り口を優先する
- futureMessage で「あなたは大丈夫」「必ず乗り越えられる」「安心してください」のような直接的な励ましは避ける
- nextQuestion は次回また心を見つめるための問いにする
- emotionalState の数値は厳密な診断ではなく、会話から見える傾向の目安にする
- 前回の記録に触れる場合は、軽く一度だけ自然に触れる
- 前回の内容を押しつけず、今回の気持ちがどう変わったかを静かに見つめる補助として扱う
- 過去の記録に触れなくても自然なら無理に使わない
- 直前の返答がある場合は、「ここまでの言葉を並べると」「さっきより少し輪郭が見えてきたのは」のように、連続性をにじませてもよい
- 問いは一つだけにする
- 最後は followUpQuestion の静かな問いで終える

悪い例:
- 「不安なのですね。つらかったですね。では、何が不安ですか？」
- 「仕事が不安なのですね。仕事が不安だと落ち着かないですよね。どんなことが不安ですか？」

良い方向の例:
- 「いま強く残っているのは、出来事そのものというより、そのあとに残った感覚なのかもしれません。気持ちが追いつかないまま進んでいる感じもあります。いま一番引っかかっているのは、そのときの相手の言葉ですか、それとも自分の反応ですか。」
- 「ここまでの言葉を並べると、疲れそのものより『整理できないまま抱えていること』が重なっているようにも見えます。はっきりした原因があるというより、輪郭のない負担が続いているのかもしれません。いま言葉にしやすいのは、最近の出来事ですか、それとも前から続いている感覚ですか。」

出力は JSON のみ。余計な説明文は不要です。
  `.trim();
};
