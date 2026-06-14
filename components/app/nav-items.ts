import {
  BarChart3,
  Bot,
  Flame,
  NotebookPen,
  User,
  type LucideIcon,
} from "lucide-react";

export const navItems: { label: string; href: string; icon: LucideIcon }[] = [
  { label: "AI Coach", href: "/app/chat", icon: Bot },
  { label: "Journal", href: "/app/journal", icon: NotebookPen },
  { label: "Streaks", href: "/app/streaks", icon: Flame },
  { label: "Insights", href: "/app/insights", icon: BarChart3 },
  { label: "Profile", href: "/app/profile", icon: User },
];
