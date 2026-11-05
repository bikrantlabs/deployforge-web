import type { ProjectDetection } from "@/types/project-detection.types";

export type InspectionViewData = {
  existing: boolean;
  project: {
    projectId: string;
    projectName: string;
    sourceUrl: string;
  };
  detection: Omit<ProjectDetection, "variables">;
};

export type InspectProjectState = {
  fieldErrors?: { sourceUrl?: string[] };
  values?: { sourceUrl?: string };
};
