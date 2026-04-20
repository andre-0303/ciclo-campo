import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/cn";

type CardVariant = "section" | "interactive" | "hero";

const variantStyles: Record<CardVariant, string> = {
  section: "bg-surface-container-low",
  interactive: "bg-surface-container-lowest shadow-ambient-sm",
  hero: "bg-gradient-primary text-on-primary shadow-ambient-lg",
};

type CardProps = HTMLAttributes<HTMLDivElement> & {
  variant?: CardVariant;
};

export function Card({
  className,
  variant = "section",
  ...props
}: CardProps) {
  return (
    <div
      className={cn("rounded-xl p-5 md:p-6", variantStyles[variant], className)}
      {...props}
    />
  );
}

export function CardEyebrow({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <p className={cn("text-label", className)}>
      {children}
    </p>
  );
}
