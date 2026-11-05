"use server";

import { ApiError } from "@/lib/api/errors";
import { projectApi, type DeployProjectInput } from "@/lib/api/projects.api";
import type { DeployProjectResponse } from "@/lib/api/response";
import { auth } from "@/lib/auth";

import { deployProjectSchema } from "../_schemas";

export type DeployState = {
  success?: boolean;
  message?: string;
  errorCode?: string;
  data: DeployProjectResponse | null;
};

export async function deployAction(
  _prevState: DeployState,
  input: DeployProjectInput,
): Promise<DeployState> {
  console.log("deployAction", input);
  const user = await auth();

  if (!user) {
    return {
      success: false,
      message: "You must be signed in to deploy a project.",
      errorCode: "UNAUTHORIZED",
      data: null,
    };
  }

  const parsed = deployProjectSchema.safeParse({
    ...input.project,
    envVariables: input.envVariables,
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "The project details are invalid.",
      errorCode: "INVALID_INPUT",
      data: null,
    };
  }

  try {
    const res = await projectApi.deployProject({
      project: {
        projectId: parsed.data.projectId,
        projectName: parsed.data.projectName,
        sourceUrl: parsed.data.sourceUrl,
      },
      envVariables: parsed.data.envVariables,
    });

    return {
      success: true,
      message: res.message,
      data: res,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        success: error.body.success,
        message: error.body.error.message,
        errorCode: error.body.error.code,
        data: null,
      };
    }

    throw error;
  }
}
