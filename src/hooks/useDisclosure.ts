"use client";

import { useCallback, useState } from "react";

/** Open/close boolean state with stable handlers. */
export function useDisclosure(initial = false) {
  const [open, setOpen] = useState(initial);
  const onOpen = useCallback(() => setOpen(true), []);
  const onClose = useCallback(() => setOpen(false), []);
  const onToggle = useCallback(() => setOpen((o) => !o), []);
  return { open, setOpen, onOpen, onClose, onToggle };
}
