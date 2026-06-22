import type { QueryClient } from "@tanstack/react-query";
import { postJson } from "../http";
import { queryKeys } from "../keys";
import type { Me, Role } from "../types";

/**
 * Switch the caller's active role (UX context only — authorization is unchanged).
 * Returns the refreshed Me. Invalidate ["me"] (header/nav) and ["dashboard"] — the
 * aggregate is role-shaped (`kind`), so switching must refetch it to render the other
 * area. The server rejects non-held or non-switchable (staff) roles with 403 and a
 * bad/empty body with 422 — callers should catch the rejection.
 */
export const setActiveRoleMutation = (qc: QueryClient) => ({
  mutationFn: (role: Role) => postJson<Me>("/v1/session/active-role", { role }),
  onSuccess: () => {
    qc.invalidateQueries({ queryKey: queryKeys.me() });
    qc.invalidateQueries({ queryKey: queryKeys.dashboard() });
  },
});
