import type { ReactNode } from "react";
import { Card, CardEyebrow } from "./Card";

type EmptyStateProps = {
  eyebrow?: string;
  title: string;
  description: string;
  action?: ReactNode;
  visual?: ReactNode;
};

export function EmptyState({
  eyebrow = "Espaco para crescer",
  title,
  description,
  action,
  visual,
}: EmptyStateProps) {
  return (
    <Card variant="section" className="grid gap-6 lg:grid-cols-[0.7fr_1fr] lg:items-center">
      <div className="flex min-h-44 items-center justify-center rounded-xl bg-surface-container-lowest shadow-ambient-sm">
        {visual ?? (
          <div className="space-y-3 text-center">
            <p className="display-number text-4xl text-primary">0</p>
            <p className="text-label">Registros ativos</p>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <CardEyebrow>{eyebrow}</CardEyebrow>
        <div className="space-y-2">
          <h2 className="font-display text-3xl text-on-surface">{title}</h2>
          <p className="max-w-xl text-base text-on-surface-variant">{description}</p>
        </div>
        {action}
      </div>
    </Card>
  );
}
