import Link from "next/link";

import {
  ArrowLeftIcon,
  GitBranchIcon,
  SquaresFourIcon,
} from "@phosphor-icons/react/dist/ssr";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { StatCard } from "@/components/stat-card";
import { Button } from "@/components/ui/button";
import type { Deployment, Project } from "@/lib/api/response";
import { repoLabel } from "@/lib/format";
import {
  ALL_DEPLOYMENTS_SLUG,
  projectDeploymentPath,
} from "@/lib/project-routes";

import { DeploymentEmptyState, DeploymentList } from "./deployment-list";

type DeploymentsViewProps = {
  deployments: Deployment[];
  /** Present when viewing a single project; omitted for all deployments. */
  project?: Project;
  /** Project names keyed by projectId, used by the all-deployments view. */
  projectNames?: Record<string, string>;
};

export function DeploymentsView({
  deployments,
  project,
  projectNames,
}: DeploymentsViewProps) {
  const isAllDeployments = !project;

  const sortedDeployments = [...deployments].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  const liveCount = deployments.filter(
    (deployment) => deployment.status === "live",
  ).length;
  const failedCount = deployments.filter(
    (deployment) => deployment.status === "failed",
  ).length;

  const breadcrumbs = project
    ? [
        { label: "Projects", href: "/projects" },
        {
          label: project.projectName,
          href: `/projects/${project.projectId}`,
        },
        { label: "Deployments" },
      ]
    : [{ label: "Projects", href: "/projects" }, { label: "Deployments" }];

  return (
    <>
      <Breadcrumbs items={breadcrumbs} />

      <header className="flex flex-col gap-5 border-b pb-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-1.5">
          <h1 className="text-2xl font-semibold tracking-tight">Deployments</h1>
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
            {project ? (
              <>
                <GitBranchIcon aria-hidden="true" className="size-4 shrink-0" />
                <span className="min-w-0 truncate">
                  {project.projectName}
                  <span aria-hidden="true" className="mx-1.5">
                    ·
                  </span>
                  <span className="font-mono text-xs">
                    {repoLabel(project.sourceUrl)}
                  </span>
                </span>
              </>
            ) : (
              <>
                <SquaresFourIcon
                  aria-hidden="true"
                  className="size-4 shrink-0"
                  weight="duotone"
                />
                All deployments across your connected projects.
              </>
            )}
          </p>
        </div>

        <Button
          asChild
          variant="outline"
          size="lg"
          className="w-fit shrink-0 rounded-lg"
        >
          <Link href={project ? `/projects/${project.projectId}` : "/projects"}>
            <ArrowLeftIcon aria-hidden="true" weight="bold" />
            {project ? "Back to project" : "Back to projects"}
          </Link>
        </Button>
      </header>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <StatCard label="Total deployments">{deployments.length}</StatCard>
        <StatCard label="Live">{liveCount}</StatCard>
        <StatCard label="Failed">{failedCount}</StatCard>
      </div>

      <section aria-label="Deployment history" className="mt-8 space-y-3">
        {sortedDeployments.length === 0 ? (
          <>
            <DeploymentEmptyState
              description={
                isAllDeployments
                  ? "Deploy a project and its build history will show up here."
                  : undefined
              }
            />
            {isAllDeployments ? (
              <div className="flex justify-center">
                <Button asChild variant="outline" className="rounded-lg">
                  <Link href="/projects">Go to projects</Link>
                </Button>
              </div>
            ) : null}
          </>
        ) : (
          <DeploymentList
            deployments={sortedDeployments}
            hrefFor={(deployment) =>
              projectDeploymentPath(
                project?.projectId ?? ALL_DEPLOYMENTS_SLUG,
                deployment.deploymentId,
              )
            }
            projectNames={projectNames}
          />
        )}
      </section>
    </>
  );
}
