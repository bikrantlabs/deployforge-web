import { http } from "./client";
import type { ApiResponse, Deployment } from "./response";

export const deploymentApi = {
  getAllDeploymentsForUser: async () => {
    const res = await http.get<ApiResponse<Deployment[]>>("/deployments");
    return res.data;
  },
  getDeployment: async (data: { deploymentId: string }) => {
    const res = await http.get<ApiResponse<Deployment>>(
      "/deployments/:deploymentId",
      {
        path: { deploymentId: data.deploymentId },
      },
    );
    return res.data;
  },
};
