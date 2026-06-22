import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Icon — thin wrapper over a lucide icon that applies the app's defaults
 * (stroke width, shrink-0, aria-hidden) so ad-hoc icon usage stays consistent.
 *
 *   <Icon icon={LogOut} />            // 16px, strokeWidth 1.8
 *   <Icon icon={ChevronDown} size={14} />
 */
export interface IconProps {
  icon: LucideIcon;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export function Icon({ icon: LucideGlyph, size = 16, strokeWidth = 1.8, className }: IconProps) {
  return (
    <LucideGlyph
      size={size}
      strokeWidth={strokeWidth}
      aria-hidden
      className={cn("shrink-0", className)}
    />
  );
}
