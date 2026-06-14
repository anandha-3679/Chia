import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Section } from "./section";

export function Hero() {
  return (
    <div className="bg-dots">
      <Section className="pt-12 sm:pt-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Copy */}
          <div className="text-center lg:text-left">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-sm font-medium text-accent-foreground">
              <Sparkles className="size-4" /> AI-powered food swaps
            </span>
            <h1 className="mt-5 font-heading text-4xl font-bold leading-tight text-foreground sm:text-5xl lg:text-6xl">
              Crave smarter.
              <br />
              <span className="text-brand">Eat better.</span>
            </h1>
            <p className="mx-auto mt-5 max-w-md text-lg text-muted-foreground lg:mx-0">
              Tell Chía what you&apos;re craving and get a healthier swap that
              hits the same spot — then build streaks and watch your habits
              improve.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <Link
                href="/signup"
                className={cn(buttonVariants({ variant: "brand", size: "lg" }))}
              >
                Get started free <ArrowRight className="size-4" />
              </Link>
              <a
                href="#how"
                className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
              >
                How it works
              </a>
            </div>
          </div>

          {/* Sample swap card */}
          <div className="relative flex justify-center">
            <div className="relative w-full max-w-sm">
              <div className="absolute -inset-4 rounded-[2.5rem] bg-brand/10 blur-2xl" />
              <div className="relative rounded-3xl border border-border bg-card p-6 shadow-xl">
                <div className="flex items-center gap-3">
                  <Image
                    src="/chia-logo.png"
                    alt="Chía mascot"
                    width={56}
                    height={56}
                    className="rounded-full"
                  />
                  <div>
                    <p className="font-heading font-semibold text-brand">
                      Chía
                    </p>
                    <p className="text-xs text-muted-foreground">
                      your craving coach
                    </p>
                  </div>
                </div>

                <div className="mt-4 ml-auto w-fit rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-sm text-primary-foreground">
                  I&apos;m craving chips 🥔
                </div>

                <div className="mt-3 w-fit rounded-2xl rounded-bl-sm bg-brand/10 px-4 py-3">
                  <p className="text-sm font-semibold text-foreground">
                    Try roasted makhana
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Lower oil, same satisfying crunch.
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {["popcorn", "roasted nuts"].map((a) => (
                      <span
                        key={a}
                        className="rounded-full bg-secondary px-2.5 py-0.5 text-xs text-secondary-foreground"
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
