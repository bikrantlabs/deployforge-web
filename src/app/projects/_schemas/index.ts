import z from "zod";

export const createProjectSchema = z.object({
  sourceUrl: z
    .url("Must be a valid GitHub or GitLab URL")
    .trim()
    .refine(
      (value) =>
        /^(https?:\/\/)?(www\.)?(github\.com|gitlab\.com)\/.+/.test(value),
      "Must be a GitHub or GitLab repository URL",
    ),
  projectName: z
    .string({ error: "Project name is required" })
    .trim()
    .min(1, "Project name is required")
    .max(100, "Project name must not exceed 100 characters")
    .regex(
      /^[\w-]+$/,
      "Project name can only contain letters, numbers, hyphens and underscores",
    ),
});

export const inspectProjectSchema = z.object({
  sourceUrl: z
    .url("Must be a valid GitHub or GitLab URL")
    .trim()
    .refine(
      (value) =>
        /^(https?:\/\/)?(www\.)?(github\.com|gitlab\.com)\/.+/.test(value),
      "Must be a GitHub or GitLab repository URL",
    ),
});
