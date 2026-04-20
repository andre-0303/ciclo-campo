import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

export function useBatches() {
  return useQuery({
    queryKey: ['batches'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('batches')
        .select(`
          id,
          crop_name,
          class_name,
          status,
          created_at,
          plots (
            id,
            label
          )
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erro ao buscar batches:', error)
        throw error
      }

      return data ?? []
    },
  })
}