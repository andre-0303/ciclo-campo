import type { HTMLAttributes } from "react";
import { cn } from "../../lib/cn";

type BadgeVariant = "primary" | "secondary" | "soft" | "phase";

const variantStyles: Record<BadgeVariant, string> = {
  primary: "bg-primary/10 text-primary",
  secondary: "bg-secondary-container text-on-secondary-container",
  soft: "bg-surface-container-high text-on-surface-variant",
  phase: "bg-tertiary-container/18 text-primary",
};

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
};

export function Badge({
  className,
  variant = "soft",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.16em]",
        variantStyles[variant],
        className,
      )}
      {...props}
    />
  );
}
