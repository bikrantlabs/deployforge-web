import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import {
  ArrowRightIcon,
  ArrowSquareOutIcon,
  GitBranchIcon,
  RocketLaunchIcon,
} from "@phosphor-icons/react/dist/ssr";

import {
  DeploymentEmptyState,
  DeploymentList,
} from "@/app/deployments/_components/deployment-list";
import { DeploymentStatusBadge } from "@/app/deployments/_components/deployment-status";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { PageShell } from "@/components/page-shell";
import { StatCard } from "@/components/stat-card";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api/errors";
import { projectApi } from "@/lib/api/projects.api";
import type { Deployment, Project } from "@/lib/api/response";
import { formatDateTime, repoLabel, shortId } from "@/lib/format";

import { DeleteProjectButton } from "../_components/delete-project-button";
import { ProjectDetailSkeleton } from "../_components/skeletons";

type ProjectPageProps = {
  params: Promise<{ projectId: string }>;
};

export default function ProjectPage({ params }: ProjectPageProps) {
  return (
    <PageShell>
      <Suspense fallback={<ProjectDetailSkeleton />}>
        <ProjectDetail params={params} />
      </Suspense>
    </PageShell>
  );
}

async function ProjectDetail({ params }: ProjectPageProps) {
  const { projectId } = await params;

  let project: Project;
  let deployments: Deployment[];

  try {
    [project, deployments] = await Promise.all([
      projectApi.getProjectForUser({ projectId }),
      projectApi.getDeploymentsForProject({ projectId }),
    ]);
  } catch (error) {
    if (error instanceof ApiError && error.isNotFound) notFound();
    throw error;
  }

  const sortedDeployments = [...deployments].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  const latestDeployment = sortedDeployments[0];
  const liveCount = deployments.filter(
    (deployment) => deployment.status === "live",
  ).length;

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Projects", href: "/projects" },
          { label: project.projectName },
        ]}
      />

      <header className="flex flex-col gap-5 border-b pb-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border bg-card text-muted-foreground">
            <GitBranchIcon
              aria-hidden="true"
              className="size-5"
              weight="duotone"
            />
          </span>
          <div className="min-w-0 space-y-1.5">
            <h1 className="truncate text-2xl font-semibold tracking-tight">
              {project.projectName}
            </h1>
            <a
              href={project.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex max-w-full items-center gap-1.5 text-sm text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-foreground"
            >
              <span className="truncate">{repoLabel(project.sourceUrl)}</span>
              <ArrowSquareOutIcon
                aria-hidden="true"
                className="size-3.5 shrink-0"
              />
            </a>
          </div>
        </div>

        <div className="flex w-fit shrink-0 flex-wrap items-center gap-2">
          <Button asChild variant="outline" size="lg" className="rounded-lg">
            <Link href={`/projects/${project.projectId}/deployments`}>
              All deployments
              <ArrowRightIcon aria-hidden="true" weight="bold" />
            </Link>
          </Button>
          <DeleteProjectButton
            projectId={project.projectId}
            projectName={project.projectName}
          />
        </div>
      </header>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <StatCard label="Latest deployment">
          {latestDeployment ? (
            <DeploymentStatusBadge status={latestDeployment.status} />
          ) : (
            <span className="text-muted-foreground">No deployments</span>
          )}
        </StatCard>
        <StatCard label="Total deployments">{deployments.length}</StatCard>
        <StatCard label="Live deployments">
          {liveCount > 0 ? (
            <span className="inline-flex items-center gap-1.5">
              <RocketLaunchIcon
                aria-hidden="true"
                className="size-4 text-emerald-600 dark:text-emerald-400"
                weight="duotone"
              />
              {liveCount} live
            </span>
          ) : (
            <span className="text-muted-foreground">None live</span>
          )}
        </StatCard>
      </div>

      <section aria-labelledby="deployments-heading" className="mt-8 space-y-3">
        <div className="flex items-end justify-between gap-3">
          <div className="space-y-1">
            <h2
              id="deployments-heading"
              className="text-sm font-semibold tracking-tight"
            >
              Recent deployments
            </h2>
            <p className="text-xs text-muted-foreground">
              {latestDeployment
                ? `Last activity ${formatDateTime(latestDeployment.createdAt)}`
                : "Nothing has been deployed from this project yet."}
            </p>
          </div>
          {sortedDeployments.length > 5 ? (
            <Link
              href={`/projects/${project.projectId}/deployments`}
              className="shrink-0 text-xs font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
            >
              View all
            </Link>
          ) : null}
        </div>

        {sortedDeployments.length === 0 ? (
          <DeploymentEmptyState />
        ) : (
          <DeploymentList
            deployments={sortedDeployments.slice(0, 5)}
            hrefFor={(deployment) =>
              `/projects/${project.projectId}/deployments/${deployment.deploymentId}`
            }
          />
        )}
      </section>

      <p className="mt-8 text-[0.6875rem] text-muted-foreground/70">
        Project ID{" "}
        <span className="font-mono">{shortId(project.projectId)}</span>
      </p>
    </>
  );
}
