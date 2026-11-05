import type { ProjectDetection } from "@/types/project-detection.types";

export type ApiResponse<T> = {
  status: "success";
  message: string;
  timestamp: string; // ISO 8601
  data: T;
};

export type TokenPair = {
  accessToken: string;
  refreshToken: string;
};

export type User = {
  id: string;
  email: string;
  isActive: boolean;
  isEmailVerified: boolean;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
};

export type Token = {
  accessToken: string;
  refreshToken: string;
};
export type RegisterUserResponse = ApiResponse<{ user: User }>;
export type VerifyEmailResponse = ApiResponse<{ user: User; tokens: Token }>;
export type LoginUserResponse = VerifyEmailResponse;
export type GetMeResponse = ApiResponse<{ user: User }>;
export type RefreshTokenResponse = ApiResponse<TokenPair>;

// Projects
export type Project = {
  projectId: string;
  projectName: string;
  sourceUrl: string;
  userId: string;
};

export type CreateProjectResponse = ApiResponse<
  Omit<Project, "sourceUrl"> & { jobId: string }
>;

export type InspectProjectResponse = ApiResponse<{
  project: Project;
  detection: ProjectDetection;
  existing: boolean;
}>;
export type GetAllProjectResponse = ApiResponse<Project[]>;

export type Deployment = {
  deploymentId: string;
  projectId: string;
  status: DeploymentStatus | null;
  imageRef: string | null;
  errorMessage: string | null;
  createdAt: string; // ISO from JSON
  startedAt: string | null;
  finishedAt: string | null;
};
export type DeploymentStatus =
  "queued" | "building" | "built" | "failed" | "live" | "cancelled";

export type DeployProjectResponse = ApiResponse<{
  project: Project;
  deployment: {
    deploymentId: string;
    projectId: string;
  };
}>;
