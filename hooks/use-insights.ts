"use client";

import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { useAuthStore } from "@/store/auth";
import type { WeeklyInsights } from "@/types/api";

export function useInsights() {
  const token = useAuthStore((s) => s.token);
  return useQuery({
    queryKey: ["insights", "weekly"],
    queryFn: () => apiFetch<WeeklyInsights>("/insights/weekly"),
    enabled: Boolean(token),
    staleTime: 5 * 60_000, // it's an AI call — cache for 5 minutes
  });
}
