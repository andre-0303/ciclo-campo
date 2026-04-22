import { supabase } from "../lib/supabase";
import type { Database } from "../types/supabase";
import type { Phase } from "../config/crops";
import { buildPhaseFlow, DEFAULT_PHASES } from "../config/crops";
import { addToQueue } from "./queue.service";
import { processQueue } from "./processor.service";

type EventType = Database["public"]["Enums"]["event_type"];

/**
 * Busca as fases aplicáveis do batch.
 * Retorna DEFAULT_PHASES se não encontrar (retrocompatibilidade).
 */
async function getBatchPhases(batchId: string): Promise<Phase[]> {
  const { data, error } = await supabase
    .from("batches")
    .select("phases")
    .eq("id", batchId)
    .single();

  if (error || !data?.phases) return DEFAULT_PHASES;
  return data.phases as Phase[];
}

export async function getCurrentPhase(batchId: string): Promise<Phase> {
  const { data, error } = await supabase
    .from("batch_events")
    .select("phase")
    .eq("batch_id", batchId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error || !data) return "plantio";
  return data.phase as Phase;
}

interface CreateEventParams {
  batch_id: string;
  event_type: EventType;
  description: string;
  next_phase?: Phase; // Usado apenas em fase_change
}

export async function createEvent({
  batch_id,
  event_type,
  description,
  next_phase,
}: CreateEventParams) {
  const [currentPhase, batchPhases] = await Promise.all([
    getCurrentPhase(batch_id),
    getBatchPhases(batch_id),
  ]);

  // 1️⃣ Validação de Fluxo de Fase (A sequência está correta?)
  if (event_type === "fase_change") {
    if (!next_phase) throw new Error("A próxima fase deve ser informada.");

    // Verifica se a fase destino é válida para este cultivo
    if (!batchPhases.includes(next_phase)) {
      throw new Error(
        `A fase "${next_phase}" não se aplica a este cultivo.`,
      );
    }

    const phaseFlow = buildPhaseFlow(batchPhases);
    const expectedPhase = phaseFlow[currentPhase];

    if (next_phase !== expectedPhase) {
      throw new Error(
        `Transição inválida: Não é possível ir de "${currentPhase}" diretamente para "${next_phase}". A próxima fase deve ser "${expectedPhase}".`,
      );
    }
  }

  const phase =
    event_type === "fase_change" && next_phase ? next_phase : currentPhase;
  const eventId = crypto.randomUUID();

  // 2️⃣ Prepara evento para fila offline
  const queueEvent = {
    id: eventId,
    batch_id,
    event_type,
    phase,
    description,
    created_at: new Date().toISOString(),
    status: "pending" as const,
    retry_count: 0,
  };

  // 3️⃣ Salva na fila (IndexedDB)
  await addToQueue(queueEvent);

  // 4️⃣ Tenta processar se estiver online
  if (navigator.onLine) {
    processQueue();
  }
}