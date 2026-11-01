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

export type ResolvedPackage = {
  name: string;
  requestedVersion: string;
  resolvedVersion: string;
  source?: string;
};

export type DetectionLog = {
  level: string;
  message: string;
  docsPath?: string;
};

export type ProjectDetection = {
  /** Detected providers, e.g. ['node'] or ['python'] */
  providers: string[];
  /** Provider-specific metadata, e.g. { nodePackageManager: 'npm' } */
  metadata: Record<string, string>;
  /** Toolchain packages with resolved versions */
  packages: ResolvedPackage[];
  /** Start command Railpack would use for the container, if detected */
  startCommand: string | null;
  /** Environment variables from the plan's deploy configuration */
  variables: Record<string, string>;
  /** Warnings/suggestions gathered during detection */
  logs: DetectionLog[];
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
