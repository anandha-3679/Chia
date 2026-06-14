import { BarChart3, Bot, Flame, NotebookPen } from "lucide-react";
import { cn } from "@/lib/utils";
import { Section } from "./section";

function ChatVisual() {
  return (
    <div className="space-y-2.5">
      <div className="ml-auto w-fit rounded-2xl rounded-br-sm bg-primary px-4 py-2 text-sm text-primary-foreground">
        craving something sweet 🍫
      </div>
      <div className="w-fit rounded-2xl rounded-bl-sm bg-brand/10 px-4 py-2 text-sm text-foreground">
        Try a few dates with peanut butter — sweet, rich, naturally energizing.
      </div>
    </div>
  );
}

function JournalVisual() {
  return (
    <div className="space-y-2">
      {[
        { c: "chips", s: "roasted makhana", m: "😋" },
        { c: "soda", s: "sparkling water + lime", m: "💪" },
        { c: "ice cream", s: "banana nice cream", m: "😌" },
      ].map((e) => (
        <div
          key={e.c}
          className="flex items-center justify-between rounded-xl bg-muted px-3 py-2 text-sm"
        >
          <span className="text-muted-foreground line-through">{e.c}</span>
          <span className="font-medium text-foreground">→ {e.s}</span>
          <span>{e.m}</span>
        </div>
      ))}
    </div>
  );
}

function StreakVisual() {
  return (
    <div className="flex items-center gap-4">
      <div className="flex size-20 items-center justify-center rounded-3xl bg-brand/10">
        <Flame className="size-9 text-brand" />
      </div>
      <div>
        <p className="font-heading text-4xl font-bold text-foreground">12</p>
        <p className="text-sm text-muted-foreground">day streak · best 18</p>
      </div>
    </div>
  );
}

function InsightsVisual() {
  const bars = [40, 65, 50, 80, 60, 90, 75];
  return (
    <div className="flex h-32 items-end gap-2">
      {bars.map((h, i) => (
        <div
          key={i}
          className="flex-1 rounded-t-md bg-brand"
          style={{ height: `${h}%`, opacity: 0.55 + (h / 100) * 0.45 }}
        />
      ))}
    </div>
  );
}

const features = [
  {
    icon: Bot,
    title: "An AI coach for every craving",
    body: "Chía understands what you want and suggests a genuinely healthier swap that satisfies the same craving — never generic advice.",
    visual: <ChatVisual />,
  },
  {
    icon: NotebookPen,
    title: "Journal what you actually ate",
    body: "Log your swaps with a mood, and keep an honest, judgement-free record of your choices over time.",
    visual: <JournalVisual />,
  },
  {
    icon: Flame,
    title: "Streaks that keep you going",
    body: "Log a swap each day to grow your streak. Miss a day and pick right back up — progress over perfection.",
    visual: <StreakVisual />,
  },
  {
    icon: BarChart3,
    title: "Weekly insights that motivate",
    body: "See your total swaps, top cravings, and a friendly recap each week so you always know you're improving.",
    visual: <InsightsVisual />,
  },
];

export function Features() {
  return (
    <Section id="features" className="bg-secondary/40">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
          Everything you need to crave smarter
        </h2>
        <p className="mt-3 text-muted-foreground">
          Four simple tools that work together.
        </p>
      </div>

      <div className="mt-16 space-y-16">
        {features.map((f, i) => (
          <div
            key={f.title}
            className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16"
          >
            <div className={cn(i % 2 === 1 && "lg:order-2")}>
              <div className="flex size-12 items-center justify-center rounded-2xl bg-brand/10 text-brand">
                <f.icon className="size-6" />
              </div>
              <h3 className="mt-5 font-heading text-2xl font-bold text-foreground">
                {f.title}
              </h3>
              <p className="mt-3 text-muted-foreground">{f.body}</p>
            </div>
            <div className={cn(i % 2 === 1 && "lg:order-1")}>
              <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
                {f.visual}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
