import "server-only";

import { ApiError } from "@/lib/api/errors";
import { projectApi } from "@/lib/api/projects.api";

import type { InspectionViewData } from "../_types/inspection";

export async function inspectProject(
  sourceUrl: string,
): Promise<
  { data: InspectionViewData; error?: never } | { data?: never; error: string }
> {
  try {
    const response = await projectApi.inspectProject({ cloneUrl: sourceUrl });
    const data: InspectionViewData = {
      existing: response.data.existing,
      project: {
        projectId: response.data.project.projectId,
        projectName: response.data.project.projectName,
        sourceUrl: response.data.project.sourceUrl,
      },
      detection: {
        providers: response.data.detection.providers,
        metadata: response.data.detection.metadata,
        packages: response.data.detection.packages,
        startCommand: response.data.detection.startCommand,
        logs: response.data.detection.logs,
      },
    };

    return { data };
  } catch (error) {
    if (error instanceof ApiError) {
      return { error: error.body.error.message };
    }

    throw error;
  }
}
