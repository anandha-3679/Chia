import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-dots flex min-h-screen flex-1 flex-col items-center justify-center px-4 py-10">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Back home
      </Link>

      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center gap-2">
          <Image
            src="/chia-logo.png"
            alt="Chía"
            width={56}
            height={56}
            className="rounded-full"
          />
          <span className="font-heading text-2xl font-bold text-brand">
            Chía
          </span>
        </div>
        {children}
      </div>
    </div>
  );
}
