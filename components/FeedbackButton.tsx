"use client";

import { trackEvent } from "@/lib/analytics";

type FeedbackButtonProps = {
  href: string;
  label?: string;
  className?: string;
};

export const FeedbackButton = ({
  href,
  label = "使ってみた感想を送る",
  className,
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
      className={
        className ||
        "inline-flex items-center justify-center rounded-full border border-lilac/45 bg-white/76 px-4 py-2.5 text-sm text-stone transition hover:border-iris/50 hover:bg-white hover:text-plum"
      }
    >
      {label}
    </a>
  );
};
