"use client";

import { useState } from "react";
import { Loader2, LogOut, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OptionCard } from "@/components/onboarding/option-card";
import { useLogout, useUpdateProfile } from "@/hooks/use-auth";
import { DIETS, GOALS } from "@/lib/profile-options";
import { useAuthStore } from "@/store/auth";
import type { DietType, Goal } from "@/types/api";

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const update = useUpdateProfile();
  const logout = useLogout();

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name ?? "");
  const [goal, setGoal] = useState<Goal | null>(user?.goal ?? null);
  const [diet, setDiet] = useState<DietType | null>(user?.diet_type ?? null);

  if (!user) return null;

  const goalOpt = GOALS.find((g) => g.value === user.goal);
  const dietOpt = DIETS.find((d) => d.value === user.diet_type);
  const initial = (user.name || user.email || "?").charAt(0).toUpperCase();

  const changed =
    name.trim() !== (user.name ?? "") ||
    goal !== user.goal ||
    diet !== user.diet_type;
  const valid = name.trim().length > 0 && goal !== null && diet !== null;

  function startEdit() {
    // Sync the form with the latest saved values before editing.
    setName(user!.name ?? "");
    setGoal(user!.goal ?? null);
    setDiet(user!.diet_type ?? null);
    setEditing(true);
  }

  function onSave() {
    if (!valid || !goal || !diet) return;
    update.mutate(
      { name: name.trim(), goal, diet_type: diet },
      { onSuccess: () => setEditing(false) },
    );
  }

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="font-heading text-2xl font-bold text-primary">Profile</h1>
      <p className="mt-1 text-muted-foreground">
        Manage your details and preferences.
      </p>

      <div className="mt-6 rounded-3xl border border-border bg-card p-6 shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-brand/15 font-heading text-lg font-semibold text-brand">
              {initial}
            </span>
            <div className="min-w-0">
              <p className="truncate font-heading font-semibold text-foreground">
                {user.name || "You"}
              </p>
              <p className="truncate text-sm text-muted-foreground">
                {user.email}
              </p>
            </div>
          </div>
          {!editing && (
            <Button variant="outline" size="sm" onClick={startEdit}>
              <Pencil className="size-4" /> Edit
            </Button>
          )}
        </div>

        {editing ? (
          /* ---------- Edit mode ---------- */
          <div className="mt-6">
            <div className="space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="mt-5">
              <Label>Goal</Label>
              <div className="mt-2 space-y-2">
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

            <div className="mt-5">
              <Label>Diet</Label>
              <div className="mt-2 space-y-2">
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

            <div className="mt-6 flex gap-3">
              <Button
                variant="brand"
                onClick={onSave}
                disabled={!changed || !valid || update.isPending}
              >
                {update.isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" /> Saving…
                  </>
                ) : (
                  "Save changes"
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => setEditing(false)}
                disabled={update.isPending}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          /* ---------- View mode ---------- */
          <dl className="mt-6 divide-y divide-border border-t border-border">
            <InfoRow label="Name" value={user.name || "—"} />
            <InfoRow
              label="Goal"
              value={goalOpt ? `${goalOpt.icon} ${goalOpt.title}` : "—"}
            />
            <InfoRow
              label="Diet"
              value={dietOpt ? `${dietOpt.icon} ${dietOpt.title}` : "—"}
            />
          </dl>
        )}
      </div>

      <Button variant="outline" className="mt-4" onClick={logout}>
        <LogOut className="size-4" /> Log out
      </Button>
    </div>
  );
}
