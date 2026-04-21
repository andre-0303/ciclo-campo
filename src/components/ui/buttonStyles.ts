import { cn } from "../../lib/cn";

type ButtonVariant = "primary" | "secondary" | "tertiary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

type ButtonStyleOptions = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "min-h-11 px-4 py-2.5 text-sm",
  md: "min-h-12 px-5 py-3 text-sm md:text-base",
  lg: "min-h-14 px-6 py-4 text-base",
};

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-primary text-on-primary shadow-button-primary hover:translate-y-[-1px] hover:shadow-ambient-lg",
  secondary:
    "bg-secondary-container text-on-secondary-container shadow-ambient-sm hover:translate-y-[-1px]",
  tertiary:
    "bg-transparent px-1 text-primary underline decoration-secondary-fixed decoration-[0.35rem] underline-offset-[0.55rem] hover:text-primary/80",
  ghost:
    "bg-surface-container-low text-on-surface shadow-ambient-sm hover:translate-y-[-1px] hover:bg-surface-container-high",
};

export type { ButtonSize, ButtonStyleOptions, ButtonVariant };

export function buttonStyles({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className,
}: ButtonStyleOptions = {}) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition duration-200 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-55",
    sizeStyles[size],
    variantStyles[variant],
    fullWidth && "w-full",
    className,
  );
}
