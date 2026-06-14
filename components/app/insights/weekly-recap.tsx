import Image from "next/image";
import { Lightbulb } from "lucide-react";
import type { WeeklyInsights } from "@/types/api";

export function WeeklyRecap({ insights }: { insights: WeeklyInsights }) {
  return (
    <div className="rounded-3xl border border-brand/20 bg-gradient-to-br from-brand/15 to-primary/10 p-6 shadow-sm">
      <div className="flex items-start gap-3">
        <Image
          src="/chia-logo.png"
          alt="Chía"
          width={44}
          height={44}
          className="shrink-0 rounded-full"
        />
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-brand">
            Your week with Chía
          </p>
          <p className="mt-1 font-heading text-lg font-semibold text-primary">
            {insights.summary}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-start gap-2 rounded-2xl bg-card/70 p-3">
        <Lightbulb className="mt-0.5 size-4 shrink-0 text-brand" />
        <p className="text-sm text-foreground">{insights.improvement_tip}</p>
      </div>
    </div>
  );
}
