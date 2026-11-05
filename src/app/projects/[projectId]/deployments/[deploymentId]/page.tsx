import { notFound } from "next/navigation";
import { Suspense } from "react";

import { PageShell } from "@/components/page-shell";
import { deploymentApi } from "@/lib/api/deployments.api";
import { ApiError } from "@/lib/api/errors";
import { projectApi } from "@/lib/api/projects.api";
import type { Deployment, Project } from "@/lib/api/response";
import { shortId } from "@/lib/format";
import {
  ALL_DEPLOYMENTS_SLUG,
  projectDeploymentsPath,
} from "@/lib/project-routes";

import { DeploymentDetailView } from "../../../_components/deployments/deployment-detail-view";
import { DeploymentDetailSkeleton } from "../../../_components/deployments/skeletons";

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
  const isAllDeployments = projectId === ALL_DEPLOYMENTS_SLUG;

  let deployment: Deployment;
  let project: Project;

  try {
    if (isAllDeployments) {
      deployment = await deploymentApi.getDeployment({ deploymentId });
      project = await projectApi.getProjectForUser({
        projectId: deployment.projectId,
      });
    } else {
      [deployment, project] = await Promise.all([
        deploymentApi.getDeployment({ deploymentId }),
        projectApi.getProjectForUser({ projectId }),
      ]);
    }
  } catch (error) {
    if (error instanceof ApiError && error.isNotFound) notFound();
    throw error;
  }

  const breadcrumbs = isAllDeployments
    ? [
        { label: "Projects", href: "/projects" },
        {
          label: "Deployments",
          href: projectDeploymentsPath(ALL_DEPLOYMENTS_SLUG),
        },
        { label: shortId(deployment.deploymentId) },
      ]
    : [
        { label: "Projects", href: "/projects" },
        {
          label: project.projectName,
          href: `/projects/${project.projectId}`,
        },
        {
          label: "Deployments",
          href: projectDeploymentsPath(project.projectId),
        },
        { label: shortId(deployment.deploymentId) },
      ];

  return (
    <DeploymentDetailView
      deployment={deployment}
      project={project}
      breadcrumbs={breadcrumbs}
      backHref={
        isAllDeployments
          ? projectDeploymentsPath(ALL_DEPLOYMENTS_SLUG)
          : `/projects/${project.projectId}`
      }
      backLabel={isAllDeployments ? "Back to deployments" : "Back to project"}
    />
  );
}
