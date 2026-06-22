// Client-only query options (via ../http → apiFetch). Not for SSR prefetch — apiFetch is client-only.
import { queryOptions } from "@tanstack/react-query";
import { apiJson } from "../http";
import { queryKeys } from "../keys";
import type { Dashboard } from "../types";

/** BFF aggregate: the role-shaped home (kind = guide | participant). */
export const dashboardOptions = () =>
  queryOptions({
    queryKey: queryKeys.dashboard(),
    queryFn: () => apiJson<Dashboard>("/v1/dashboard"),
  });
