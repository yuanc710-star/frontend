"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useScrollLock, useDismiss } from "@/hooks";

/**
 * Modal — centered overlay dialog. Handles the backdrop (click to dismiss),
 * Escape to close, and body scroll lock. The panel ships with the base card
 * surface; pass `className` for sizing/overflow and `children` for its content.
 * Renders nothing while closed.
 */
export interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  /** id of the title element, wired to aria-labelledby. */
  labelledBy?: string;
  /** Extra panel classes (e.g. max-width, overflow-hidden). */
  className?: string;
  /** Dismiss when the backdrop is clicked (default true). */
  dismissOnBackdrop?: boolean;
}

export function Modal({
  open,
  onClose,
  children,
  labelledBy,
  className,
  dismissOnBackdrop = true,
}: ModalProps) {
  useScrollLock(open);
  useDismiss({ enabled: open, onDismiss: onClose });

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelledBy}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
    >
      <button
        type="button"
        aria-label="Dismiss"
        onClick={dismissOnBackdrop ? onClose : undefined}
        className="absolute inset-0 cursor-default bg-black/40"
      />
      <div
        className={cn(
          "relative z-[61] w-full rounded-panel bg-card shadow-card",
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}
