import type { ReactNode } from "react";

import { cn } from "cn";

export function PageShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-10 dark:bg-black sm:px-6 sm:py-14">
      <div className={cn("mx-auto w-full max-w-5xl", className)}>
        {children}
      </div>
    </main>
  );
}
