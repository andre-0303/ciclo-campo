import type { Enums } from "../../types/supabase";
import { cn } from "../../lib/cn";

const phaseProgress: Record<Enums<"phase_type">, number> = {
  plantio: 28,
  desenvolvimento: 62,
  colheita: 100,
};

type GrowthTrackerProps = {
  phase: Enums<"phase_type">;
  className?: string;
};

export function GrowthTracker({ phase, className }: GrowthTrackerProps) {
  const progress = phaseProgress[phase];

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="flex items-center justify-between px-1 text-[0.6rem] font-black uppercase tracking-[0.2em] text-on-surface-variant/50">
        <span className={cn(phase === "plantio" && "text-primary")}>Plantio</span>
        <span className={cn(phase === "desenvolvimento" && "text-primary")}>Desenv.</span>
        <span className={cn(phase === "colheita" && "text-primary")}>Colheita</span>
      </div>

      <div className="relative h-3 overflow-hidden rounded-full bg-tertiary-container/28">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-tertiary-container to-primary transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
        <div
          className="absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-surface-bright shadow-ambient-sm ghost-outline"
          style={{ left: `calc(${progress}% - 0.75rem)` }}
        >
          <div className="absolute inset-[4px] rounded-full bg-primary" />
        </div>
      </div>
    </div>
  );
}
