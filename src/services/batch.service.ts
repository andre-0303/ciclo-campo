// src/services/batch.service.ts
import { supabase } from "../lib/supabase";
import { getPhasesForCrop } from "../config/crops";

export async function createBatch({
  crop_name,
  class_name,
  plot_id,
}: {
  crop_name: string
  class_name: string
  plot_id: string
}) {
  // pega usuário
  const { data: userData } = await supabase.auth.getUser()

  if (!userData.user) {
    throw new Error('Usuário não autenticado')
  }

  const userId = userData.user.id

  // pega profile (school_id)
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('school_id')
    .eq('id', userId)
    .single()

  if (profileError || !profile) {
    throw new Error('Perfil não encontrado')
  }

  // Determina as fases aplicáveis para este cultivo
  const phases = getPhasesForCrop(crop_name);

  // 1. cria batch
  const { data: batch, error: batchError } = await supabase
    .from('batches')
    .insert({
      school_id: profile.school_id,
      plot_id,
      crop_name,
      class_name,
      status: 'active',
      qr_token: crypto.randomUUID(),
      phases,
    })
    .select()
    .single()

  if (batchError) {
    console.error(batchError)
    throw new Error('Erro ao criar batch')
  }

  // 2. cria evento inicial
  const { error: eventError } = await supabase
    .from('batch_events')
    .insert({
      batch_id: batch.id,
      created_by: userId,
      phase: 'plantio',
      event_type: 'fase_change',
      description: 'Início do cultivo',
    })

  if (eventError) {
    console.error(eventError)
    throw new Error('Erro ao criar evento inicial')
  }

  return batch
}

export async function finishBatch(batchId: string) {
  const { error } = await supabase
    .from("batches")
    .update({
      status: "completed",
      finished_at: new Date().toISOString(),
    })
    .eq("id", batchId);

  if (error) {
    console.error(error);
    throw new Error("Erro ao finalizar o ciclo");
  }
}

export async function deleteBatch(batchId: string) {
  // O Supabase vai deletar os eventos em cascata se o FK tiver ON DELETE CASCADE
  // Senão, é necessário deletar os eventos antes.
  const { error: eventsError } = await supabase
    .from("batch_events")
    .delete()
    .eq("batch_id", batchId);
    
  if (eventsError) {
    console.error(eventsError)
    throw new Error("Erro ao apagar eventos do ciclo");
  }

  const { error } = await supabase
    .from("batches")
    .delete()
    .eq("id", batchId);

  if (error) {
    console.error(error);
    throw new Error("Erro ao excluir o ciclo");
  }
}