import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { PageShell } from "@/components/page-shell";
import { deploymentApi } from "@/lib/api/deployments.api";
import { ApiError } from "@/lib/api/errors";
import { projectApi } from "@/lib/api/projects.api";
import type { Deployment, Project } from "@/lib/api/response";
import { ALL_DEPLOYMENTS_SLUG } from "@/lib/project-routes";

import { DeploymentsView } from "../../_components/deployments/deployments-view";
import { DeploymentsSkeleton } from "../../_components/deployments/skeletons";

type ProjectDeploymentsPageProps = {
  params: Promise<{ projectId: string }>;
};

export const metadata: Metadata = {
  title: "Deployments · DeployForge",
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

  // "~" means the user wants every deployment, not one project's history.
  if (projectId === ALL_DEPLOYMENTS_SLUG) {
    const [deployments, projects] = await Promise.all([
      deploymentApi.getAllDeploymentsForUser(),
      projectApi.getAllProjectForUser(),
    ]);

    const projectNames = Object.fromEntries(
      projects.map((project) => [project.projectId, project.projectName]),
    );

    return (
      <DeploymentsView deployments={deployments} projectNames={projectNames} />
    );
  }

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

  return <DeploymentsView deployments={deployments} project={project} />;
}
