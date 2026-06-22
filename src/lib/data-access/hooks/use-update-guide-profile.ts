"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateGuideProfileMutation } from "../mutations/update-guide-profile.mutation";

/** Upsert the current user's guide profile (and, on submit, the verification application). */
export function useUpdateGuideProfile() {
  const qc = useQueryClient();
  return useMutation(updateGuideProfileMutation(qc));
}
