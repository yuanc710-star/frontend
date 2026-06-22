"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMe } from "@/lib/data-access";
import { TourOfferingsPage } from "@/components/offerings/TourOfferingsPage";

/** Guide-only workspace guard — redirects non-guide active roles to the dashboard. */
function useGuideWorkspaceGuard() {
  const router = useRouter();
  const { me, isLoading, hasRole } = useMe();
  const allowed = Boolean(me && hasRole("GUIDE") && me.activeRole === "GUIDE");

  useEffect(() => {
    if (!isLoading && me && !allowed) router.replace("/dashboard");
  }, [isLoading, me, allowed, router]);

  return { isLoading, allowed };
}

export default function GuideTourOfferingsPage() {
  const { isLoading, allowed } = useGuideWorkspaceGuard();

  if (isLoading || !allowed) return <p className="text-ink-soft">Loading…</p>;

  return <TourOfferingsPage />;
}
