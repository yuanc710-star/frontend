// Client-only query options (via ../http → apiFetch). Not for SSR prefetch — apiFetch is client-only.
import { queryOptions } from "@tanstack/react-query";
import { apiJson } from "../http";
import { queryKeys } from "../keys";
import type { ParticipantProfile } from "../types";

export const participantProfileOptions = () =>
  queryOptions({
    queryKey: queryKeys.participantProfile(),
    queryFn: () => apiJson<ParticipantProfile>("/v1/participant/profile"),
  });
