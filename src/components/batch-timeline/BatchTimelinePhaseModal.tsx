import { Check, ChevronRight, RefreshCw } from "lucide-react";
import { Modal } from "../ui";
import { cn } from "../../lib/cn";
import type { BatchEventType, BatchPhase } from "../../types/batch";

interface PhaseOption {
  value: BatchPhase;
  label: string;
  description: string;
}

interface BatchTimelinePhaseModalProps {
  isOpen: boolean;
  loadingAction: BatchEventType | null;
  currentPhase: BatchPhase;
  options: PhaseOption[];
  onClose: () => void;
  onSelect: (nextPhase: BatchPhase, label: string) => void;
}

export function BatchTimelinePhaseModal({
  isOpen,
  loadingAction,
  currentPhase,
  options,
  onClose,
  onSelect,
}: BatchTimelinePhaseModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Novo Estágio de Cultivo"
      className="max-w-sm rounded-3xl p-8 print:hidden"
    >
      <div className="space-y-3">
        <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-6 opacity-60">
          Selecione a próxima fase lógica:
        </p>
        <div className="grid gap-3">
          {options.map((option) => {
            const isActive = currentPhase === option.value;

            return (
              <button
                key={option.value}
                type="button"
                disabled={loadingAction === "fase_change"}
                onClick={() => onSelect(option.value, option.label)}
                className={cn(
                  "group flex w-full items-center gap-4 rounded-2xl border-2 p-5 text-left transition-all duration-300",
                  isActive
                    ? "border-primary bg-primary text-on-primary shadow-2xl shadow-primary/30"
                    : "border-on-surface-variant/5 bg-surface-container-low hover:border-primary/20 hover:bg-primary/5 hover:scale-[1.02]",
                )}
              >
                <div
                  className={cn(
                    "h-10 w-10 shrink-0 rounded-xl flex items-center justify-center transition-colors",
                    isActive
                      ? "bg-white/20"
                      : "bg-white shadow-sm group-hover:bg-primary/10",
                  )}
                >
                  <RefreshCw
                    className={cn(
                      "h-5 w-5",
                      isActive ? "text-white" : "text-primary",
                    )}
                  />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-black uppercase tracking-widest leading-none mb-1">
                    {option.label}
                  </div>
                  <div
                    className={cn(
                      "text-[10px] font-bold leading-tight uppercase opacity-60",
                      isActive && "text-white",
                    )}
                  >
                    {option.description}
                  </div>
                </div>
                {isActive ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <ChevronRight className="h-5 w-5 opacity-20" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </Modal>
  );
}
