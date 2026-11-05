import { notFound } from "next/navigation";
import { Suspense } from "react";

import { PageShell } from "@/components/page-shell";
import { deploymentApi } from "@/lib/api/deployments.api";
import { ApiError } from "@/lib/api/errors";
import { projectApi } from "@/lib/api/projects.api";
import type { Deployment, Project } from "@/lib/api/response";
import { shortId } from "@/lib/format";

import { DeploymentDetailView } from "../_components/deployment-detail-view";
import { DeploymentDetailSkeleton } from "../_components/skeletons";

type DeploymentPageProps = {
  params: Promise<{ deploymentId: string }>;
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
  const { deploymentId } = await params;

  let deployment: Deployment;
  let project: Project;

  try {
    deployment = await deploymentApi.getDeployment({ deploymentId });
    project = await projectApi.getProjectForUser({
      projectId: deployment.projectId,
    });
  } catch (error) {
    if (error instanceof ApiError && error.isNotFound) notFound();
    throw error;
  }

  return (
    <DeploymentDetailView
      deployment={deployment}
      project={project}
      breadcrumbs={[
        { label: "Deployments", href: "/deployments" },
        { label: shortId(deployment.deploymentId) },
      ]}
      backHref="/deployments"
      backLabel="Back to deployments"
    />
  );
}
