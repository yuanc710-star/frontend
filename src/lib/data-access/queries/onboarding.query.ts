// Client-only query options (via ../http → apiFetch). Not for SSR prefetch — apiFetch is client-only.
import { queryOptions } from "@tanstack/react-query";
import { apiJson } from "../http";
import { queryKeys } from "../keys";
import type { OnboardingProgress } from "../types";

/** BFF aggregate: derived onboarding progress for a target role (guide | participant). */
export const onboardingOptions = (role: "guide" | "participant") =>
  queryOptions({
    queryKey: queryKeys.onboarding(role),
    queryFn: () => apiJson<OnboardingProgress>(`/v1/onboarding?role=${role}`),
  });
