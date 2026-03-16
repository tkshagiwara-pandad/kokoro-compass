import type { Metadata } from "next";
import { ConsultationExperience } from "@/components/ConsultationExperience";

export const metadata: Metadata = {
  title: "相談を始める",
  description:
    "ソラとの対話を通じて、恋愛・仕事・人間関係などの悩みを静かに整理する相談画面です。",
};

export default function ConsultationPage() {
  return <ConsultationExperience />;
}
