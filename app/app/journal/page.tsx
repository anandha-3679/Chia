"use client";

import Image from "next/image";
import { JournalForm } from "@/components/app/journal/journal-form";
import { JournalEntryRow } from "@/components/app/journal/journal-entry";
import { Skeleton } from "@/components/ui/skeleton";
import { useJournal } from "@/hooks/use-journal";

export default function JournalPage() {
  const { data, isLoading } = useJournal();

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-heading text-2xl font-bold text-primary">Journal</h1>
      <p className="mt-1 text-muted-foreground">
        Log your swaps and keep your streak going.
      </p>

      <div className="mt-6">
        <JournalForm />
      </div>

      <h2 className="mt-8 font-heading text-lg font-semibold text-primary">
        Recent
      </h2>
      <div className="mt-3">
        {isLoading ? (
          <div className="space-y-2">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-16 w-full rounded-2xl" />
            ))}
          </div>
        ) : !data || data.length === 0 ? (
          <div className="flex flex-col items-center rounded-2xl border border-dashed border-border py-12 text-center">
            <Image
              src="/chia-logo.png"
              alt="Chía"
              width={56}
              height={56}
              className="rounded-full opacity-80"
            />
            <p className="mt-3 font-medium text-foreground">No entries yet</p>
            <p className="text-sm text-muted-foreground">
              Log your first swap above to start a streak.
            </p>
          </div>
        ) : (
          <ul className="space-y-2">
            {data.map((entry) => (
              <JournalEntryRow key={entry.id} entry={entry} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
