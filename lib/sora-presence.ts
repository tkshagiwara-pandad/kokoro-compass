const soraPresenceLines = [
  "急がなくて大丈夫です。",
  "うまくまとまっていなくても大丈夫です。",
  "言葉にならないままでも、ここから始められます。",
  "少しずつで大丈夫です。",
  "気持ちの輪郭を、一緒に見つめていきましょう。",
  "今日は、どこからでも話して大丈夫です。",
] as const;

const soraClosingLines = [
  "今日ここまで言葉にできたことも、ひとつの整理です。",
  "また必要なときに、ここへ戻ってきてください。",
  "答えを急がなくても、大丈夫です。",
  "今日のあなたの言葉は、ちゃんと残っています。",
] as const;

export const pickSoraPresenceLine = (seed: string) =>
  soraPresenceLines[seed.length % soraPresenceLines.length];

export const pickSoraClosingLine = (seed: string) =>
  soraClosingLines[seed.length % soraClosingLines.length];
