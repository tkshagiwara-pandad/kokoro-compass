const soraPresenceLines = [
  "いまの気持ちを、少しずつ整えていく時間です。",
  "ここでは、急がずに言葉にして大丈夫です。",
  "言葉にならないままでも、ここから始められます。",
  "気持ちの輪郭を、一緒に見つめていきましょう。",
  "今日は、どこからでも話し始めてかまいません。",
  "うまくまとまっていなくても、そのまま置いてみてください。",
] as const;

const soraClosingLines = [
  "今日ここまで言葉にできたことも、ひとつの整理です。",
  "また必要なときに、ここへ戻ってきてください。",
  "答えを急がずに置いておく時間も、大切な整理のひとつです。",
  "今日のあなたの言葉は、ちゃんと残っています。",
] as const;

export const pickSoraPresenceLine = (seed: string) =>
  soraPresenceLines[seed.length % soraPresenceLines.length];

export const pickSoraClosingLine = (seed: string) =>
  soraClosingLines[seed.length % soraClosingLines.length];
