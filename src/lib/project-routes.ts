/**
 * Sentinel project ID used for the deployments route when the user wants to
 * see deployments across every project. It keeps `/deployments` under the
 * projects route so both views share the same page and components.
 */
export const ALL_DEPLOYMENTS_SLUG = "~";

export function projectDeploymentsPath(projectId: string) {
  return `/projects/${encodeURIComponent(projectId)}/deployments`;
}

export function projectDeploymentPath(projectId: string, deploymentId: string) {
  return `${projectDeploymentsPath(projectId)}/${encodeURIComponent(deploymentId)}`;
}

export const allDeploymentsPath = projectDeploymentsPath(ALL_DEPLOYMENTS_SLUG);
