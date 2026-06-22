import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/**
 * Card — surface with the design-system `.card` styling. `padded` adds the
 * standard `.card-pad` inset (set false when the content manages its own
 * padding, e.g. a card with a full-bleed image). Styles live in globals.css.
 */
export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padded?: boolean;
}

export function Card({ padded = true, className, ...props }: CardProps) {
  return <div className={cn("card", padded && "card-pad", className)} {...props} />;
}
