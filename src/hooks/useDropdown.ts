"use client";

import { useDisclosure } from "./useDisclosure";
import { useHoverIntent } from "./useHoverIntent";
import { useDismiss } from "./useDismiss";

/**
 * useDropdown — hover-intent open/close for menus and popovers, composed from
 * useDisclosure + useHoverIntent + useDismiss(Escape).
 *
 * Returns granular handlers (so a trigger and a separately-positioned panel can
 * each wire what they need) plus ready-made `triggerProps` / `contentProps`.
 */
export function useDropdown({ closeDelay = 150 }: { closeDelay?: number } = {}) {
  const { open, setOpen, onClose: close, onToggle: toggle } = useDisclosure();
  const hover = useHoverIntent({
    onOpen: () => setOpen(true),
    onClose: () => setOpen(false),
    closeDelay,
  });
  useDismiss({ enabled: open, onDismiss: () => setOpen(false) });

  return {
    open,
    setOpen,
    close,
    toggle,
    openNow: hover.openNow,
    scheduleClose: hover.scheduleClose,
    cancelClose: hover.cancelClose,
    triggerProps: hover.triggerProps,
    contentProps: hover.contentProps,
  };
}
