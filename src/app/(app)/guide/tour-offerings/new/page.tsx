"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMe } from "@/lib/data-access";
import { CreateOfferingForm } from "@/components/offerings/CreateOfferingForm";

export default function NewTourOfferingPage() {
  const router = useRouter();
  const { me, isLoading, hasRole } = useMe();
  const allowed = Boolean(me && hasRole("GUIDE") && me.activeRole === "GUIDE");

  useEffect(() => {
    if (!isLoading && me && !allowed) router.replace("/dashboard");
  }, [isLoading, me, allowed, router]);

  if (isLoading || !allowed) return <p className="text-ink-soft">Loading…</p>;

  return <CreateOfferingForm />;
}
