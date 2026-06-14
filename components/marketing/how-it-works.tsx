import { Flame, Leaf, MessageCircle } from "lucide-react";
import { Section } from "./section";

const steps = [
  {
    icon: MessageCircle,
    title: "Tell Chía your craving",
    body: "Type whatever you're craving — chips, ice cream, biryani. No judgement.",
  },
  {
    icon: Leaf,
    title: "Get a healthier swap",
    body: "Chía suggests a swap that satisfies the same craving, with a reason and alternatives.",
  },
  {
    icon: Flame,
    title: "Build your streak",
    body: "Log what you chose, keep your streak alive, and see your habits improve weekly.",
  },
];

export function HowItWorks() {
  return (
    <Section id="how">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
          How Chía works
        </h2>
        <p className="mt-3 text-muted-foreground">
          Three steps to turn cravings into better choices.
        </p>
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {steps.map((step, i) => (
          <div
            key={step.title}
            className="relative rounded-3xl border border-border bg-card p-7 shadow-sm"
          >
            <span className="absolute right-6 top-6 font-heading text-4xl font-bold text-muted/70">
              {i + 1}
            </span>
            <div className="flex size-12 items-center justify-center rounded-2xl bg-brand/10 text-brand">
              <step.icon className="size-6" />
            </div>
            <h3 className="mt-5 font-heading text-xl font-semibold text-foreground">
              {step.title}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">{step.body}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
