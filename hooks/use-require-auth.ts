"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getMe } from "@/lib/api";
import { useAuthStore } from "@/store/auth";

type Mode = "app" | "onboarding";

/**
 * Client-side auth guard.
 * - mode "app":        requires a logged-in, onboarded user (else → /login or /onboarding)
 * - mode "onboarding": requires a logged-in user who is NOT yet onboarded (else → /login or /app/chat)
 *
 * Returns `ready` = true only when it's safe to render the page's content.
 */
export function useRequireAuth({ mode = "app" }: { mode?: Mode } = {}) {
  const router = useRouter();
  const hydrated = useAuthStore((s) => s.hydrated);
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const logout = useAuthStore((s) => s.logout);

  // Load the current user once we have a token but no user object yet.
  useEffect(() => {
    if (!hydrated || !token || user) return;
    let active = true;
    getMe()
      .then((u) => active && setUser(u))
      .catch(() => active && logout());
    return () => {
      active = false;
    };
  }, [hydrated, token, user, setUser, logout]);

  // Handle redirects once we know the auth + onboarding state.
  useEffect(() => {
    if (!hydrated) return;
    if (!token) {
      router.replace("/login");
      return;
    }
    if (!user) return; // still loading the user
    const onboarded = Boolean(user.goal && user.diet_type);
    if (mode === "onboarding" && onboarded) router.replace("/app/chat");
    if (mode === "app" && !onboarded) router.replace("/onboarding");
  }, [hydrated, token, user, mode, router]);

  let ready = false;
  if (hydrated && token && user) {
    const onboarded = Boolean(user.goal && user.diet_type);
    ready = mode === "onboarding" ? !onboarded : onboarded;
  }

  return { user, ready };
}
