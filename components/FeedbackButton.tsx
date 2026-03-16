"use client";

import { trackEvent } from "@/lib/analytics";

type FeedbackButtonProps = {
  href: string;
  label?: string;
};

export const FeedbackButton = ({
  href,
  label = "使ってみた感想を送る",
}: FeedbackButtonProps) => {
  const handleClick = () => {
    trackEvent("feedback_clicked", { href });
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="button-secondary inline-flex items-center justify-center"
    >
      {label}
    </a>
  );
};
