"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

import { useQuery } from "@tanstack/react-query";

import { TERMINAL_STATUS } from "@/lib/api/response";
import { deploymentQueryOptions } from "@/lib/client/queries/deployment";

import { useImportProjectContext } from "../new/import/import-context";

export function useDeploymentStatus(navigateTo?: string) {
  const router = useRouter();
  const { deploymentId } = useImportProjectContext();

  const navigatedRef = useRef<string | null>(null);

  const {
    data: deployment,
    isPending,
    isFetching,
    error,
  } = useQuery(deploymentQueryOptions(deploymentId));

  useEffect(() => {
    if (!deploymentId || !deployment?.status) return;

    if (!TERMINAL_STATUS.includes(deployment.status)) return;

    // Prevent duplicate navigation.
    if (navigatedRef.current === deploymentId) return;

    navigatedRef.current = deploymentId;

    const destination =
      navigateTo ??
      `/projects/${deployment.projectId}/deployments/${deploymentId}`;

    router.replace(destination);
  }, [deployment, deploymentId, navigateTo, router]);

  return {
    deployment,
    isPending,
    isFetching,
    error,
  };
}
