"use client";

import { useEffect, type RefObject } from "react";

/**
 * Dismiss an open overlay via the Escape key and/or an outside pointer press.
 * Listeners are only attached while `enabled` is true.
 */
export function useDismiss({
  enabled,
  onDismiss,
  escape = true,
  outside = false,
  ref,
}: {
  enabled: boolean;
  onDismiss: () => void;
  /** Close on Escape (default true). */
  escape?: boolean;
  /** Close on pointer-down outside `ref` (default false). */
  outside?: boolean;
  ref?: RefObject<HTMLElement | null>;
}) {
  useEffect(() => {
    if (!enabled) return;

    const onKey = (e: KeyboardEvent) => {
      if (escape && e.key === "Escape") onDismiss();
    };
    const onPointer = (e: PointerEvent) => {
      const el = ref?.current;
      if (el && !el.contains(e.target as Node)) onDismiss();
    };

    window.addEventListener("keydown", onKey);
    if (outside) document.addEventListener("pointerdown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      if (outside) document.removeEventListener("pointerdown", onPointer);
    };
  }, [enabled, onDismiss, escape, outside, ref]);
}
