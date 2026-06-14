"use client";

import { cn } from "@/lib/utils";
import type { JournalEntry } from "@/types/api";

const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

/** Local YYYY-M-D key so dots reflect the user's perceived "day". */
function localKey(d: Date): string {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

export function WeekStrip({ entries }: { entries: JournalEntry[] }) {
  const logged = new Set(entries.map((e) => localKey(new Date(e.created_at))));
  const today = new Date();

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i)); // oldest → today
    return d;
  });

  return (
    <div className="flex justify-between gap-2">
      {days.map((d, i) => {
        const active = logged.has(localKey(d));
        const isToday = i === 6;
        return (
          <div key={i} className="flex flex-1 flex-col items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {DAY_LABELS[d.getDay()]}
            </span>
            <div
              className={cn(
                "flex aspect-square w-full max-w-12 items-center justify-center rounded-2xl border text-sm font-medium",
                active
                  ? "border-brand bg-brand text-brand-foreground"
                  : "border-border bg-muted/40 text-muted-foreground",
                isToday && !active && "border-brand/50",
              )}
            >
              {d.getDate()}
            </div>
          </div>
        );
      })}
    </div>
  );
}
