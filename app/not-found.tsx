import Link from "next/link";
import { LayoutShell } from "@/components/LayoutShell";

export default function NotFound() {
  return (
    <LayoutShell
      eyebrow="Kokoro Compass"
      title="ページが見つかりません"
      description="開こうとしたページは移動したか、見つかりませんでした。トップページからもう一度お試しください。"
      backLink={{ href: "/", label: "トップへ戻る" }}
    >
      <main className="surface-card p-8 text-center">
        <p className="text-sm leading-7 text-stone">
          お探しのページは見つかりませんでした。もう一度言葉を残したいときは、トップページからお入りください。
        </p>
        <div className="mt-6 flex justify-center">
          <Link href="/" className="button-primary">
            トップページへ
          </Link>
        </div>
      </main>
    </LayoutShell>
  );
}
