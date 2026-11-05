import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { ArrowLeftIcon, GitBranchIcon } from "@phosphor-icons/react/dist/ssr";

import {
  DeploymentEmptyState,
  DeploymentList,
} from "@/app/deployments/_components/deployment-list";
import { DeploymentsSkeleton } from "@/app/deployments/_components/skeletons";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { PageShell } from "@/components/page-shell";
import { StatCard } from "@/components/stat-card";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api/errors";
import { projectApi } from "@/lib/api/projects.api";
import type { Deployment, Project } from "@/lib/api/response";
import { repoLabel } from "@/lib/format";

type ProjectDeploymentsPageProps = {
  params: Promise<{ projectId: string }>;
};

export default function ProjectDeploymentsPage({
  params,
}: ProjectDeploymentsPageProps) {
  return (
    <PageShell>
      <Suspense fallback={<DeploymentsSkeleton />}>
        <ProjectDeployments params={params} />
      </Suspense>
    </PageShell>
  );
}

async function ProjectDeployments({ params }: ProjectDeploymentsPageProps) {
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
  const liveCount = deployments.filter(
    (deployment) => deployment.status === "live",
  ).length;
  const failedCount = deployments.filter(
    (deployment) => deployment.status === "failed",
  ).length;

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Projects", href: "/projects" },
          {
            label: project.projectName,
            href: `/projects/${project.projectId}`,
          },
          { label: "Deployments" },
        ]}
      />

      <header className="flex flex-col gap-5 border-b pb-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-1.5">
          <h1 className="text-2xl font-semibold tracking-tight">Deployments</h1>
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
            <GitBranchIcon aria-hidden="true" className="size-4 shrink-0" />
            <span className="truncate">
              {project.projectName}
              <span aria-hidden="true" className="mx-1.5">
                ·
              </span>
              <span className="font-mono text-xs">
                {repoLabel(project.sourceUrl)}
              </span>
            </span>
          </p>
        </div>

        <Button
          asChild
          variant="outline"
          size="lg"
          className="w-fit shrink-0 rounded-lg"
        >
          <Link href={`/projects/${project.projectId}`}>
            <ArrowLeftIcon aria-hidden="true" weight="bold" />
            Back to project
          </Link>
        </Button>
      </header>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <StatCard label="Total deployments">{deployments.length}</StatCard>
        <StatCard label="Live">{liveCount}</StatCard>
        <StatCard label="Failed">{failedCount}</StatCard>
      </div>

      <section aria-label="Deployment history" className="mt-8">
        {sortedDeployments.length === 0 ? (
          <DeploymentEmptyState />
        ) : (
          <DeploymentList
            deployments={sortedDeployments}
            hrefFor={(deployment) =>
              `/projects/${project.projectId}/deployments/${deployment.deploymentId}`
            }
          />
        )}
      </section>
    </>
  );
}
