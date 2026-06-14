import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Section } from "./section";

export function CtaBand() {
  return (
    <Section>
      <div className="relative overflow-hidden rounded-[2rem] bg-primary px-6 py-16 text-center shadow-lg">
        <div className="bg-dots absolute inset-0 opacity-10" />
        <div className="relative">
          <h2 className="mx-auto max-w-xl font-heading text-3xl font-bold text-primary-foreground sm:text-4xl">
            Ready to crave smarter?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-primary-foreground/80">
            Join Chía and turn your next craving into a better choice.
          </p>
          <Link
            href="/signup"
            className={cn(
              buttonVariants({ variant: "brand", size: "lg" }),
              "mt-8",
            )}
          >
            Get started free <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </Section>
  );
}
