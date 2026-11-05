"use client";

import {
  DeploymentLogs,
  type DeploymentLogsProps,
} from "@/app/projects/_components/deployments/deployment-logs";

import { useImportProjectContext } from "../import-context";

export function DeploymentLogsSection(
  props: Omit<DeploymentLogsProps, "deploymentId">,
) {
  const { projectCreated, deploymentId } = useImportProjectContext();

  if (!projectCreated || !deploymentId) return;

  return <DeploymentLogs {...props} deploymentId={deploymentId} />;
}
