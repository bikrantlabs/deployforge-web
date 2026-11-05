import z from "zod";

export const sourceUrlSchema = z
  .url("Must be a valid GitHub or GitLab URL")
  .trim()
  .refine(
    (value) =>
      /^(https?:\/\/)?(www\.)?(github\.com|gitlab\.com)\/.+/.test(value),
    "Must be a GitHub or GitLab repository URL",
  );

export const projectNameSchema = z
  .string({ error: "Project name is required" })
  .trim()
  .min(1, "Project name is required")
  .max(100, "Project name must not exceed 100 characters")
  .regex(
    /^[\w-]+$/,
    "Project name can only contain letters, numbers, hyphens and underscores",
  );
export const createProjectSchema = z.object({
  sourceUrl: sourceUrlSchema,
  projectName: projectNameSchema,
});

export const deployProjectSchema = z.object({
  projectId: z
    .string({ error: "Project ID is required" })
    .trim()
    .min(1, "Project ID is required"),
  projectName: projectNameSchema,
  sourceUrl: sourceUrlSchema,
  envVariables: z.record(z.string(), z.string()).default({}),
});

export const inspectProjectSchema = z.object({
  sourceUrl: sourceUrlSchema,
});
