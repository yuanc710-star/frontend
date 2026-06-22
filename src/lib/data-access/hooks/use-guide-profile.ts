"use client";

import { useQuery } from "@tanstack/react-query";
import { guideProfileOptions } from "../queries/guide-profile.query";

/** Cached read of the current user's guide profile. */
export function useGuideProfile() {
  return useQuery(guideProfileOptions());
}
