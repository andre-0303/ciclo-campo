import { forwardRef, type ButtonHTMLAttributes } from "react";
import {
  buttonStyles,
  type ButtonSize,
  type ButtonVariant,
} from "./buttonStyles";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "primary", size = "md", fullWidth, ...props },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        className={buttonStyles({ className, variant, size, fullWidth })}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";
