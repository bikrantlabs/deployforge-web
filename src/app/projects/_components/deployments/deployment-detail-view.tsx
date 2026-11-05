import Link from "next/link";

import {
  ArrowLeftIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react/dist/ssr";
import { cn } from "cn";

import { Breadcrumbs, type Breadcrumb } from "@/components/breadcrumbs";
import { Button } from "@/components/ui/button";
import type { Deployment, DeploymentStatus, Project } from "@/lib/api/response";
import { formatDateTime, formatDuration, shortId } from "@/lib/format";

import { DeploymentStatusBadge, getStatusMeta } from "./deployment-status";

const STATUS_DESCRIPTION: Record<DeploymentStatus, string> = {
  queued: "This deployment is waiting in the build queue.",
  building: "The image is being built. Refresh to see the latest status.",
  built: "The image was built successfully and is ready to go live.",
  live: "This deployment is live and serving traffic.",
  failed: "The build failed. Check the error message below for details.",
  cancelled: "This deployment was cancelled before it finished.",
};

export function DeploymentDetailView({
  deployment,
  project,
  breadcrumbs,
  backHref,
  backLabel,
}: {
  deployment: Deployment;
  project: Project;
  breadcrumbs: Breadcrumb[];
  backHref: string;
  backLabel: string;
}) {
  const meta = getStatusMeta(deployment.status);
  const StatusIcon = meta.icon;

  return (
    <>
      <Breadcrumbs items={breadcrumbs} />

      <header className="flex flex-col gap-5 border-b pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <span
            className={cn(
              "flex size-11 shrink-0 items-center justify-center rounded-xl border",
              meta.iconClassName,
            )}
          >
            <StatusIcon
              aria-hidden="true"
              weight="duotone"
              className={cn("size-5", meta.spin && "animate-spin")}
            />
          </span>
          <div className="min-w-0 space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight">
                {meta.label}
              </h1>
              <DeploymentStatusBadge status={deployment.status} />
            </div>
            <p className="text-sm text-muted-foreground">
              Deployment{" "}
              <span className="font-mono">
                {shortId(deployment.deploymentId)}
              </span>{" "}
              for{" "}
              <Link
                href={`/projects/${project.projectId}`}
                className="underline decoration-border underline-offset-4 transition-colors hover:text-foreground"
              >
                {project.projectName}
              </Link>
            </p>
          </div>
        </div>

        <Button
          asChild
          variant="outline"
          size="lg"
          className="w-fit shrink-0 rounded-lg"
        >
          <Link href={backHref}>
            <ArrowLeftIcon aria-hidden="true" weight="bold" />
            {backLabel}
          </Link>
        </Button>
      </header>

      {deployment.status ? (
        <p className="mt-6 text-sm text-muted-foreground">
          {STATUS_DESCRIPTION[deployment.status]}
        </p>
      ) : null}

      {deployment.errorMessage ? (
        <div
          role="alert"
          className="mt-6 rounded-xl border border-destructive/30 bg-destructive/5 p-4"
        >
          <div className="flex items-start gap-3">
            <WarningCircleIcon
              aria-hidden="true"
              weight="duotone"
              className="mt-0.5 size-5 shrink-0 text-destructive"
            />
            <div className="min-w-0 space-y-1">
              <p className="text-sm font-medium text-destructive">
                Deployment error
              </p>
              <pre className="overflow-x-auto font-mono text-xs whitespace-pre-wrap break-words text-destructive/90">
                {deployment.errorMessage}
              </pre>
            </div>
          </div>
        </div>
      ) : null}

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <section
          aria-labelledby="deployment-details-heading"
          className="overflow-hidden rounded-xl border bg-card"
        >
          <h2
            id="deployment-details-heading"
            className="border-b px-4 py-3 text-sm font-semibold tracking-tight"
          >
            Details
          </h2>
          <dl className="divide-y text-sm">
            <DetailRow label="Deployment ID">
              <span className="font-mono text-xs break-all">
                {deployment.deploymentId}
              </span>
            </DetailRow>
            <DetailRow label="Project">
              <Link
                href={`/projects/${project.projectId}`}
                className="underline decoration-border underline-offset-4 transition-colors hover:text-foreground"
              >
                {project.projectName}
              </Link>
            </DetailRow>
            <DetailRow label="Duration">
              {formatDuration(deployment.startedAt, deployment.finishedAt)}
            </DetailRow>
            <DetailRow label="Image">
              {deployment.imageRef ? (
                <span className="font-mono text-xs break-all">
                  {deployment.imageRef}
                </span>
              ) : (
                <span className="text-muted-foreground">Not built yet</span>
              )}
            </DetailRow>
          </dl>
        </section>

        <section
          aria-labelledby="deployment-timeline-heading"
          className="rounded-xl border bg-card p-4"
        >
          <h2
            id="deployment-timeline-heading"
            className="text-sm font-semibold tracking-tight"
          >
            Timeline
          </h2>
          <ol className="mt-4 space-y-0">
            <TimelineItem
              label="Created"
              value={formatDateTime(deployment.createdAt)}
              active
            />
            <TimelineItem
              label="Build started"
              value={formatDateTime(deployment.startedAt)}
              active={Boolean(deployment.startedAt)}
            />
            <TimelineItem
              label="Finished"
              value={formatDateTime(deployment.finishedAt)}
              active={Boolean(deployment.finishedAt)}
              last
            />
          </ol>
        </section>
      </div>
    </>
  );
}

function DetailRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 px-4 py-3">
      <dt className="shrink-0 text-xs text-muted-foreground">{label}</dt>
      <dd className="min-w-0 text-right text-xs">{children}</dd>
    </div>
  );
}

function TimelineItem({
  label,
  value,
  active,
  last = false,
}: {
  label: string;
  value: string;
  active: boolean;
  last?: boolean;
}) {
  return (
    <li className="relative flex gap-3 pb-4 last:pb-0">
      {last ? null : (
        <span
          aria-hidden="true"
          className="absolute top-3 bottom-0 left-[0.1875rem] w-px bg-border"
        />
      )}
      <span
        aria-hidden="true"
        className={cn(
          "mt-1 size-1.5 shrink-0 rounded-full",
          active ? "bg-foreground" : "bg-border",
        )}
      />
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium">{label}</p>
        <p
          className={cn(
            "text-xs",
            active ? "text-muted-foreground" : "text-muted-foreground/50",
          )}
        >
          {value}
        </p>
      </div>
    </li>
  );
}
