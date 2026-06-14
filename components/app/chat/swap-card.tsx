import Image from "next/image";
import type { SwapResponse } from "@/types/api";

export function SwapCard({ swap }: { swap: SwapResponse }) {
  return (
    <div className="flex items-start gap-2.5">
      <Image
        src="/chia-logo.png"
        alt="Chía"
        width={32}
        height={32}
        className="mt-0.5 size-8 shrink-0 rounded-full"
      />
      <div className="max-w-[85%] rounded-2xl rounded-bl-sm border border-brand/25 bg-gradient-to-br from-brand/[0.07] to-card p-4 shadow-sm">
        <p className="text-xs font-medium uppercase tracking-wide text-brand">
          Try this instead
        </p>
        <p className="mt-1 font-heading text-lg font-semibold text-primary">
          {swap.swap}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">{swap.reason}</p>

        {swap.alternatives.length > 0 && (
          <div className="mt-3">
            <p className="text-xs text-muted-foreground">Or try:</p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {swap.alternatives.map((alt) => (
                <span
                  key={alt}
                  className="rounded-full bg-secondary px-2.5 py-0.5 text-xs text-secondary-foreground"
                >
                  {alt}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
