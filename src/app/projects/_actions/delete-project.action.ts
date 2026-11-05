"use server";

import { revalidatePath } from "next/cache";

import { ApiError } from "@/lib/api/errors";
import { projectApi } from "@/lib/api/projects.api";
import { auth } from "@/lib/auth";

export type DeleteProjectState = {
  success: boolean;
  message: string;
};

export async function deleteProjectAction(input: {
  projectId: string;
}): Promise<DeleteProjectState> {
  const user = await auth();

  if (!user) {
    return {
      success: false,
      message: "You must be signed in to delete a project.",
    };
  }

  const projectId = input.projectId?.trim();

  if (!projectId) {
    return {
      success: false,
      message: "The project ID is missing.",
    };
  }

  try {
    await projectApi.deleteProject({ projectId });
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        success: false,
        message: error.body.error.message,
      };
    }

    return {
      success: false,
      message: "Could not delete the project. Please try again.",
    };
  }

  revalidatePath("/projects");
  revalidatePath(`/projects/${projectId}`);
  revalidatePath("/deployments");

  return {
    success: true,
    message: "Project deleted.",
  };
}
