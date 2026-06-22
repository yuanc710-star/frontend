"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateParticipantProfileMutation } from "../mutations/update-participant-profile.mutation";

/** Upsert the current user's participant profile. */
export function useUpdateParticipantProfile() {
  const qc = useQueryClient();
  return useMutation(updateParticipantProfileMutation(qc));
}
