export const FEEDBACK_FORM_URL =
  process.env.NEXT_PUBLIC_FEEDBACK_FORM_URL ??
  "https://docs.google.com/forms/d/e/1FAIpQLSfbjCTebmrcvphOcg9eNiUTwlfQAlv48TPfvwUXDV4QcVVQ2A/viewform";

export const BETA_NOTICE_ITEMS = [
  "こころの羅針盤は、心の動きを整理し、記録し、振り返るためのサービスです。",
  "医療・法律などの専門的な判断や助言を行うものではありません。",
  "緊急性の高い状況では、医療機関や公的な相談窓口などをご利用ください。",
] as const;
