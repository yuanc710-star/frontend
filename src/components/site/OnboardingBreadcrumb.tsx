"use client";

import { Breadcrumb } from "./Breadcrumb";
import { useMe } from "@/lib/data-access";

/**
 * Onboarding breadcrumb whose middle crumb depends on how you reached onboarding:
 *  - a member (holds ≥1 role) got here via the in-app "Become X" side-menu action, so
 *    the trail goes back to the dashboard — NOT the signup funnel (clicking "Sign up"
 *    would otherwise bounce a member to /signup/role, which now redirects them away);
 *  - a first-time signup got here via /signup/role, so the trail goes back there.
 */
export function OnboardingBreadcrumb({ current }: { current: string }) {
  const { isOnboarded } = useMe();
  const middle = isOnboarded
    ? { label: "Dashboard", href: "/dashboard" }
    : { label: "Sign up", href: "/signup/role" };
  return <Breadcrumb items={[{ label: "Home", href: "/" }, middle, { label: current }]} />;
}
