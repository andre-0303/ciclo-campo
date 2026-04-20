// src/services/sync.service.ts
import { supabase } from '../lib/supabase'

export async function sendEventToServer(event: any) {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('Usuário não autenticado')
  if (!event.batch_id) throw new Error('batch_id é obrigatório')

  const { error } = await supabase
    .from('batch_events')
    .insert({
      batch_id: event.batch_id,
      created_by: user.id,
      event_type: event.event_type,
      phase: event.phase,
      description: event.description,
      client_id: event.id,
    })

  if (error) throw error
}