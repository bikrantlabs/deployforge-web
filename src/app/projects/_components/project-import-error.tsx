"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";

type ProjectImportErrorProps = {
  title: string;
  message: string;
};

export function ProjectImportError({
  title,
  message,
}: ProjectImportErrorProps) {
  return (
    <section
      role="alert"
      className="space-y-4 rounded-xl border bg-card p-5 text-card-foreground sm:p-6"
    >
      <div className="space-y-1">
        <h2 className="font-semibold">{title}</h2>
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
      <Link href="/projects/new">
        <Button>Back to projects</Button>
      </Link>
    </section>
  );
}
