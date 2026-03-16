import type { Metadata } from "next";
import { LogExperience } from "@/components/LogExperience";

export const metadata: Metadata = {
  title: "マイログ",
  description:
    "保存した相談履歴から、最近のテーマや気づきの流れを見返せるマイログ画面です。",
};

export default function LogPage() {
  return <LogExperience />;
}
