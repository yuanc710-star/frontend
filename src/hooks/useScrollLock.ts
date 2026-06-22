"use client";

import { useEffect } from "react";

/**
 * Locks body scroll while `active` is true (for modals / drawers), restoring the
 * previous overflow on cleanup.
 */
export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [active]);
}
