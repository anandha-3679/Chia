import type { JournalEntry } from "@/types/api";

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function dayKey(d: Date): string {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

/** Entries from the last 7 calendar days (local time). */
export function last7DaysEntries(entries: JournalEntry[]): JournalEntry[] {
  const start = new Date();
  start.setDate(start.getDate() - 6);
  start.setHours(0, 0, 0, 0);
  return entries.filter((e) => new Date(e.created_at) >= start);
}

/** Swaps logged per day over the last 7 days (oldest → today). */
export function swapsPerDay(
  entries: JournalEntry[],
): { day: string; count: number }[] {
  const today = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));
    const key = dayKey(d);
    const count = entries.filter(
      (e) => dayKey(new Date(e.created_at)) === key,
    ).length;
    return { day: DAY_LABELS[d.getDay()], count };
  });
}

/** Top 5 cravings by frequency, with the rest grouped as "other". */
export function cravingBreakdown(
  entries: JournalEntry[],
): { name: string; value: number }[] {
  const counts = new Map<string, number>();
  for (const e of entries) {
    const c = e.craving.trim().toLowerCase();
    counts.set(c, (counts.get(c) ?? 0) + 1);
  }
  const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  const top = sorted.slice(0, 5).map(([name, value]) => ({ name, value }));
  const other = sorted.slice(5).reduce((sum, [, v]) => sum + v, 0);
  if (other > 0) top.push({ name: "other", value: other });
  return top;
}

/** Counts of each logged mood emoji, most frequent first. */
export function moodBreakdown(
  entries: JournalEntry[],
): { mood: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const e of entries) {
    if (!e.mood) continue;
    counts.set(e.mood, (counts.get(e.mood) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([mood, count]) => ({ mood, count }))
    .sort((a, b) => b.count - a.count);
}
