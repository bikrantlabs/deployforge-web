import Link from "next/link";

import { CaretRightIcon, PackageIcon } from "@phosphor-icons/react/dist/ssr";

import type { Deployment } from "@/lib/api/response";
import { formatDateTime, formatDuration, shortId } from "@/lib/format";

import { DeploymentStatusBadge } from "./deployment-status";

export function DeploymentList({
  deployments,
  hrefFor,
  projectNames,
}: {
  deployments: Deployment[];
  hrefFor: (deployment: Deployment) => string;
  /** Optional project names keyed by projectId, used by the global history. */
  projectNames?: Record<string, string>;
}) {
  return (
    <ul className="divide-y overflow-hidden rounded-xl border bg-card">
      {deployments.map((deployment) => (
        <li key={deployment.deploymentId}>
          <Link
            href={hrefFor(deployment)}
            className="group flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-muted/50 focus-visible:bg-muted/50 focus-visible:outline-none"
          >
            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="font-mono text-sm font-medium">
                  {shortId(deployment.deploymentId)}
                </span>
                <DeploymentStatusBadge status={deployment.status} />
              </div>
              <p className="truncate text-xs text-muted-foreground">
                {projectNames?.[deployment.projectId] ? (
                  <>
                    <span className="text-foreground/80">
                      {projectNames[deployment.projectId]}
                    </span>
                    <span aria-hidden="true" className="mx-1.5">
                      ·
                    </span>
                  </>
                ) : null}
                {formatDateTime(deployment.createdAt)}
                <span aria-hidden="true" className="mx-1.5">
                  ·
                </span>
                {formatDuration(deployment.startedAt, deployment.finishedAt)}
              </p>
            </div>
            <CaretRightIcon
              aria-hidden="true"
              className="size-4 shrink-0 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function DeploymentEmptyState({
  title = "No deployments yet",
  description = "Deployments for this project will appear here once one is triggered.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed px-6 py-12 text-center">
      <span className="flex size-10 items-center justify-center rounded-full border bg-card text-muted-foreground">
        <PackageIcon aria-hidden="true" className="size-5" weight="duotone" />
      </span>
      <div className="space-y-1">
        <p className="text-sm font-medium">{title}</p>
        <p className="mx-auto max-w-sm text-xs text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}
