"use client";

import { useCallback, useEffect, useRef } from "react";

/**
 * Hover-intent: open on pointer-enter, close on pointer-leave after a short
 * delay (so moving from a trigger to a panel across a gap doesn't dismiss it).
 * Returns granular handlers plus ready-made trigger/content prop bundles.
 */
export function useHoverIntent({
  onOpen,
  onClose,
  closeDelay = 150,
}: {
  onOpen: () => void;
  onClose: () => void;
  closeDelay?: number;
}) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelClose = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  }, []);

  const openNow = useCallback(() => {
    cancelClose();
    onOpen();
  }, [cancelClose, onOpen]);

  const scheduleClose = useCallback(() => {
    cancelClose();
    timer.current = setTimeout(onClose, closeDelay);
  }, [cancelClose, onClose, closeDelay]);

  useEffect(() => cancelClose, [cancelClose]);

  return {
    openNow,
    scheduleClose,
    cancelClose,
    triggerProps: { onMouseEnter: openNow, onMouseLeave: scheduleClose },
    contentProps: { onMouseEnter: cancelClose, onMouseLeave: scheduleClose },
  };
}
