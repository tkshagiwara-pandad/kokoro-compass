# ベータ公開前チェックリスト

- `.env.local` に `OPENAI_API_KEY` を設定した
- `OPENAI_MODEL` を必要に応じて調整した
- `NEXT_PUBLIC_SITE_URL` を設定した
- 必要なら `NEXT_PUBLIC_FEEDBACK_FORM_URL` を設定した
- `npm run dev` で LP と相談画面の両方が開ける
- `npm run build` が通る
- OpenAI API の応答が正常に返る
- フィードバックフォーム URL を `NEXT_PUBLIC_FEEDBACK_FORM_URL` または `lib/config.ts` で実URLに差し替えた
- LP と相談画面の利用上の注意が表示されている
- モバイル表示を確認した
- API エラー時の文言と再試行導線を確認した
- β版表示が LP と相談画面の両方で見える
- OGP 画像と favicon の表示を確認した
