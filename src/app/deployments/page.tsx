import Link from "next/link";
import { Suspense } from "react";

import {
  ArrowRightIcon,
  SquaresFourIcon,
} from "@phosphor-icons/react/dist/ssr";

import { PageShell } from "@/components/page-shell";
import { StatCard } from "@/components/stat-card";
import { Button } from "@/components/ui/button";
import { deploymentApi } from "@/lib/api/deployments.api";
import { projectApi } from "@/lib/api/projects.api";

import {
  DeploymentEmptyState,
  DeploymentList,
} from "./_components/deployment-list";
import { DeploymentsSkeleton } from "./_components/skeletons";

export const metadata = {
  title: "Deployments · DeployForge",
};

export default function DeploymentsPage() {
  return (
    <PageShell>
      <Suspense fallback={<DeploymentsSkeleton />}>
        <DeploymentHistory />
      </Suspense>
    </PageShell>
  );
}

async function DeploymentHistory() {
  const [deployments, projects] = await Promise.all([
    deploymentApi.getAllDeploymentsForUser(),
    projectApi.getAllProjectForUser(),
  ]);

  const projectNames = Object.fromEntries(
    projects.map((project) => [project.projectId, project.projectName]),
  );

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
      <header className="flex flex-col gap-5 border-b pb-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1.5">
          <h1 className="text-2xl font-semibold tracking-tight">Deployments</h1>
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <SquaresFourIcon
              aria-hidden="true"
              className="size-4 shrink-0"
              weight="duotone"
            />
            All deployments across your connected projects.
          </p>
        </div>

        <Button
          asChild
          variant="outline"
          size="lg"
          className="w-fit shrink-0 rounded-lg"
        >
          <Link href="/projects">
            Projects
            <ArrowRightIcon aria-hidden="true" weight="bold" />
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
              title="No deployments yet"
              description="Deploy a project and its build history will show up here."
            />
            <div className="flex justify-center">
              <Button asChild variant="outline" className="rounded-lg">
                <Link href="/projects">Go to projects</Link>
              </Button>
            </div>
          </>
        ) : (
          <DeploymentList
            deployments={sortedDeployments}
            hrefFor={(deployment) => `/deployments/${deployment.deploymentId}`}
            projectNames={projectNames}
          />
        )}
      </section>
    </>
  );
}
