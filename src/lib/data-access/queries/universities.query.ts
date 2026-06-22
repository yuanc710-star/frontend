// Client-only query options (via ../http → apiFetch). Not for SSR prefetch — apiFetch is client-only.
import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { apiJson } from "../http";
import { queryKeys } from "../keys";
import type { University } from "../types";

export const universitySearchOptions = (query: string, enabled: boolean) =>
  queryOptions({
    queryKey: queryKeys.universitySearch(query),
    queryFn: ({ signal }) =>
      apiJson<University[]>(`/v1/universities?q=${encodeURIComponent(query)}&limit=8`, { signal }),
    enabled,
    placeholderData: keepPreviousData,
  });
