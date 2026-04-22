import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { RefreshCw } from "lucide-react";
import {
  BatchTimelineDeleteAction,
  BatchTimelineEventList,
  BatchTimelineOfflineBanner,
  BatchTimelineOverview,
  BatchTimelinePhaseModal,
  BatchTimelineObservationModal,
  BatchTimelinePrintLabel,
  BatchTimelineQuickActions,
  BatchTimelineStats,
} from "../components/batch-timeline";
import { PageHeader } from "../components/ui";
import { useToast } from "../components/ui/Toast";
import { DEFAULT_PHASES, getPhaseOptionsForBatch } from "../config/crops";
import { useBatch } from "../hooks/useBatch";
import { useBatchEvents } from "../hooks/useBatchEvents";
import { useCreateEvent } from "../hooks/useCreateEvent";
import { useDeleteBatch } from "../hooks/useDeleteBatch";
import { useIsOnline } from "../hooks/useIsOnline";
import { usePendingEvents } from "../hooks/usePendingEvents";
import { useQueueStatus } from "../hooks/useQueueStatus";
import { supabase } from "../lib/supabase";
import type { BatchEventType, BatchPhase, DisplayBatchEvent } from "../types/batch";

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Erro ao realizar ação";
}

export function BatchTimeline() {
  const { id } = useParams();
  const batchId = id ?? "";
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const isOnline = useIsOnline();

  const { data: batch, isLoading: isLoadingBatch } = useBatch(batchId);
  const { data: events, isLoading: isLoadingEvents } = useBatchEvents(batchId);
  const { pendingEvents } = usePendingEvents(batchId);
  const { pending } = useQueueStatus();
  const { mutateAsync: createEvent } = useCreateEvent(batchId);
  const { mutateAsync: deleteBatchAsync, isPending: isDeleting } =
    useDeleteBatch();

  const [loadingAction, setLoadingAction] = useState<BatchEventType | null>(null);
  const [isPhaseModalOpen, setIsPhaseModalOpen] = useState(false);
  const [isObservationModalOpen, setIsObservationModalOpen] = useState(false);
  const [showAllEvents, setShowAllEvents] = useState(false);

  useEffect(() => {
    if (!batchId || isLoadingBatch || !batch || batch.qr_token) {
      return;
    }

    const updateToken = async () => {
      const { error } = await supabase
        .from("batches")
        .update({ qr_token: crypto.randomUUID() })
        .eq("id", batchId);

      if (!error) {
        queryClient.invalidateQueries({ queryKey: ["batch", batchId] });
        queryClient.invalidateQueries({ queryKey: ["batches"] });
      }
    };

    updateToken();
  }, [batch, batchId, isLoadingBatch, queryClient]);

  const handleQuickAction = async (
    type: BatchEventType,
    description: string,
    nextPhase?: BatchPhase,
  ) => {
    if (loadingAction) {
      return;
    }

    setLoadingAction(type);

    try {
      await createEvent({
        batch_id: batchId,
        event_type: type,
        description,
        next_phase: nextPhase,
      });

      if (navigator.onLine) {
        toast(`Registro de ${description.toLowerCase()} realizado!`);
      } else {
        toast("Salvo offline! Será sincronizado automaticamente.", "warning");
      }

      if (nextPhase) {
        setIsPhaseModalOpen(false);
      }
      
      if (type === "observation") {
        setIsObservationModalOpen(false);
      }
    } catch (error) {
      toast(getErrorMessage(error), "error");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleDeleteBatch = async () => {
    const confirmed = window.confirm(
      "Tem certeza que deseja excluir todo este ciclo? Esta ação não tem volta e apagará todos os registros.",
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteBatchAsync(batchId);
      toast("Ciclo excluído com sucesso!");
      navigate("/");
    } catch (error) {
      toast(getErrorMessage(error), "error");
    }
  };

  if (isLoadingBatch || isLoadingEvents) {
    return (
      <div className="app-shell flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="h-8 w-8 text-primary animate-spin" />
          <p className="text-sm font-bold text-on-surface-variant uppercase tracking-widest">
            Sincronizando cultivo...
          </p>
        </div>
      </div>
    );
  }

  const serverEvents = events ?? [];
  const displayEvents: DisplayBatchEvent[] = [
    ...(pendingEvents ?? []).map((event) => ({ ...event, is_pending: true as const })),
    ...serverEvents,
  ].sort(
    (firstEvent, secondEvent) =>
      new Date(secondEvent.created_at ?? 0).getTime() -
      new Date(firstEvent.created_at ?? 0).getTime(),
  );

  const batchPhases =
    batch?.phases && batch.phases.length > 0 ? batch.phases : DEFAULT_PHASES;
  const phaseOptions = getPhaseOptionsForBatch(batchPhases);
  const currentPhase = serverEvents[0]?.phase || "plantio";
  const phaseIndex = batchPhases.findIndex((phase) => phase === currentPhase);
  const progress =
    (Math.max(0, phaseIndex) / Math.max(1, batchPhases.length - 1)) * 100;

  const irrigationCount =
    serverEvents.filter((event) => event.event_type === "irrigation").length;
  const totalEvents = serverEvents.length;
  const daysActive = batch?.created_at
    ? Math.floor(
        (Date.now() - new Date(batch.created_at).getTime()) /
          (1000 * 60 * 60 * 24),
      )
    : 0;
  const phaseStart = [...serverEvents]
    .filter((event) => event.phase === currentPhase)
    .slice(-1)[0]?.created_at;
  const daysInCurrentPhase = phaseStart
    ? Math.floor(
        (Date.now() - new Date(phaseStart).getTime()) / (1000 * 60 * 60 * 24),
      )
    : 0;
  const qrUrl = batch?.qr_token
    ? `${window.location.origin}/ciclo/token/${batch.qr_token}`
    : "";

  return (
    <div className="app-shell bg-surface-container-lowest">
      <BatchTimelinePrintLabel batch={batch} qrUrl={qrUrl} />

      <div className="page-shell max-w-2xl print:hidden">
        <PageHeader title="Diário do Ciclo" onBack={() => navigate("/")} />

        {!isOnline && <BatchTimelineOfflineBanner />}

        <BatchTimelineOverview
          batch={batch}
          currentPhase={currentPhase}
          pendingCount={pending}
          progress={progress}
          onPrint={() => window.print()}
        />

        <BatchTimelineStats
          irrigationCount={irrigationCount}
          daysInCurrentPhase={daysInCurrentPhase}
          frequency={(totalEvents / (daysActive || 1)).toFixed(1)}
        />

        <BatchTimelineQuickActions
          batchId={batchId}
          currentPhase={currentPhase}
          loadingAction={loadingAction}
          onQuickAction={handleQuickAction}
          onOpenPhaseModal={() => setIsPhaseModalOpen(true)}
          onOpenObservationModal={() => setIsObservationModalOpen(true)}
          onFinishBatch={(nextBatchId) => navigate(`/ciclo/${nextBatchId}/finalizar`)}
        />

        <BatchTimelineEventList
          events={displayEvents}
          serverEventsCount={serverEvents.length}
          showAllEvents={showAllEvents}
          onToggleShowAll={() => setShowAllEvents((currentValue) => !currentValue)}
        />

        <BatchTimelineDeleteAction
          isDeleting={isDeleting}
          onDelete={handleDeleteBatch}
        />
      </div>

      <BatchTimelinePhaseModal
        isOpen={isPhaseModalOpen}
        loadingAction={loadingAction}
        currentPhase={currentPhase}
        options={phaseOptions}
        onClose={() => setIsPhaseModalOpen(false)}
        onSelect={(nextPhase, label) =>
          handleQuickAction(
            "fase_change",
            `Mudança para ${label}`,
            nextPhase,
          )
        }
      />

      <BatchTimelineObservationModal
        isOpen={isObservationModalOpen}
        loadingAction={loadingAction}
        onClose={() => setIsObservationModalOpen(false)}
        onSave={(text) => handleQuickAction("observation", text)}
      />
    </div>
  );
}
