import type { DietType, Goal } from "@/types/api";

export const GOALS: {
  value: Goal;
  icon: string;
  title: string;
  description: string;
}[] = [
  {
    value: "lose_weight",
    icon: "🎯",
    title: "Lose weight",
    description: "Lower-calorie swaps",
  },
  {
    value: "healthy_eating",
    icon: "🥗",
    title: "Eat healthier",
    description: "Better choices, more balance",
  },
];

export const DIETS: {
  value: DietType;
  icon: string;
  title: string;
  description: string;
}[] = [
  { value: "veg", icon: "🌱", title: "Vegetarian", description: "No meat or fish" },
  {
    value: "non_veg",
    icon: "🍗",
    title: "Non-vegetarian",
    description: "Anything goes",
  },
  {
    value: "vegan",
    icon: "🌿",
    title: "Vegan",
    description: "No animal products",
  },
];
