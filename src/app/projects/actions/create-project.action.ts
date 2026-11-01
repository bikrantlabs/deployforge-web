"use server";

import { z } from "zod";

import { ApiError } from "@/lib/api/errors";
import { projectApi } from "@/lib/api/projects.api";

import { createProjectSchema } from "../_schemas";

type Field = keyof z.infer<typeof createProjectSchema>;

export type CreateProjectState = {
  success?: boolean;
  message?: string;
  errorCode?: string;
  fieldErrors?: Partial<Record<Field, string[]>>;
  values?: { sourceUrl?: string; projectName?: string };
};

export async function createProjectAction(
  prevState: CreateProjectState,
  formData: FormData,
): Promise<CreateProjectState> {
  const rawInput = {
    sourceUrl: formData.get("sourceUrl")?.toString(),
    projectName: formData.get("projectName")?.toString(),
  };
  const parsed = createProjectSchema.safeParse(rawInput);

  if (!parsed.success) {
    return {
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
      values: rawInput,
    };
  }
  console.log("SA: Trying", parsed.data);
  try {
    const res = await projectApi.createProject({
      cloneUrl: parsed.data.sourceUrl,
      projectName: parsed.data.projectName,
    });

    return {
      success: true,
      message: res.message,
    };
  } catch (error) {
    console.log("SA: Error");
    if (error instanceof ApiError) {
      return {
        success: error.body.success,
        message: error.body.error.message,
        errorCode: error.body.error.code,
        fieldErrors: error.body.error.fields,
        values: rawInput,
      };
    }

    throw error;
  }
}
