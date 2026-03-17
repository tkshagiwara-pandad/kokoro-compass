import type { Metadata } from "next";
import { LogExperience } from "@/components/LogExperience";

export const metadata: Metadata = {
  title: "あなたの心の地図",
  description:
    "こころの羅針盤で残された言葉から、あなたの心の動きを静かにたどることができます。",
};

export default function LogPage() {
  return <LogExperience />;
}
