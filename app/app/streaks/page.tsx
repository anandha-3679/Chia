"use client";

import Link from "next/link";
import { Flame } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { WeekStrip } from "@/components/app/streaks/week-strip";
import { useJournal } from "@/hooks/use-journal";
import { useStreak } from "@/hooks/use-streak";
import { cn } from "@/lib/utils";

function message(streak: number): string {
  if (streak <= 0) return "Log a swap to start your streak 🌱";
  if (streak < 3) return "Nice start — keep it going!";
  if (streak < 7) return "You're building a habit 💪";
  if (streak < 14) return "You're on fire! 🔥";
  return "Incredible consistency! 🌟";
}

export default function StreaksPage() {
  const { data: streak, isLoading } = useStreak();
  const { data: entries } = useJournal();

  const current = streak?.current_streak ?? 0;
  const best = streak?.best_streak ?? 0;

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-heading text-2xl font-bold text-primary">Streaks</h1>
      <p className="mt-1 text-muted-foreground">Consistency beats perfection.</p>

      {isLoading ? (
        <Skeleton className="mt-6 h-56 w-full rounded-3xl" />
      ) : (
        <>
          {/* Hero */}
          <div
            className={cn(
              "mt-6 flex flex-col items-center rounded-3xl border p-8 text-center shadow-sm",
              current > 0
                ? "border-brand/20 bg-gradient-to-br from-brand/15 to-primary/10"
                : "border-border bg-card",
            )}
          >
            <div
              className={cn(
                "flex size-20 items-center justify-center rounded-3xl",
                current > 0 ? "bg-brand/20" : "bg-muted",
              )}
            >
              <Flame
                className={cn(
                  "size-10",
                  current > 0 ? "text-brand" : "text-muted-foreground",
                )}
              />
            </div>
            <p className="mt-4 font-heading text-5xl font-bold text-primary">
              {current}
            </p>
            <p className="text-muted-foreground">
              day{current === 1 ? "" : "s"} streak
            </p>
            <p className="mt-3 font-medium text-foreground">
              {message(current)}
            </p>
            {current === 0 && (
              <Link
                href="/app/journal"
                className={cn(buttonVariants({ variant: "brand" }), "mt-4")}
              >
                Go to Journal
              </Link>
            )}
          </div>

          {/* Stats */}
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-border bg-card p-5 text-center">
              <p className="font-heading text-3xl font-bold text-primary">
                {best}
              </p>
              <p className="text-sm text-muted-foreground">Best streak</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5 text-center">
              <p className="font-heading text-3xl font-bold text-brand">
                {entries?.length ?? 0}
              </p>
              <p className="text-sm text-muted-foreground">Swaps logged</p>
            </div>
          </div>

          {/* This week */}
          <div className="mt-4 rounded-2xl border border-border bg-card p-5">
            <h2 className="font-heading font-semibold text-primary">
              This week
            </h2>
            <div className="mt-4">
              <WeekStrip entries={entries ?? []} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
