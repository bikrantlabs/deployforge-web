import Link from "next/link";

import { Button } from "@/components/ui/button";

import type { InspectionViewData } from "../../../_types/inspection";

export function ProjectInspectionHeader({
  project,
  detection,
}: {
  project: InspectionViewData["project"];
  detection: InspectionViewData["detection"];
}) {
  return (
    <header className="flex flex-col gap-5 border-b pb-6 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          {detection.detectedProviders.map((provider) => (
            <span
              key={provider}
              className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground"
            >
              {provider}
            </span>
          ))}
        </div>

        <div className="min-w-0">
          <h1 className="truncate text-2xl font-semibold tracking-tight">
            {project.projectName}
          </h1>
          <a
            href={project.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-1 inline-flex max-w-full items-center gap-1.5 text-sm text-muted-foreground underline decoration-border underline-offset-4 hover:text-foreground"
          >
            <span className="truncate">{project.sourceUrl}</span>
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-3.5 shrink-0"
            >
              <path d="M7 17 17 7M8 7h9v9" />
            </svg>
          </a>
        </div>
      </div>

      <Button
        asChild
        size="lg"
        className="w-full shrink-0 rounded-lg sm:w-auto"
      >
        <Link href="/projects/new">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5m7 7-7-7 7-7" />
          </svg>
          Back
        </Link>
      </Button>
    </header>
  );
}
