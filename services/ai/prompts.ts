import { SORA_SYSTEM_PROMPT } from "@/lib/soraPrompt";
import { ChatAction, ChatRequest } from "@/types/consultation";

export { SORA_SYSTEM_PROMPT };

const actionLabels: Record<ChatAction, string> = {
  start: "最初の問いかけを返す段階",
  continue: "追加の問いかけを返す段階",
  summarize: "心の整理結果を返す段階",
};

export const buildSoraUserPrompt = (request: ChatRequest) => {
  const answerBlock =
    request.answers.length > 0
      ? request.answers.map((answer, index) => `${index + 1}. ${answer}`).join("\n")
      : "まだ返答はありません";

  return `
現在の段階:
${actionLabels[request.action]}

相談テーマ:
${request.topic}

最初の相談内容:
${request.userInput}

これまでのユーザー返答:
${answerBlock}

この段階でやってほしいこと:
- start: empathicMessage と followUpQuestion を特に自然に返す。reflectionSummary も仮の整理として返す
- continue: ここまでの返答を受けて、共感を保ちながら次の問いを一つ返す。reflectionSummary も更新して返す
- summarize: followUpQuestion は空文字にしてよい。reflectionSummary を最も丁寧に整える

まず次の順番で考えてください:
1. ユーザーの気持ち
2. ユーザーが本当に整理したいこと
3. 優しく寄り添う言葉
4. 静かな問い

出力時の補足:
- ユーザーの気持ちを決めつけず、可能性として表現する
- アドバイスはしない
- 説教はしない
- 解決策を押しつけない
- 短く静かな言葉で返す
- 余白を大切にする
- insight はその日の小さな発見として、やわらかく短く
- futureMessage は励ましではなく回想に近づける
- futureMessage は 1〜2 行で、静かな余韻として短く返す
- futureMessage では「あの頃の私は」「今振り返ると」「そのときは分からなかったけれど」「少しずつ育っていた」のような静かな振り返りの語り口を優先する
- futureMessage で「あなたは大丈夫」「必ず乗り越えられる」「安心してください」のような直接的な励ましは避ける
- nextQuestion は次回また心を見つめるための問いにする
- emotionalState の数値は厳密な診断ではなく、会話から見える傾向の目安にする

出力は JSON のみ。余計な説明文は不要です。
  `.trim();
};
