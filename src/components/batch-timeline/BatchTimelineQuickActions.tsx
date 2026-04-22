import { Check, FlaskConical, MessageSquarePlus, RefreshCw } from "lucide-react";
import { Droplets } from "lucide-react";
import { Button, CardEyebrow } from "../ui";
import type { BatchEventType, BatchPhase } from "../../types/batch";

interface BatchTimelineQuickActionsProps {
  batchId: string;
  currentPhase: BatchPhase;
  loadingAction: BatchEventType | null;
  onQuickAction: (type: BatchEventType, description: string) => void;
  onOpenPhaseModal: () => void;
  onFinishBatch: (batchId: string) => void;
}

export function BatchTimelineQuickActions({
  batchId,
  currentPhase,
  loadingAction,
  onQuickAction,
  onOpenPhaseModal,
  onFinishBatch,
}: BatchTimelineQuickActionsProps) {
  return (
    <section className="space-y-4">
      <CardEyebrow className="px-1 tracking-[0.2em]">
        Ações Rápidas
      </CardEyebrow>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Button
          variant="secondary"
          isLoading={loadingAction === "irrigation"}
          onClick={() => onQuickAction("irrigation", "Irrigação")}
          className="flex-col h-auto py-6 gap-3 rounded-2xl bg-surface-container-high border-0 hover:bg-cyan-50 hover:text-cyan-700 transition-all duration-300 group"
        >
          <Droplets className="h-8 w-8 group-hover:scale-110 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-[0.15em] leading-none">
            Irrigar
          </span>
        </Button>

        <Button
          variant="secondary"
          isLoading={loadingAction === "observation"}
          onClick={() => onQuickAction("observation", "Observação")}
          className="flex-col h-auto py-6 gap-3 rounded-2xl bg-surface-container-high border-0 hover:bg-slate-100 transition-all duration-300 group"
        >
          <MessageSquarePlus className="h-8 w-8 group-hover:translate-y-[-2px] transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-[0.15em] leading-none">
            Anotar
          </span>
        </Button>

        <Button
          variant="secondary"
          isLoading={loadingAction === "fertilization"}
          onClick={() => onQuickAction("fertilization", "Adubação")}
          className="flex-col h-auto py-6 gap-3 rounded-2xl bg-surface-container-high border-0 hover:bg-orange-50 hover:text-orange-700 transition-all duration-300 group"
        >
          <FlaskConical className="h-8 w-8 group-hover:rotate-12 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-[0.15em] leading-none">
            Adubar
          </span>
        </Button>

        {currentPhase === "colheita" ? (
          <Button
            variant="primary"
            onClick={() => onFinishBatch(batchId)}
            className="flex-col h-auto py-6 gap-3 rounded-2xl bg-green-700 border-0 shadow-2xl shadow-green-900/20"
          >
            <Check className="h-8 w-8" />
            <span className="text-[10px] font-black uppercase tracking-[0.15em] leading-none">
              Finalizar
            </span>
          </Button>
        ) : (
          <Button
            variant="primary"
            onClick={onOpenPhaseModal}
            className="flex-col h-auto py-6 gap-3 rounded-2xl shadow-2xl shadow-primary/30"
          >
            <RefreshCw className="h-8 w-8" />
            <span className="text-[10px] font-black uppercase tracking-[0.15em] leading-none">
              Avançar
            </span>
          </Button>
        )}
      </div>
    </section>
  );
}
