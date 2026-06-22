"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { setActiveRoleMutation } from "../mutations/set-active-role.mutation";

/** Switch the active UX role (PARTICIPANT ↔ GUIDE); invalidates the cached me + dashboard. */
export function useSetActiveRole() {
  const qc = useQueryClient();
  return useMutation(setActiveRoleMutation(qc));
}
