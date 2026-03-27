export const FEEDBACK_FORM_URL =
  process.env.NEXT_PUBLIC_FEEDBACK_FORM_URL ??
  "https://docs.google.com/forms/d/e/1FAIpQLSfbjCTebmrcvphOcg9eNiUTwlfQAlv48TPfvwUXDV4QcVVQ2A/viewform";

export const BETA_NOTICE_ITEMS = [
  "本サービスは医療行為や診断を行うものではありません。",
  "緊急性の高い状況では、医療機関や公的な相談窓口など専門機関をご利用ください。",
  "ソラの返答は、心の整理を目的とした参考情報です。",
] as const;
