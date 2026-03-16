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
            className={`rounded-[24px] border p-4 sm:p-5 ${
              isFuture
                ? "border-gold/32 bg-[linear-gradient(180deg,rgba(255,255,255,1),rgba(248,244,250,0.9))] shadow-[0_12px_30px_rgba(120,106,82,0.08)]"
                : isQuestion
                  ? "border-iris/55 bg-white shadow-[0_18px_42px_rgba(91,77,104,0.12)]"
                  : isEmpathic
                    ? "border-lilac/40 bg-white/90"
                    : "border-lilac/35 bg-mist/34"
            }`}
          >
            <div className="mb-2.5 flex items-center justify-between gap-3">
              <p className="text-[11px] uppercase tracking-[0.22em] text-gold">
                {section.label}
              </p>
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
                  {savedKey === saveKey ? "保存しました" : "この言葉を残す"}
                </button>
              ) : null}
            </div>
            <p className="text-[15px] leading-7 text-ink sm:leading-8">{content}</p>
          </article>
        );
      })}
    </div>
  );
};
