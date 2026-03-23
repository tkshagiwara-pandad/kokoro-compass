# こころの羅針盤 Beta MVP

Next.js + TypeScript + Tailwind CSS で作成した、AI との対話で心を静かに整理するサービスです。AI 名は「ソラ」で、答えを断定するのではなく、相談者の気持ちをやさしく整える対話を行います。

## サービス概要

- 悩みや気持ちをそのまま書き始められる相談画面
- ソラとのやわらかな対話
- 今日の気づきや未来の言葉を持ち帰れる整理体験
- `localStorage` ベースのマイログ保存
- 最近のテーマや気づきを静かに見返せる「心の地図」

## 技術スタック

- Next.js
- TypeScript
- Tailwind CSS
- OpenAI API
- localStorage

## セットアップ

```bash
npm install
```

`.env.local` を作成して OpenAI API キーを設定してください。

```bash
cp .env.example .env.local
```

例:

```bash
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4.1-mini
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_FEEDBACK_FORM_URL=https://docs.google.com/forms/d/e/1FAIpQLSfbjCTebmrcvphOcg9eNiUTwlfQAlv48TPfvwUXDV4QcVVQ2A/viewform?usp=dialog
```

## ローカル起動

```bash
npm run dev
```

主なルート:

- `/` : トップページ
- `/consultation` : 相談画面
- `/log` : マイログ画面

## デプロイ前チェック

- `npm run build` が通る
- `OPENAI_API_KEY` が設定されている
- `NEXT_PUBLIC_SITE_URL` が本番 URL になっている
- フィードバック URL を必要に応じて差し替えた
- モバイル表示を確認した

## 注意

- 本サービスは医療行為や診断を行うものではありません
- 緊急性の高い悩みは、医療機関や公的な相談窓口など専門機関へご相談ください
- AI の回答は、心の整理を目的とした参考情報です
