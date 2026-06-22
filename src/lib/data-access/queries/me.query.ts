// Client-only query options (via ../http → apiFetch). Not for SSR prefetch — apiFetch is client-only.
import { queryOptions } from "@tanstack/react-query";
import { ApiError, apiJson } from "../http";
import { queryKeys } from "../keys";
import type { Me } from "../types";

async function fetchMe(): Promise<Me | null> {
  try {
    // Ambient read: a 401 just means "not signed in" — don't pop the re-auth modal.
    return await apiJson<Me>("/v1/userinfo", { interactive: false });
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) return null;
    throw error;
  }
}

export const meOptions = () => queryOptions({ queryKey: queryKeys.me(), queryFn: fetchMe });
