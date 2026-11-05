import Link from "next/link";

import { ArrowRightIcon, CubeIcon } from "@phosphor-icons/react/dist/ssr";

import type { Project } from "@/lib/api/response";
import { repoLabel, shortId } from "@/lib/format";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.projectId}`}
      className="group flex h-full flex-col gap-4 rounded-xl border bg-card p-5 transition-all hover:border-foreground/15 hover:shadow-sm focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50 focus-visible:outline-none"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border bg-muted/40 text-muted-foreground">
          <CubeIcon aria-hidden="true" className="size-4" weight="duotone" />
        </span>
        <ArrowRightIcon
          aria-hidden="true"
          className="size-4 -translate-x-1 text-muted-foreground/50 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
        />
      </div>

      <div className="min-w-0 space-y-1">
        <h2 className="truncate text-sm font-medium">{project.projectName}</h2>
        <p className="truncate font-mono text-xs text-muted-foreground">
          {repoLabel(project.sourceUrl)}
        </p>
      </div>

      <p className="mt-auto text-[0.6875rem] text-muted-foreground/70">
        Project {shortId(project.projectId)}
      </p>
    </Link>
  );
}
