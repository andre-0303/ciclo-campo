import { CalendarDays, MapPinned, Sprout } from "lucide-react";
import type { Enums } from "../types/supabase";
import { Badge, Card, GrowthTracker } from "./ui";

type BatchCardProps = {
  crop: string;
  className: string;
  plot: string;
  phase: Enums<"phase_type">;
  days: number;
  lastEvent: string;
};

export function BatchCard({
  crop,
  className,
  plot,
  phase,
  days,
  lastEvent,
}: BatchCardProps) {
  return (
    <Card variant="interactive" className="flex flex-col gap-6 p-6">
      {/* HEADER SECTION */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-label text-on-surface-variant/70">Ciclo vivo</p>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/8 text-primary shadow-sm ghost-outline">
                <Sprout className="h-6 w-6" />
              </div>
              <h2 className="font-display text-2xl font-bold leading-tight text-on-surface">
                {crop}
              </h2>
            </div>
          </div>
        </div>

        <div className="flex items-center">
          <Badge
            variant="phase"
            className="bg-primary/10 text-primary font-bold px-3 py-1.5"
          >
            {phase}
          </Badge>
        </div>
      </div>

      {/* INFO CHIPS - Stacked for better space management */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center gap-3 rounded-xl bg-surface-container-low p-3 transition-colors hover:bg-surface-container-high/60">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm border border-black/[0.03]">
            <MapPinned className="h-5 w-5 text-primary/70" />
          </div>
          <div className="min-w-0 flex-1 leading-tight">
            <p className="text-[0.65rem] font-bold uppercase tracking-wider text-on-surface-variant/50 mb-0.5">
              Localização
            </p>
            <p className="text-sm font-semibold text-on-surface truncate">
              {className} <span className="mx-1 opacity-20">|</span> {plot}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl bg-surface-container-low p-3 transition-colors hover:bg-surface-container-high/60">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm border border-black/[0.03]">
            <CalendarDays className="h-5 w-5 text-primary/70" />
          </div>
          <div className="min-w-0 flex-1 leading-tight">
            <p className="text-[0.65rem] font-bold uppercase tracking-wider text-on-surface-variant/50 mb-0.5">
              Tempo de cultivo
            </p>
            <p className="text-sm font-semibold text-on-surface">
              {days} dias{" "}
              <span className="text-xs font-normal text-on-surface-variant/70">
                ativos
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* PROGRESS TRACKER */}
      <div className="py-2">
        <GrowthTracker phase={phase} />
      </div>

      {/* FOOTER RECORD */}
      <div className="rounded-2xl bg-surface-container-low p-4">
        <div className="mb-2 flex items-center gap-2">
          <div className="h-1 w-4 rounded-full bg-primary/30" />
          <span className="text-label text-[0.65rem]">Último registro</span>
        </div>
        <p className="text-sm leading-relaxed text-on-surface-variant">
          {lastEvent}
        </p>
      </div>
    </Card>
  );
}
