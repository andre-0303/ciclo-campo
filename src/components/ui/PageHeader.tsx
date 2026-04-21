import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "./Button";
import { CardEyebrow } from "./Card";
import { cn } from "../../lib/cn";

type PageHeaderProps = {
  eyebrow?: string;
  eyebrowAction?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  onBack?: () => void;
  className?: string;
};

export function PageHeader({
  eyebrow,
  eyebrowAction,
  title,
  description,
  action,
  onBack,
  className,
}: PageHeaderProps) {
  return (
    <header className={cn("flex flex-col gap-6", className)}>
      {(eyebrow || eyebrowAction) && (
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {onBack && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="h-9 w-9 rounded-full p-0"
                aria-label="Voltar"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            {eyebrow && <CardEyebrow>{eyebrow}</CardEyebrow>}
          </div>
          {eyebrowAction && <div className="flex items-center">{eyebrowAction}</div>}
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
        <div className="flex items-start gap-3">
          {!eyebrow && onBack && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="mt-1 h-11 w-11 rounded-full p-0"
              aria-label="Voltar"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}

          <div className="space-y-2">
            <h1 className="font-display text-4xl text-on-background md:text-5xl">
              {title}
            </h1>
            {description && (
              <p className="max-w-2xl text-base text-on-surface-variant md:text-lg">
                {description}
              </p>
            )}
          </div>
        </div>

        {action && (
          <div className="justify-self-start lg:justify-self-end">{action}</div>
        )}
      </div>
    </header>
  );
}
