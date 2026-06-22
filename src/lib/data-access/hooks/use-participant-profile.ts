"use client";

import { useQuery } from "@tanstack/react-query";
import { participantProfileOptions } from "../queries/participant-profile.query";

/** Cached read of the current user's participant profile. */
export function useParticipantProfile() {
  return useQuery(participantProfileOptions());
}
