import type { ApiResponse, Deployment } from "./response";

export const getDeployment = async (
  id: string,
  signal?: AbortSignal,
): Promise<Deployment> => {
  console.log({ id });
  const response = await fetch(`/api/deployments/${encodeURIComponent(id)}`, {
    method: "GET",
    cache: "no-store",
    signal,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch deployment: ${response.status}`);
  }
  const data = (await response.json()) as ApiResponse<Deployment>;

  return data.data;
};
