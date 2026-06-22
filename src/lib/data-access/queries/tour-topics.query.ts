// Client-only query options (via ../http → apiFetch). Not for SSR prefetch — apiFetch is client-only.
import { queryOptions } from "@tanstack/react-query";
import { apiJson } from "../http";
import { queryKeys } from "../keys";
import type { TourTopic } from "../types";

export const tourTopicsOptions = () =>
  queryOptions({
    queryKey: queryKeys.tourTopics(),
    // Passive meta vocabulary — opt out of the re-auth modal.
    queryFn: () => apiJson<TourTopic[]>("/v1/meta/tour-topics", { interactive: false }),
  });
