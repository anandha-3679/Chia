import { Quote } from "lucide-react";
import { Section } from "./section";

const testimonials = [
  { name: "Priya", role: "lost 4 kg", quote: "I stopped fighting my snack cravings and started swapping them. The makhana suggestion is now my go-to." },
  { name: "Arjun", role: "healthier eater", quote: "It's like texting a friend who happens to be a nutritionist. The swaps actually taste good." },
  { name: "Meera", role: "28-day streak", quote: "The streak keeps me honest. I log every evening and the weekly recap genuinely motivates me." },
  { name: "Dev", role: "desk snacker", quote: "Chips were my weakness. Now I reach for roasted nuts without even thinking about it." },
  { name: "Sara", role: "busy mom", quote: "Quick, kind, and never preachy. I love that it gives reasons, not rules." },
];

function TestimonialCard({
  name,
  role,
  quote,
}: {
  name: string;
  role: string;
  quote: string;
}) {
  return (
    <figure className="w-80 shrink-0 rounded-3xl border border-border bg-card p-6 shadow-sm">
      <Quote className="size-6 text-brand/40" />
      <blockquote className="mt-3 text-sm text-foreground">
        &ldquo;{quote}&rdquo;
      </blockquote>
      <figcaption className="mt-4 flex items-center gap-3">
        <span className="flex size-9 items-center justify-center rounded-full bg-brand/10 font-heading font-semibold text-brand">
          {name[0]}
        </span>
        <span className="text-sm">
          <span className="block font-semibold text-foreground">{name}</span>
          <span className="text-muted-foreground">{role}</span>
        </span>
      </figcaption>
    </figure>
  );
}

export function Testimonials() {
  return (
    <Section className="bg-secondary/40">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
          Loved by snackers everywhere
        </h2>
      </div>

      <div className="group relative mt-12 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <div className="flex w-max gap-5 animate-marquee group-hover:[animation-play-state:paused]">
          {[...testimonials, ...testimonials].map((t, i) => (
            <TestimonialCard key={`${t.name}-${i}`} {...t} />
          ))}
        </div>
      </div>
    </Section>
  );
}
