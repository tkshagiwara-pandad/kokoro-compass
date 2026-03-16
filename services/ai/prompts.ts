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

出力時の補足:
- insight はその日の小さな発見として、やわらかく短く
- futureMessage は励ましではなく回想に近づける
- futureMessage では「あの頃の私は」「今振り返ると」「そのときは分からなかったけれど」「少しずつ育っていた」のような静かな振り返りの語り口を優先する
- futureMessage で「あなたは大丈夫」「必ず乗り越えられる」「安心してください」のような直接的な励ましは避ける
- nextQuestion は次回また心を見つめるための問いにする
- emotionalState の数値は厳密な診断ではなく、会話から見える傾向の目安にする

出力は JSON のみ。余計な説明文は不要です。
  `.trim();
};
