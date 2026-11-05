import "server-only";

import { http } from "./client";
import type {
  ApiResponse,
  Deployment,
  DeployProjectResponse,
  GetAllProjectResponse,
  InspectProjectResponse,
  Project,
} from "./response";

type CreateProjectInput = {
  cloneUrl: string;
  projectName: string;
};

export type DeployProjectInput = {
  project: Omit<Project, "userId">;
  envVariables: Record<string, string>;
};
type InspectProjectInput = Omit<CreateProjectInput, "projectName">;
export const projectApi = {
  // createProject: (data: CreateProjectInput) => {
  //   return http.post<CreateProjectResponse>("/deployments/projects", data);
  // },
  inspectProject: (data: InspectProjectInput) => {
    return http.post<InspectProjectResponse>("/projects/inspect", data);
  },
  getAllProjectForUser: async () => {
    const data = await http.get<GetAllProjectResponse>("/projects");
    return data.data;
  },
  // Fetch a single project for the authenticated user by its ID
  getProjectForUser: async (data: { projectId: string }) => {
    const res = await http.get<ApiResponse<Project>>("/projects/:projectId", {
      path: { projectId: data.projectId },
    });
    return res.data;
  },
  deployProject: (data: DeployProjectInput) => {
    return http.post<DeployProjectResponse>("/projects/deploy", data);
  },
  // Deletes the project, its deployments, and any cloned repository folder.
  deleteProject: async (data: { projectId: string }) => {
    await http.delete<unknown>("/projects/:projectId", {
      path: { projectId: data.projectId },
    });
  },
  getDeploymentsForProject: async (data: { projectId: string }) => {
    const res = await http.get<ApiResponse<Deployment[]>>(
      "/projects/:projectId/deployments",
      {
        path: { projectId: data.projectId },
      },
    );
    return res.data;
  },
};
