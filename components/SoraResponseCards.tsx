"use client";

import { useState } from "react";
import { saveSoraNote } from "@/lib/sora-notes";
import { SoraReply } from "@/types/consultation";

type SoraResponseCardsProps = {
  reply: SoraReply | null;
  sections?: Array<"empathicMessage" | "followUpQuestion" | "insight" | "futureMessage">;
};

const allSections = [
  { key: "empathicMessage", label: "共感" },
  { key: "followUpQuestion", label: "いまの問い" },
  { key: "insight", label: "小さな気づき" },
  { key: "futureMessage", label: "未来のあなたからの言葉" },
] as const;

export const SoraResponseCards = ({
  reply,
  sections = ["empathicMessage", "followUpQuestion", "insight", "futureMessage"],
}: SoraResponseCardsProps) => {
  const [savedKey, setSavedKey] = useState<string | null>(null);

  if (!reply) {
    return null;
  }

  return (
    <div className="grid gap-4">
      {allSections
        .filter((section) =>
          sections.includes(
            section.key as
              | "empathicMessage"
              | "followUpQuestion"
              | "insight"
              | "futureMessage",
          ),
        )
        .map((section) => {
        const content = reply[section.key];
        if (!content) {
          return null;
        }

        const isFuture = section.key === "futureMessage";
        const isQuestion = section.key === "followUpQuestion";
        const isEmpathic = section.key === "empathicMessage";
        const canSave = !isQuestion;
        const saveKey = `${section.key}:${content}`;

        return (
          <article
            key={section.key}
            className={`rounded-2xl border bg-white p-4 shadow-sm sm:p-5 ${
              isFuture
                ? "border-gold/22 bg-[linear-gradient(180deg,rgba(255,255,255,1),rgba(248,244,250,0.75))]"
                : isQuestion
                  ? "border-gray-100"
                  : isEmpathic
                    ? "border-gray-100"
                    : "border-gray-100 bg-mist/16"
            }`}
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {isEmpathic ? (
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-lilac/70" aria-hidden="true" />
                ) : null}
                <p className="text-[11px] uppercase tracking-[0.18em] text-plum/62">
                  {isEmpathic ? "ソラ" : section.label}
                </p>
              </div>
              {canSave ? (
                <button
                  type="button"
                  onClick={() => {
                    const saved = saveSoraNote({
                      label: section.label,
                      content,
                    });

                    if (saved) {
                      setSavedKey(saveKey);
                    }
                  }}
                  className="text-xs text-stone/72 transition hover:text-plum"
                >
                  {savedKey === saveKey ? "保存しました" : "この言葉を心のメモに残す"}
                </button>
              ) : null}
            </div>
            <div className="max-w-prose space-y-4">
              {content.split("\n").filter(Boolean).map((paragraph, index) => (
                <p key={`${section.key}-${index}`} className="text-[15px] leading-7 text-ink sm:text-base sm:leading-8">
                  {paragraph}
                </p>
              ))}
            </div>
          </article>
        );
      })}
    </div>
  );
};
