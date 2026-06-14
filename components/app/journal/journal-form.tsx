"use client";

import { useState } from "react";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useAddJournal } from "@/hooks/use-journal";

const MOODS = ["😋", "💪", "😐", "😅", "😞"];

export function JournalForm() {
  const [craving, setCraving] = useState("");
  const [swapTaken, setSwapTaken] = useState("");
  const [mood, setMood] = useState<string | null>(null);
  const add = useAddJournal();

  const valid = craving.trim().length > 0 && swapTaken.trim().length > 0;

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid) return;
    add.mutate(
      {
        craving: craving.trim(),
        swap_taken: swapTaken.trim(),
        mood: mood ?? undefined,
      },
      {
        onSuccess: () => {
          toast.success("Logged! Streak updated 🔥");
          setCraving("");
          setSwapTaken("");
          setMood(null);
        },
        onError: () => toast.error("Couldn't log that. Try again."),
      },
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6"
    >
      <h2 className="flex items-center gap-2 font-heading text-lg font-semibold text-primary">
        <span className="flex size-7 items-center justify-center rounded-lg bg-brand/15 text-brand">
          <Plus className="size-4" />
        </span>
        Log a swap
      </h2>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="craving">Craving</Label>
          <Input
            id="craving"
            placeholder="chips"
            value={craving}
            onChange={(e) => setCraving(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="swap">I had instead</Label>
          <Input
            id="swap"
            placeholder="roasted makhana"
            value={swapTaken}
            onChange={(e) => setSwapTaken(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-4">
        <Label>Mood (optional)</Label>
        <div className="mt-2 flex gap-2">
          {MOODS.map((m) => (
            <button
              key={m}
              type="button"
              aria-pressed={mood === m}
              onClick={() => setMood((cur) => (cur === m ? null : m))}
              className={cn(
                "flex size-10 items-center justify-center rounded-full border-2 text-xl transition-all",
                mood === m
                  ? "border-brand bg-brand/10"
                  : "border-border hover:border-brand/40",
              )}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <Button
        type="submit"
        variant="brand"
        className="mt-5 w-full sm:w-auto"
        disabled={add.isPending || !valid}
      >
        {add.isPending ? (
          <>
            <Loader2 className="size-4 animate-spin" /> Logging…
          </>
        ) : (
          "Log it"
        )}
      </Button>
    </form>
  );
}
