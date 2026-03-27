import Link from "next/link";
import { ReactNode } from "react";
import { BetaBadge } from "@/components/BetaBadge";

type LayoutShellProps = {
  children: ReactNode;
  eyebrow: string;
  title: string;
  description: string;
  backLink?: {
    href: string;
    label: string;
  };
};

export const LayoutShell = ({
  children,
  eyebrow,
  title,
  description,
  backLink,
}: LayoutShellProps) => {
  return (
    <div className="min-h-screen text-ink">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <header className="mb-8 flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="font-serif text-xs uppercase tracking-[0.38em] text-gold sm:text-sm">
              {eyebrow}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <BetaBadge />
              {backLink ? (
                <Link href={backLink.href} className="text-sm text-stone transition hover:text-plum">
                  {backLink.label}
                </Link>
              ) : null}
            </div>
          </div>
          <div className="space-y-3">
            <h1 className="font-serif text-3xl text-plum sm:text-4xl lg:text-[2.8rem]">{title}</h1>
            <p className="max-w-3xl text-sm leading-7 text-stone sm:text-base">{description}</p>
          </div>
        </header>
        {children}
        <footer className="mt-8 rounded-[24px] border border-lilac/30 bg-white/62 px-5 py-4 shadow-soft">
          <p className="text-[11px] uppercase tracking-[0.2em] text-plum/62">ソラについて</p>
          <p className="mt-2 text-sm leading-7 text-stone">
            ソラは、あなたの心を整理するための静かな伴走者です。
            答えを決める存在ではなく、気持ちを言葉にしやすくするためにそっとそばにいます。
          </p>
          <p className="mt-2 text-xs leading-6 text-stone/78">
            このサービスは医療・法律などの専門助言を提供するものではありません。
          </p>
        </footer>
      </div>
    </div>
  );
};
