import { Droplets } from "lucide-react";

interface BatchTimelineStatsProps {
  irrigationCount: number;
  daysInCurrentPhase: number;
  frequency: string;
}

export function BatchTimelineStats({
  irrigationCount,
  daysInCurrentPhase,
  frequency,
}: BatchTimelineStatsProps) {
  return (
    <section className="grid grid-cols-3 gap-3">
      <div className="bg-surface-container-low rounded-2xl p-4 border border-black/5">
        <div className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant/60 mb-1 leading-none">
          Irrigações
        </div>
        <div className="flex items-baseline gap-1 mt-1">
          <span className="text-2xl font-black text-on-surface">
            {irrigationCount}
          </span>
          <Droplets className="h-3 w-3 text-cyan-500" />
        </div>
      </div>
      <div className="bg-surface-container-low rounded-2xl p-4 border border-black/5">
        <div className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant/60 mb-1 leading-none">
          Dias na Fase
        </div>
        <div className="flex items-baseline gap-1 mt-1">
          <span className="text-2xl font-black text-on-surface">
            {daysInCurrentPhase}
          </span>
          <span className="text-[10px] font-bold text-on-surface-variant">
            DIAS
          </span>
        </div>
      </div>
      <div className="bg-surface-container-low rounded-2xl p-4 border border-black/5">
        <div className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant/60 mb-1 leading-none">
          Frequência
        </div>
        <div className="flex items-baseline gap-1 mt-1">
          <span className="text-2xl font-black text-on-surface">
            {frequency}
          </span>
          <span className="text-[10px] font-bold text-on-surface-variant">
            /DIA
          </span>
        </div>
      </div>
    </section>
  );
}
