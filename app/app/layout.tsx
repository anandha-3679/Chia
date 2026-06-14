"use client";

import Image from "next/image";
import { useState } from "react";
import { Flame, Loader2, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Sidebar } from "@/components/app/sidebar";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { useStreak } from "@/hooks/use-streak";

function StreakBadge() {
  const { data } = useStreak();
  const n = data?.current_streak ?? 0;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-3 py-1 text-sm font-medium text-brand">
      <Flame className="size-4" />
      {n} day{n === 1 ? "" : "s"}
    </span>
  );
}

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { ready } = useRequireAuth({ mode: "app" });
  const [open, setOpen] = useState(false);

  if (!ready) {
    return (
      <div className="flex min-h-screen flex-1 items-center justify-center">
        <Loader2 className="size-6 animate-spin text-brand" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-1">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-border md:block">
        <div className="sticky top-0 h-screen overflow-y-auto">
          <Sidebar />
        </div>
      </aside>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur">
          <div className="flex items-center gap-2">
            {/* Mobile menu */}
            <div className="md:hidden">
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger
                  render={
                    <Button variant="ghost" size="icon" aria-label="Open menu" />
                  }
                >
                  <Menu className="size-5" />
                </SheetTrigger>
                <SheetContent side="left" className="w-64 p-0">
                  <SheetHeader className="sr-only">
                    <SheetTitle>Navigation</SheetTitle>
                  </SheetHeader>
                  <Sidebar onNavigate={() => setOpen(false)} />
                </SheetContent>
              </Sheet>
            </div>
            <Image
              src="/chia-logo.png"
              alt="Chía"
              width={28}
              height={28}
              className="rounded-full md:hidden"
            />
          </div>

          <StreakBadge />
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
