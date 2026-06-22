"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useScrollLock, useDismiss } from "@/hooks";

/**
 * Drawer — side panel that slides in over the page. Handles the backdrop (click
 * to dismiss), Escape, and body scroll lock. Always mounted so it can animate;
 * pass `className` for the panel width and `children` for its content (including
 * any close button).
 */
export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  side?: "left" | "right";
  /** Extra panel classes (e.g. width). */
  className?: string;
  ariaLabel?: string;
}

export function Drawer({
  open,
  onClose,
  children,
  side = "left",
  className,
  ariaLabel,
}: DrawerProps) {
  useScrollLock(open);
  useDismiss({ enabled: open, onDismiss: onClose });

  const sideClass = side === "left" ? "left-0" : "right-0";
  const closedTranslate = side === "left" ? "-translate-x-full" : "translate-x-full";

  return (
    <>
      <div
        aria-hidden
        onClick={onClose}
        className={cn(
          "fixed inset-0 z-[55] bg-black/40 transition-opacity duration-200",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        className={cn(
          "fixed top-0 z-[56] flex h-full w-[300px] max-w-[85vw] flex-col bg-background shadow-card transition-transform duration-200 ease-out",
          sideClass,
          open ? "translate-x-0" : closedTranslate,
          className,
        )}
      >
        {children}
      </div>
    </>
  );
}
