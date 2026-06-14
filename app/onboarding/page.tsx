"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OptionCard } from "@/components/onboarding/option-card";
import { useCompleteOnboarding } from "@/hooks/use-auth";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { DIETS, GOALS } from "@/lib/profile-options";
import type { DietType, Goal } from "@/types/api";

const TOTAL = 3;

export default function OnboardingPage() {
  const { user, ready } = useRequireAuth({ mode: "onboarding" });
  const complete = useCompleteOnboarding();

  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [goal, setGoal] = useState<Goal | null>(null);
  const [diet, setDiet] = useState<DietType | null>(null);

  // Prefill the name from the account once the user loads.
  useEffect(() => {
    if (user?.name) setName(user.name);
  }, [user]);

  if (!ready || !user) {
    return (
      <div className="flex min-h-screen flex-1 items-center justify-center">
        <Loader2 className="size-6 animate-spin text-brand" />
      </div>
    );
  }

  const canContinue =
    (step === 0 && name.trim().length > 0) ||
    (step === 1 && goal !== null) ||
    (step === 2 && diet !== null);

  function finish() {
    if (!goal || !diet) return;
    complete.mutate({ name: name.trim(), goal, diet_type: diet });
  }

  const progress = ((step + 1) / TOTAL) * 100;

  return (
    <div className="bg-dots flex min-h-screen flex-1 flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Step {step + 1} of {TOTAL}
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-brand transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex justify-center">
            <Image
              src="/chia-logo.png"
              alt="Chía"
              width={56}
              height={56}
              className="rounded-full"
            />
          </div>

          {/* Step 0 — Welcome + name */}
          {step === 0 && (
            <div>
              <h1 className="text-center font-heading text-2xl font-bold text-foreground">
                Hi{user.name ? ` ${user.name}` : ""}! 👋
              </h1>
              <p className="mt-2 text-center text-muted-foreground">
                Let&apos;s set up your coaching. What should we call you?
              </p>
              <div className="mt-6 space-y-1.5">
                <Label htmlFor="name">Your name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Anu"
                />
              </div>
            </div>
          )}

          {/* Step 1 — Goal */}
          {step === 1 && (
            <div>
              <h1 className="text-center font-heading text-2xl font-bold text-foreground">
                What&apos;s your goal?
              </h1>
              <p className="mt-2 text-center text-muted-foreground">
                We&apos;ll tailor your swaps to this.
              </p>
              <div className="mt-6 space-y-3">
                {GOALS.map((g) => (
                  <OptionCard
                    key={g.value}
                    selected={goal === g.value}
                    onClick={() => setGoal(g.value)}
                    icon={g.icon}
                    title={g.title}
                    description={g.description}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Step 2 — Diet */}
          {step === 2 && (
            <div>
              <h1 className="text-center font-heading text-2xl font-bold text-foreground">
                What&apos;s your diet?
              </h1>
              <p className="mt-2 text-center text-muted-foreground">
                So we never suggest something you won&apos;t eat.
              </p>
              <div className="mt-6 space-y-3">
                {DIETS.map((d) => (
                  <OptionCard
                    key={d.value}
                    selected={diet === d.value}
                    onClick={() => setDiet(d.value)}
                    icon={d.icon}
                    title={d.title}
                    description={d.description}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-8 flex gap-3">
            {step > 0 && (
              <Button
                variant="outline"
                onClick={() => setStep((s) => s - 1)}
                disabled={complete.isPending}
              >
                <ArrowLeft className="size-4" /> Back
              </Button>
            )}
            {step < TOTAL - 1 ? (
              <Button
                variant="brand"
                className="flex-1"
                onClick={() => setStep((s) => s + 1)}
                disabled={!canContinue}
              >
                Continue <ArrowRight className="size-4" />
              </Button>
            ) : (
              <Button
                variant="brand"
                className="flex-1"
                onClick={finish}
                disabled={!canContinue || complete.isPending}
              >
                {complete.isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" /> Saving…
                  </>
                ) : (
                  "Finish"
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
