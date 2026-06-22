"use client";

import { useQuery } from "@tanstack/react-query";
import { onboardingOptions } from "../queries/onboarding.query";

/** Derived onboarding progress for a target role (guide has real multi-step state). */
export function useOnboarding(role: "guide" | "participant") {
  return useQuery(onboardingOptions(role));
}
