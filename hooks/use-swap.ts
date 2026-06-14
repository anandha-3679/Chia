"use client";

import { useMutation } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import type { SwapResponse } from "@/types/api";

export function useSwap() {
  return useMutation({
    mutationFn: (craving: string) =>
      apiFetch<SwapResponse>("/swap", {
        method: "POST",
        json: { craving },
      }),
  });
}
