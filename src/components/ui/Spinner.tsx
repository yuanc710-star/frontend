import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/**
 * Spinner — a small decorative loading indicator. Inherits the current text
 * colour (border-current), so it sits naturally inside buttons. It's
 * aria-hidden by default since it's normally paired with visible text (e.g.
 * "Saving…"); for a standalone spinner, add your own role/label.
 */
export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  size?: number;
}

export function Spinner({ size = 16, className, style, ...props }: SpinnerProps) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-block shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent",
        className,
      )}
      style={{ width: size, height: size, ...style }}
      {...props}
    />
  );
}
