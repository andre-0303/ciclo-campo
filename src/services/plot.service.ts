// src/services/plot.service.ts
import { supabase } from "../lib/supabase";

export async function createPlot(label: string) {
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) throw new Error("Não autenticado");

  const userId = userData.user.id

  const { data: profile } = await supabase
    .from('profiles')
    .select('school_id')
    .eq('id', userId)
    .single()

  if (!profile) throw new Error('Perfil não encontrado')

  const { data, error } = await supabase
    .from('plots')
    .insert({
      label,
      school_id: profile.school_id,
    })
    .select()
    .single()

  if (error) throw error

  return data
}