import { Check, X } from "lucide-react";
import { Section } from "./section";

const oldWay = [
  "Relying on willpower alone",
  "Guessing what's actually healthier",
  "No idea if you're improving",
  "Giving up after one slip",
];

const chiaWay = [
  "Instant AI swaps for any craving",
  "A reason + alternatives every time",
  "Weekly insights on your habits",
  "Streaks that keep you going",
];

export function Comparison() {
  return (
    <Section>
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
          The old way vs Chía
        </h2>
        <p className="mt-3 text-muted-foreground">
          Stop white-knuckling your cravings.
        </p>
      </div>

      <div className="mx-auto mt-12 grid max-w-3xl gap-6 md:grid-cols-2">
        {/* Old way */}
        <div className="rounded-3xl border border-border bg-card p-7">
          <h3 className="font-heading text-lg font-semibold text-muted-foreground">
            The old way
          </h3>
          <ul className="mt-5 space-y-4">
            {oldWay.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <X className="size-3.5" />
                </span>
                <span className="text-sm text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Chía way */}
        <div className="rounded-3xl border-2 border-brand/30 bg-brand/5 p-7">
          <h3 className="font-heading text-lg font-semibold text-brand">
            With Chía
          </h3>
          <ul className="mt-5 space-y-4">
            {chiaWay.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-brand text-brand-foreground">
                  <Check className="size-3.5" />
                </span>
                <span className="text-sm font-medium text-foreground">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
