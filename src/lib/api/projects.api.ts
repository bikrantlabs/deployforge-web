import "server-only";

import { http } from "./client";
import type {
  CreateProjectResponse,
  GetAllProjectResponse,
  InspectProjectResponse,
} from "./response";

type CreateProjectInput = {
  cloneUrl: string;
  projectName: string;
};

type InspectProjectInput = Omit<CreateProjectInput, "projectName">;
export const projectApi = {
  createProject: (data: CreateProjectInput) => {
    return http.post<CreateProjectResponse>("/deployments/projects", data);
  },
  inspectProject: (data: InspectProjectInput) => {
    return http.post<InspectProjectResponse>(
      "/deployments/inspect-project",
      data,
    );
  },
  getAllProjectForUser: async () => {
    const data = await http.get<GetAllProjectResponse>("/deployments/projects");
    return data.data;
  },
};
