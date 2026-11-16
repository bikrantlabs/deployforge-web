import { queryOptions } from "@tanstack/react-query";

import { getDeployment } from "@/lib/api/get-deployment";
import { TERMINAL_STATUS } from "@/lib/api/response";

export const deploymentKeys = {
  all: ["deployments"] as const,

  detail: (id: string | null) => [...deploymentKeys.all, "detail", id] as const,
};

export function deploymentQueryOptions(id: string | null) {
  return queryOptions({
    queryKey: deploymentKeys.detail(id),

    queryFn: ({ signal }) => {
      if (!id) throw new Error("Deployment ID is required");
      return getDeployment(id, signal);
    },

    enabled: !!id,

    refetchInterval: (query) => {
      const deployment = query.state.data;

      if (deployment?.status && TERMINAL_STATUS.includes(deployment.status)) {
        return false;
      }

      return 3000;
    },

    refetchIntervalInBackground: false,
    retry: 2,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10000),
  });
}
