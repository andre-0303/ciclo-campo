import { Sprout } from "lucide-react";

type BatchCardProps = {
  crop: string;
  className: string;
  plot: string;
  phase: "plantio" | "desenvolvimento" | "colheita";
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
  const phaseIndex = {
    plantio: 0,
    desenvolvimento: 1,
    colheita: 2,
  }[phase];

  return (
    <div className="bg-white rounded-2xl shadow p-4 space-y-3">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="font-semibold text-gray-800 flex items-center gap-2">
          <Sprout /> {crop}
        </h2>

        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
          {phase}
        </span>
      </div>

      {/* SUBINFO */}
      <p className="text-sm text-gray-500">
        {className} • {plot}
      </p>

      {/* PROGRESS BAR */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-gray-400">
          <span>Plantio</span>
          <span>Desenv.</span>
          <span>Colheita</span>
        </div>

        <div className="relative h-2 bg-gray-200 rounded-full">
          <div
            className="absolute h-2 bg-green-500 rounded-full transition-all"
            style={{
              width: `${(phaseIndex / 2) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* FOOTER */}
      <p className="text-xs text-gray-400">
        {days} dias • {lastEvent}
      </p>
    </div>
  );
}
