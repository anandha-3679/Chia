"use client";

import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { CravingDonut } from "@/components/app/insights/craving-donut";
import { MoodChart } from "@/components/app/insights/mood-chart";
import { SwapsBarChart } from "@/components/app/insights/swaps-bar-chart";
import { WeeklyRecap } from "@/components/app/insights/weekly-recap";
import { useInsights } from "@/hooks/use-insights";
import { useJournal } from "@/hooks/use-journal";
import {
  cravingBreakdown,
  last7DaysEntries,
  moodBreakdown,
  swapsPerDay,
} from "@/lib/insights";
import { cn } from "@/lib/utils";

function StatCard({
  value,
  label,
  valueClassName,
}: {
  value: React.ReactNode;
  label: string;
  valueClassName?: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 text-center sm:p-5">
      <p
        className={cn(
          "font-heading font-bold",
          valueClassName ?? "text-3xl text-brand",
        )}
      >
        {value}
      </p>
      <p className="mt-1 text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <h2 className="font-heading font-semibold text-primary">{title}</h2>
      <div className="mt-4">{children}</div>
    </div>
  );
}

export default function InsightsPage() {
  const { data: insights, isLoading } = useInsights();
  const { data: entries } = useJournal();

  const week = last7DaysEntries(entries ?? []);
  const perDay = swapsPerDay(entries ?? []);
  const cravings = cravingBreakdown(week);
  const moods = moodBreakdown(week);
  const hasData = (insights?.total_swaps ?? 0) > 0 || week.length > 0;

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-heading text-2xl font-bold text-primary">
        Weekly Insights
      </h1>
      <p className="mt-1 text-muted-foreground">Your last 7 days at a glance.</p>

      {isLoading ? (
        <Skeleton className="mt-6 h-32 w-full rounded-3xl" />
      ) : !hasData ? (
        <div className="mt-6 flex flex-col items-center rounded-3xl border border-dashed border-border py-12 text-center">
          <Image
            src="/chia-logo.png"
            alt="Chía"
            width={56}
            height={56}
            className="rounded-full opacity-80"
          />
          <p className="mt-3 font-medium text-foreground">No insights yet</p>
          <p className="text-sm text-muted-foreground">
            Log a few swaps this week to see your recap and charts.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-6">
          {insights && <WeeklyRecap insights={insights} />}

          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            <StatCard
              value={insights?.total_swaps ?? week.length}
              label="Swaps"
            />
            <StatCard
              value={`${insights?.active_days ?? 0}/7`}
              label="Active days"
              valueClassName="text-3xl text-primary"
            />
            <StatCard
              value={insights?.top_craving ?? "—"}
              label="Top craving"
              valueClassName="truncate text-lg text-brand capitalize"
            />
          </div>

          <ChartCard title="Swaps this week">
            <SwapsBarChart data={perDay} />
          </ChartCard>

          <div className="grid gap-6 md:grid-cols-2">
            <ChartCard title="Top cravings">
              {cravings.length > 0 ? (
                <CravingDonut data={cravings} />
              ) : (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No cravings logged yet.
                </p>
              )}
            </ChartCard>
            <ChartCard title="Moods">
              {moods.length > 0 ? (
                <MoodChart data={moods} />
              ) : (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No moods logged yet.
                </p>
              )}
            </ChartCard>
          </div>
        </div>
      )}
    </div>
  );
}
