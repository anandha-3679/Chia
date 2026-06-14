"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function OptionCard({
  selected,
  onClick,
  icon,
  title,
  description,
}: {
  selected: boolean;
  onClick: () => void;
  icon: string;
  title: string;
  description?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "relative flex w-full items-center gap-4 rounded-2xl border-2 bg-card p-4 text-left transition-all",
        selected
          ? "border-brand bg-brand/5"
          : "border-border hover:border-brand/40",
      )}
    >
      <span className="text-3xl" aria-hidden>
        {icon}
      </span>
      <span className="flex-1">
        <span className="block font-heading font-semibold text-foreground">
          {title}
        </span>
        {description && (
          <span className="block text-sm text-muted-foreground">
            {description}
          </span>
        )}
      </span>
      {selected && (
        <span className="flex size-6 items-center justify-center rounded-full bg-brand text-brand-foreground">
          <Check className="size-4" />
        </span>
      )}
    </button>
  );
}
