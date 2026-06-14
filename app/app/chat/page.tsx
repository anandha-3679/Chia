"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SwapCard } from "@/components/app/chat/swap-card";
import { useSwap } from "@/hooks/use-swap";
import type { SwapResponse } from "@/types/api";

type Message =
  | { id: string; role: "user"; text: string }
  | { id: string; role: "assistant"; swap: SwapResponse }
  | { id: string; role: "error"; text: string };

const EXAMPLES = ["chips", "ice cream", "chocolate", "biryani"];

let counter = 0;
const nextId = () => `${Date.now()}-${counter++}`;

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const swap = useSwap();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, swap.isPending]);

  function send(craving: string) {
    const text = craving.trim();
    if (!text || swap.isPending) return;
    setMessages((m) => [...m, { id: nextId(), role: "user", text }]);
    setInput("");
    swap.mutate(text, {
      onSuccess: (data) =>
        setMessages((m) => [
          ...m,
          { id: nextId(), role: "assistant", swap: data },
        ]),
      onError: () => {
        setMessages((m) => [
          ...m,
          {
            id: nextId(),
            role: "error",
            text: "Sorry, I couldn't think of a swap just now. Try again?",
          },
        ]);
        toast.error("Couldn't get a swap. Try again.");
      },
    });
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    send(input);
  }

  const empty = messages.length === 0 && !swap.isPending;

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-7rem)] max-w-2xl flex-col">
      <div className="flex-1 space-y-4">
        {empty ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Image
              src="/chia-logo.png"
              alt="Chía"
              width={72}
              height={72}
              className="rounded-full"
            />
            <h1 className="mt-4 font-heading text-2xl font-bold text-primary">
              What are you craving?
            </h1>
            <p className="mt-2 text-muted-foreground">
              Tell me a food and I&apos;ll suggest a healthier swap.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {EXAMPLES.map((ex) => (
                <button
                  key={ex}
                  type="button"
                  onClick={() => send(ex)}
                  className="rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium text-foreground transition-colors hover:border-brand/40 hover:bg-brand/5"
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => {
            if (msg.role === "user") {
              return (
                <div key={msg.id} className="flex justify-end">
                  <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-sm text-primary-foreground">
                    {msg.text}
                  </div>
                </div>
              );
            }
            if (msg.role === "assistant") {
              return <SwapCard key={msg.id} swap={msg.swap} />;
            }
            return (
              <div key={msg.id} className="flex items-start gap-2.5">
                <Image
                  src="/chia-logo.png"
                  alt="Chía"
                  width={32}
                  height={32}
                  className="mt-0.5 size-8 shrink-0 rounded-full"
                />
                <div className="max-w-[85%] rounded-2xl rounded-bl-sm border border-destructive/30 bg-destructive/5 px-4 py-2.5 text-sm text-foreground">
                  {msg.text}
                </div>
              </div>
            );
          })
        )}

        {swap.isPending && (
          <div className="flex items-start gap-2.5">
            <Image
              src="/chia-logo.png"
              alt="Chía"
              width={32}
              height={32}
              className="mt-0.5 size-8 shrink-0 rounded-full"
            />
            <div className="rounded-2xl rounded-bl-sm border border-border bg-card px-4 py-3">
              <span className="flex gap-1">
                <span className="size-2 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:-0.3s]" />
                <span className="size-2 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:-0.15s]" />
                <span className="size-2 animate-bounce rounded-full bg-muted-foreground/50" />
              </span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={onSubmit}
        className="sticky bottom-0 mt-4 flex gap-2 bg-background py-3"
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a craving…"
          disabled={swap.isPending}
          autoFocus
        />
        <Button
          type="submit"
          variant="brand"
          size="icon"
          disabled={swap.isPending || !input.trim()}
          aria-label="Send"
        >
          <Send className="size-4" />
        </Button>
      </form>
    </div>
  );
}
