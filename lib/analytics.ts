type AnalyticsEvent =
  | "lp_viewed"
  | "lp_cta_clicked"
  | "consultation_started"
  | "consultation_completed"
  | "feedback_clicked";

type AnalyticsPayload = Record<string, string | number | boolean | undefined>;

export const trackEvent = (
  eventName: AnalyticsEvent,
  payload: AnalyticsPayload = {},
) => {
  if (process.env.NODE_ENV !== "production") {
    console.info("[analytics]", eventName, payload);
  }
};
