"use client";

import { trackEvent } from "@/lib/analytics";
import { DEFAULT_FEEDBACK_FORM_URL } from "@/lib/config";

type FeedbackButtonProps = {
  href: string;
  label?: string;
};

export const FeedbackButton = ({
  href,
  label = "使ってみた感想を送る",
}: FeedbackButtonProps) => {
  const isPlaceholder = href === DEFAULT_FEEDBACK_FORM_URL;

  const handleClick = () => {
    trackEvent("feedback_clicked", { href });
  };

  if (isPlaceholder) {
    return (
      <button
        type="button"
        disabled
        className="button-secondary inline-flex items-center justify-center"
        title="公開前にフィードバックフォーム URL を設定してください。"
      >
        {label}
      </button>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      onClick={handleClick}
      className="button-secondary inline-flex items-center justify-center"
    >
      {label}
    </a>
  );
};
