import { type HTMLAttributes } from "react";
import { CircleAlert, CircleCheck, Info, TriangleAlert, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Alert — a block-level message / banner (`.alert`). Use for form-submit errors,
 * inline notices, etc. Each variant renders a matching leading icon. `role`
 * defaults to "alert" (assertive); pass role="status" for passive notes. Styles
 * live in globals.css.
 */
export type AlertVariant = "info" | "warning" | "success" | "error";

const ALERT: Record<AlertVariant, string> = {
  info: "alert-info",
  warning: "alert-warning",
  success: "alert-success",
  error: "alert-error",
};

const ICON: Record<AlertVariant, LucideIcon> = {
  info: Info,
  warning: TriangleAlert,
  success: CircleCheck,
  error: CircleAlert,
};

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
}

export function Alert({
  variant = "info",
  role = "alert",
  className,
  children,
  ...props
}: AlertProps) {
  const Icon = ICON[variant];
  return (
    <div role={role} className={cn("alert flex items-start gap-2.5", ALERT[variant], className)} {...props}>
      <Icon size={16} strokeWidth={2} className="mt-px shrink-0" aria-hidden />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
