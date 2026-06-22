import { type ReactNode } from "react";

/**
 * VisuallyHidden — content available to screen readers but hidden visually
 * (Tailwind's `sr-only`). Use for accessible labels on icon-only controls etc.
 */
export function VisuallyHidden({ children }: { children: ReactNode }) {
  return <span className="sr-only">{children}</span>;
}
