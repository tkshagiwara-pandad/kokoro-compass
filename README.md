# こころの羅針盤 Beta MVP

Next.js + TypeScript + Tailwind CSS で作成した、スピリチュアル寄りの AI 相談サービス「こころの羅針盤」のベータ版 MVP です。AI 役は「ソラ」で、答えを断定するのではなく、相談者の心を整理するためのやさしい対話を行います。

## サービス説明

こころの羅針盤は、ユーザーの悩みに対して答えを断定するのではなく、AI との対話を通して感情やテーマを整理する相談サービスです。恋愛、仕事、人間関係、将来への不安などを静かに見つめ直し、いま必要な視点を見つける体験を目指しています。

## 機能一覧

### AI相談

- テーマ選択と自由入力による相談開始
- ソラとのやさしい対話
- 共感、質問、気づき、未来メッセージのカード表示
- 心の整理結果の表示
- 質問の直下に入力欄を置いた、読む → 書く の相談フロー

### ログ

- `localStorage` を使った相談履歴保存
- `/log` のマイログ画面で保存済み相談の再表示と削除
- 直近の気づきの見返し

### 人生の地図

- 保存ログをもとにした最近のテーマ集計
- `仕事 / 恋愛 / 人間関係 / 将来` の可視化
- 直近 3 件の気づき表示
- 最近のテーマをもとにした短い AI コメント
- 心の状態メーターの簡易推移

## 技術スタック

- Next.js
- TypeScript
- Tailwind CSS
- OpenAI API
- localStorage

## セットアップ方法

```bash
npm install
```

`.env.local` を作成して、OpenAI API キーを設定してください。

```bash
cp .env.example .env.local
```

`.env.local` の例:

```bash
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4.1-mini
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_FEEDBACK_FORM_URL=https://docs.google.com/forms/d/e/1FAIpQLSfbjCTebmrcvphOcg9eNiUTwlfQAlv48TPfvwUXDV4QcVVQ2A/viewform?usp=dialog
```

`OPENAI_MODEL` は任意です。未設定時は `gpt-4.1-mini` を使います。
`NEXT_PUBLIC_SITE_URL` は OGP やメタ情報の基準 URL です。Vercel の本番 URL を設定してください。
`NEXT_PUBLIC_FEEDBACK_FORM_URL` は任意です。未設定時はプレースホルダー扱いになり、フィードバックボタンは無効表示になります。

## ローカル起動方法

```bash
npm run dev
```

ブラウザで `http://localhost:3000` を開いてください。  
ルーティングは以下です。

- `/` : トップページ LP
- `/consultation` : 相談画面
- `/log` : マイログ画面

## Vercel デプロイ手順

1. Git リポジトリを Vercel に接続する
2. Project Settings の Environment Variables に以下を設定する
3. `OPENAI_API_KEY`
4. 必要に応じて `OPENAI_MODEL`
5. `NEXT_PUBLIC_SITE_URL`
6. 必要に応じて `NEXT_PUBLIC_FEEDBACK_FORM_URL`
7. Deploy を実行する
8. デプロイ後に `/` と `/consultation` を確認する

## ディレクトリ構成

```text
app/
  api/chat/route.ts
  consultation/page.tsx
  globals.css
  layout.tsx
  page.tsx
components/
  BetaBadge.tsx
  ChatPanel.tsx
  ConsultationExperience.tsx
  ConsultationForm.tsx
  FeedbackButton.tsx
  HistoryPanel.tsx
  LayoutShell.tsx
  NoticePanel.tsx
  StepIndicator.tsx
  SummaryPanel.tsx
lib/
  api.ts
  analytics.ts
  config.ts
  format.ts
  storage.ts
services/
  ai/
    prompts.ts
    sora.ts
types/
  consultation.ts
public/
```

## ベータ版でできること

- LP から相談画面へ遷移できる
- 相談画面からマイログ画面へ遷移できる
- 相談テーマ選択と自由入力フォーム
- ステップ表示付きの相談フロー
- ソラとの 1 から 2 ターンの簡易対話
- 心の整理結果の表示
- 共感 / 質問 / 気づき / 未来のあなたからの言葉を分けた応答カード表示
- 今日の小さな気づき、次の問い、未来のあなたからの言葉の表示
- 心の状態メーターの表示
- `localStorage` を使った相談履歴の保存
- 履歴の再表示と削除
- 人生の地図、直近の気づき、心の状態の簡易推移の表示
- フィードバック導線
- 利用上の注意の表示
- β版表示
- 初回表示用のサンプル相談 3 件
- 空入力時のバリデーション
- ローカル保存失敗時の簡易エラー表示
- 1 画面完結のレスポンシブ UI

## テスト公開向けに整えたこと

- `/` にシンプルな LP を追加し、サービスの概要と注意点を先に伝える構成に変更
- `/consultation` に相談画面を分離し、トップへ戻る導線を追加
- LP と相談画面の両方に利用上の注意を追加
- 画面上部に β版表示を追加
- フィードバックフォームへの導線を LP と相談画面下部に追加
- `lib/analytics.ts` を追加し、LP CTA、相談完了、フィードバッククリックを簡易記録
- メタ情報、Open Graph、仮 favicon を追加
- API エラー文言とローディング表示をやわらかく調整
- Vercel で詰まりやすい環境変数チェックを `lib/env.ts` に分離
- API route に Node runtime を明示
- 404 ページと OGP 画像を追加
- 再試行ボタンを追加し、API エラー時も体験が崩れにくいように調整

## 今回追加した機能

- 相談テーマに `なんとなく不安` を追加
- ソラの応答を `共感 / 質問 / 気づき / 未来のあなたからの言葉` のカードで整理表示
- `今日の小さな気づき` と `次の問い` を追加
- `未来のあなたからの言葉` を特別感のあるリフレクションとして表示
- `不安 / 疲れ / 希望` の心の状態メーターを追加
- 履歴画面に `最近多いテーマ / 直近3件の気づき / 心の状態の目安` を追加

## 保存されるログ項目

`localStorage` ベースで、各相談に以下を保存しています。

- `id`
- `createdAt`
- `topic`
- `userInput`
- `emotion`
- `summary`
- `messages`
- `insight`
- `futureMessage`
- `nextQuestion`
- `emotionalState`
  - `anxiety`
  - `fatigue`
  - `hope`

## 相談フロー

1. 相談テーマを選ぶ
2. 相談内容を書く
3. ソラの共感と質問を読む
4. 質問の直下で返答を書く
5. 今日の小さな気づき、未来のあなたからの言葉、次の問いを受け取る
6. 心の整理結果を保存し、必要に応じてマイログで見返す

## 人生の地図

マイログでは、保存された相談を `localStorage` から集計し、最近多いテーマ、直近 3 件の気づき、短い AI コメント、心の状態メーターの簡易推移を表示します。強い分析ではなく、あとから静かに自分を見返すための補助機能として設計しています。

## OpenAI API 実装の構成

- クライアントは `lib/api.ts` 経由で `/api/chat` を呼び出す
- API route は `app/api/chat/route.ts`
- モデル呼び出しは `services/ai/sora.ts`
- プロンプト管理は `services/ai/prompts.ts`
- OpenAI からは JSON schema に沿った構造化レスポンスを受け取る

`OPENAI_API_KEY` が未設定のままだと、API ルートはエラーを返します。

## フィードバックフォーム URL の差し替え場所

- 現在は Google Forms のフィードバックフォームを LP、相談画面、マイログ画面に設置しています
- `NEXT_PUBLIC_FEEDBACK_FORM_URL`
- または `lib/config.ts` の `FEEDBACK_FORM_URL`

必要に応じて、`lib/config.ts` または `NEXT_PUBLIC_FEEDBACK_FORM_URL` を差し替えて運用してください。

## og:image と favicon の差し替え場所

- OGP 画像: `public/og-image.svg`
- favicon: `public/icon.svg`

## ベータ版としての注意点

- 正式版ではないため、応答品質や表示文言は今後変わる可能性があります
- 本サービスは医療行為や診断を行うものではありません
- 緊急性の高い悩みは、医療機関や公的な相談窓口など専門機関へご相談ください
- AIの回答は心の整理を目的とした参考情報です

## デプロイ時の最低限の手順

1. `OPENAI_API_KEY` を本番環境に設定する
2. `OPENAI_MODEL` を必要に応じて設定する
3. `NEXT_PUBLIC_SITE_URL` を本番 URL に設定する
4. `NEXT_PUBLIC_FEEDBACK_FORM_URL` か `lib/config.ts` のフィードバック URL を実運用のものに差し替える
5. `npm run build` を通す
6. LP と `/consultation` の動作、モバイル表示、エラー表示を確認する

## Vercel での簡単な公開案内

1. Git リポジトリを Vercel に接続する
2. 環境変数 `OPENAI_API_KEY` を設定する
3. 必要なら `OPENAI_MODEL` も設定する
4. `NEXT_PUBLIC_SITE_URL` に本番 URL を設定する
5. 必要なら `NEXT_PUBLIC_FEEDBACK_FORM_URL` を設定する
6. デプロイ後に LP、相談フロー、フィードバック導線を確認する

ベータ公開時点では、分析基盤は `lib/analytics.ts` の簡易ログ実装です。将来的に外部分析ツールへ差し替えやすいように分離しています。

## Build / Deploy 前チェック項目

- `npm run build` が通る
- `OPENAI_API_KEY` が Vercel に設定されている
- `NEXT_PUBLIC_SITE_URL` が本番 URL になっている
- フィードバック URL を実運用のものへ差し替えた
- `/` から `/consultation` へ遷移できる
- API エラー時の文言と再試行ボタンを確認した
- 利用上の注意と β 表示が LP と相談画面の両方にある
- モバイル表示を確認した
- OGP 画像と favicon の差し替え要否を確認した

## Vercel での設定注意点

- `OPENAI_API_KEY` は server-side 専用です。`NEXT_PUBLIC_` を付けずに設定してください
- `NEXT_PUBLIC_SITE_URL` は OGP 解決のためクライアント公開してよい値です
- フィードバック URL だけ `NEXT_PUBLIC_FEEDBACK_FORM_URL` としてクライアント公開してよい値です
- OpenAI 呼び出しは `app/api/chat/route.ts` から server-side で実行されます
- localStorage はクライアント側のみで使っているため、SSR では落ちないようにガードしています

## 今後の次ステップ

- モデルごとのトーン差を見ながら `services/ai/prompts.ts` の指示文を微調整する
- OpenAI の構造化出力をより厳密にするため、必要なら軽い runtime validation を追加する
- 応答時間を見ながら要約生成のトークン量と表示文量を調整する
- 履歴の検索やフィルタリングが必要かを、実運用前の確認項目として検討する
- localStorage ベースのログを、必要になった時点で外部 DB やユーザー単位の保存へ移行する
- 次の問いを次回相談開始時のガイドに活かす

## 今後の拡張

- Supabase を使った永続保存
- 認証の追加
- 課金機能の追加

## 今回の修正

- `/api/chat` の 500 を起こしやすかった構造化 JSON の受け取り処理を安定化
- OpenAI 応答が空、または JSON パース失敗でもサーバー側でフォールバックできるように修正
- サーバーログに action/topic/model を残し、原因追跡しやすく修正

## 公開前チェックリスト

- [BETA_CHECKLIST.md](/Users/hagiwaratakashi/Desktop/kokoro-compass/BETA_CHECKLIST.md)
