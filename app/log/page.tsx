import type { Metadata } from "next";
import { LogExperience } from "@/components/LogExperience";

export const metadata: Metadata = {
  title: "心の地図",
  description: "残してきた言葉を、あとから静かにたどれます。",
};

export default function LogPage() {
  return <LogExperience />;
}
