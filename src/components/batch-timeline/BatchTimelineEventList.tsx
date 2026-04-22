import { Calendar, RefreshCw } from "lucide-react";
import { Card, CardEyebrow } from "../ui";
import { cn } from "../../lib/cn";
import type { BatchEventRecord, DisplayBatchEvent } from "../../types/batch";
import { eventConfig } from "./constants";

interface BatchTimelineEventListProps {
  events: DisplayBatchEvent[];
  serverEventsCount: number;
  showAllEvents: boolean;
  onToggleShowAll: () => void;
}

function isPendingEvent(event: DisplayBatchEvent) {
  return "is_pending" in event && event.is_pending;
}

function hasSyncError(event: DisplayBatchEvent) {
  return "status" in event && event.status === "error";
}

function getVisibleEvents(events: DisplayBatchEvent[], showAllEvents: boolean) {
  return showAllEvents ? events : events.slice(0, 5);
}

function formatEventTime(event: BatchEventRecord | DisplayBatchEvent) {
  if (!event.created_at) {
    return "--";
  }

  return new Date(event.created_at).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function BatchTimelineEventList({
  events,
  serverEventsCount,
  showAllEvents,
  onToggleShowAll,
}: BatchTimelineEventListProps) {
  const visibleEvents = getVisibleEvents(events, showAllEvents);

  return (
    <section className="space-y-6 pt-4">
      <div className="flex items-center justify-between px-1">
        <CardEyebrow className="tracking-[0.2em] mb-0">Atividades</CardEyebrow>
        <span className="text-[10px] font-black text-on-surface-variant/40 bg-surface-container px-2 py-1 rounded-full uppercase tracking-widest">
          {events.length} Registros
        </span>
      </div>

      {events.length === 0 ? (
        <Card
          variant="section"
          className="flex flex-col items-center py-20 text-center bg-transparent border-dashed border-2 border-on-surface-variant/10 rounded-2xl"
        >
          <div className="h-20 w-20 rounded-full bg-surface-container flex items-center justify-center mb-6">
            <Calendar className="h-10 w-10 text-on-surface-variant/20" />
          </div>
          <h3 className="font-display text-xl font-bold text-on-surface mb-2">
            Ciclo Iniciado
          </h3>
          <p className="text-on-surface-variant font-medium text-sm max-w-[200px]">
            Comece a registrar as atividades da horta para gerar o ledger.
          </p>
        </Card>
      ) : (
        <div className="space-y-4 relative">
          <div className="absolute left-11 top-10 bottom-10 w-0.5 bg-black/[0.03]" />

          {visibleEvents.map((event) => {
            const config = eventConfig[event.event_type];
            const Icon = config.icon;
            const isPending = isPendingEvent(event);
            const syncError = hasSyncError(event);

            return (
              <Card
                key={event.id}
                className={cn(
                  "group relative overflow-hidden transition-all duration-500 hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1 active:scale-[0.98] border-0 p-5 rounded-2xl",
                  isPending ? "bg-amber-50/50 opacity-80" : "bg-white",
                  syncError && "border-l-4 border-red-500 bg-red-50",
                )}
              >
                <div className="flex gap-5">
                  <div
                    className={cn(
                      "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl shadow-inner",
                      isPending ? "bg-amber-200 text-amber-700" : config.color,
                    )}
                  >
                    {isPending ? (
                      <RefreshCw className="h-6 w-6 animate-spin" />
                    ) : (
                      <Icon className="h-6 w-6" />
                    )}
                  </div>

                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          {syncError ? (
                            <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md bg-red-500 text-white flex items-center gap-1">
                              <RefreshCw className="h-2 w-2" /> FALHA NA
                              SINCRONIZAÇÃO
                            </span>
                          ) : (
                            <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md bg-surface-container text-on-surface-variant">
                              {event.phase}
                            </span>
                          )}
                          {isPending && !syncError && (
                            <span className="text-[9px] font-black uppercase tracking-widest text-amber-600 animate-pulse">
                              Sincronizando...
                            </span>
                          )}
                        </div>
                        <h3 className="font-display text-lg font-black text-on-surface tracking-tight leading-none mt-1">
                          {event.event_type === "fase_change"
                            ? `Fase: ${event.phase}`
                            : config.label}
                        </h3>
                      </div>
                      <time className="text-[10px] font-black tabular-nums tracking-wider text-on-surface-variant/40">
                        {formatEventTime(event)}
                      </time>
                    </div>

                    {event.description && (
                      <p className="text-on-surface-variant font-bold leading-snug text-sm opacity-80">
                        {event.description}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}

          {serverEventsCount > 5 && (
            <button
              type="button"
              onClick={onToggleShowAll}
              className="w-full py-4 text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 hover:text-primary transition-colors flex items-center justify-center gap-2 bg-white/40 rounded-2xl border border-dashed border-primary/10"
            >
              {showAllEvents
                ? "Ocultar atividades antigas"
                : `Ver mais ${serverEventsCount - 5} atividades`}
            </button>
          )}
        </div>
      )}
    </section>
  );
}
