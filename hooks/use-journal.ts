"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { useAuthStore } from "@/store/auth";
import type { JournalEntry } from "@/types/api";

export function useJournal() {
  const token = useAuthStore((s) => s.token);
  return useQuery({
    queryKey: ["journal"],
    queryFn: () => apiFetch<JournalEntry[]>("/journal"),
    enabled: Boolean(token),
  });
}

export function useAddJournal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (vars: {
      craving: string;
      swap_taken: string;
      mood?: string;
    }) => apiFetch<JournalEntry>("/journal", { method: "POST", json: vars }),
    onSuccess: () => {
      // Refresh the list and the streak badge (logging advances the streak).
      queryClient.invalidateQueries({ queryKey: ["journal"] });
      queryClient.invalidateQueries({ queryKey: ["streak"] });
    },
  });
}
