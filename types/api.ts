// TypeScript types mirroring the backend schemas.

export type Goal = "lose_weight" | "healthy_eating";
export type DietType = "veg" | "non_veg" | "vegan";

export interface User {
  id: string;
  email: string;
  is_active: boolean;
  is_superuser: boolean;
  is_verified: boolean;
  name: string | null;
  goal: Goal | null;
  diet_type: DietType | null;
}

export interface SwapResponse {
  swap: string;
  reason: string;
  alternatives: string[];
}

export interface JournalEntry {
  id: string;
  craving: string;
  swap_taken: string;
  mood: string | null;
  created_at: string;
}

export interface Streak {
  current_streak: number;
  best_streak: number;
}

export interface WeeklyInsights {
  summary: string;
  total_swaps: number;
  top_craving: string | null;
  active_days: number;
  improvement_tip: string;
}
