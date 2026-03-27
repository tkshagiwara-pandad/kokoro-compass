import type { Metadata } from "next";
import { ConsultationExperience } from "@/components/ConsultationExperience";

export const metadata: Metadata = {
  title: "今日の記録を残す",
  description:
    "いま心に残っていることを少しずつ言葉にし、ソラと静かに整理しながら記録として残していくページです。",
};

export default function ConsultationPage() {
  return <ConsultationExperience />;
}
