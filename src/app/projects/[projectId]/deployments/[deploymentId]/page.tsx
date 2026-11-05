import { notFound } from "next/navigation";
import { Suspense } from "react";

import { DeploymentDetailView } from "@/app/deployments/_components/deployment-detail-view";
import { DeploymentDetailSkeleton } from "@/app/deployments/_components/skeletons";
import { PageShell } from "@/components/page-shell";
import { deploymentApi } from "@/lib/api/deployments.api";
import { ApiError } from "@/lib/api/errors";
import { projectApi } from "@/lib/api/projects.api";
import type { Deployment, Project } from "@/lib/api/response";
import { shortId } from "@/lib/format";

type DeploymentPageProps = {
  params: Promise<{ projectId: string; deploymentId: string }>;
};

export default function DeploymentPage({ params }: DeploymentPageProps) {
  return (
    <PageShell className="max-w-4xl">
      <Suspense fallback={<DeploymentDetailSkeleton />}>
        <DeploymentDetail params={params} />
      </Suspense>
    </PageShell>
  );
}

async function DeploymentDetail({ params }: DeploymentPageProps) {
  const { projectId, deploymentId } = await params;

  let deployment: Deployment;
  let project: Project;

  try {
    [deployment, project] = await Promise.all([
      deploymentApi.getDeployment({ deploymentId }),
      projectApi.getProjectForUser({ projectId }),
    ]);
  } catch (error) {
    if (error instanceof ApiError && error.isNotFound) notFound();
    throw error;
  }

  return (
    <DeploymentDetailView
      deployment={deployment}
      project={project}
      breadcrumbs={[
        { label: "Projects", href: "/projects" },
        {
          label: project.projectName,
          href: `/projects/${project.projectId}`,
        },
        {
          label: "Deployments",
          href: `/projects/${project.projectId}/deployments`,
        },
        { label: shortId(deployment.deploymentId) },
      ]}
      backHref={`/projects/${project.projectId}`}
      backLabel="Back to project"
    />
  );
}
