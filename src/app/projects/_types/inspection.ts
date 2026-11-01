import type { InspectProjectResponse } from "@/lib/api/response";

export type InspectionViewData = Omit<
  InspectProjectResponse["data"],
  "project" | "detection"
> & {
  project: Omit<InspectProjectResponse["data"]["project"], "userId">;
  detection: Omit<InspectProjectResponse["data"]["detection"], "variables">;
};

export type InspectProjectState = {
  fieldErrors?: { sourceUrl?: string[] };
  values?: { sourceUrl?: string };
};
