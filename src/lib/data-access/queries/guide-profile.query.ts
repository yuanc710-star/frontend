// Client-only query options (via ../http → apiFetch). Not for SSR prefetch — apiFetch is client-only.
import { queryOptions } from "@tanstack/react-query";
import { apiJson } from "../http";
import { queryKeys } from "../keys";
import type { GuideProfile } from "../types";

export const guideProfileOptions = () =>
  queryOptions({
    queryKey: queryKeys.guideProfile(),
    queryFn: () => apiJson<GuideProfile>("/v1/guide/profile"),
  });
