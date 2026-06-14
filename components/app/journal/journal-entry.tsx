import { ArrowRight } from "lucide-react";
import { relativeTime } from "@/lib/format";
import type { JournalEntry } from "@/types/api";

export function JournalEntryRow({ entry }: { entry: JournalEntry }) {
  return (
    <li className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm">
          <span className="text-muted-foreground line-through">
            {entry.craving}
          </span>
          <ArrowRight className="size-3.5 shrink-0 text-brand" />
          <span className="font-medium text-primary">
            {entry.swap_taken}
          </span>
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {relativeTime(entry.created_at)}
        </p>
      </div>
      {entry.mood && <span className="text-xl">{entry.mood}</span>}
    </li>
  );
}
