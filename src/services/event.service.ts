import { supabase } from "../lib/supabase";
import type { Database } from "../types/supabase";
import { addToQueue } from "./queue.service";
import { processQueue } from "./processor.service";

type Phase = Database["public"]["Enums"]["phase_type"];
type EventType = Database["public"]["Enums"]["event_type"];

const EVENT_RULES: Record<EventType, Phase[]> = {
  irrigation: ["plantio", "desenvolvimento", "floracao"],
  fertilization: ["desenvolvimento", "floracao"],
  pest_control: ["desenvolvimento", "floracao", "frutificacao"],
  observation: ["plantio", "desenvolvimento", "floracao", "frutificacao", "colheita"],
  fase_change: ["plantio", "desenvolvimento", "floracao", "frutificacao", "colheita"],
};

const PHASE_FLOW: Record<Phase, Phase | null> = {
  plantio: "desenvolvimento",
  desenvolvimento: "floracao",
  floracao: "frutificacao",
  frutificacao: "colheita",
  colheita: null,
};

export async function getCurrentPhase(batchId: string): Promise<Phase> {
  // ... (mantido igual)
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
  const currentPhase = await getCurrentPhase(batch_id);

  // 1️⃣ Validação de Regras de Evento (O que pode fazer nesta fase?)
  const allowedPhases = EVENT_RULES[event_type];
  if (!allowedPhases.includes(currentPhase)) {
    throw new Error(
      `O evento "${event_type}" não é recomendado na fase "${currentPhase}".`
    );
  }

  // 2️⃣ Validação de Fluxo de Fase (A sequência está correta?)
  if (event_type === "fase_change") {
    if (!next_phase) throw new Error("A próxima fase deve ser informada.");
    
    const expectedPhase = PHASE_FLOW[currentPhase];
    if (next_phase !== expectedPhase) {
      throw new Error(
        `Transição inválida: Não é possível ir de "${currentPhase}" diretamente para "${next_phase}". A próxima fase deve ser "${expectedPhase}".`
      );
    }
  }

  const phase = event_type === "fase_change" && next_phase ? next_phase : currentPhase;
  const eventId = crypto.randomUUID();

  // 3️⃣ Prepara evento para fila offline
  const queueEvent = {
    id: eventId,
    batch_id,
    event_type,
    phase,
    description,
    created_at: new Date().toISOString(),
    status: 'pending' as const,
    retry_count: 0
  };

  // 4️⃣ Salva na fila (IndexedDB)
  await addToQueue(queueEvent);

  // 5️⃣ Tenta processar se estiver online
  if (navigator.onLine) {
    processQueue();
  }
}