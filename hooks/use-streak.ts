"use client";

import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { useAuthStore } from "@/store/auth";
import type { Streak } from "@/types/api";

export function useStreak() {
  const token = useAuthStore((s) => s.token);
  return useQuery({
    queryKey: ["streak"],
    queryFn: () => apiFetch<Streak>("/streak"),
    enabled: Boolean(token),
  });
}
