"use client";

import { useQuery } from "@tanstack/react-query";
import { meOptions } from "../queries/me.query";
import type { Role } from "../types";

/**
 * Single source of truth for the current principal. One cached `/userinfo`
 * request shared across the app (header, nav, dashboards).
 */
export function useMe() {
  const { data, isLoading } = useQuery(meOptions());
  const me = data ?? null;
  return {
    me,
    isLoading,
    /** Onboarded = holds ≥1 role. A bare account (mid first-onboarding) is not. */
    isOnboarded: !!me && (me.roles?.length ?? 0) > 0,
    hasRole: (r: Role) => Boolean(me?.roles?.includes(r)),
  };
}
