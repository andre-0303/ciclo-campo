import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "./Button";
import { CardEyebrow } from "./Card";
import { cn } from "../../lib/cn";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  onBack?: () => void;
  className?: string;
};

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
  onBack,
  className,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        {onBack && (
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

        <div className="space-y-3">
          {eyebrow && <CardEyebrow>{eyebrow}</CardEyebrow>}
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
      </div>

      {action && (
        <div className="justify-self-start lg:justify-self-end">{action}</div>
      )}
    </header>
  );
}
