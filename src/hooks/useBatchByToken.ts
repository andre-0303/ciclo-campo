import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

export function useBatchByToken(token: string) {
  return useQuery({
    queryKey: ['batch-token', token],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('batches')
        .select('id')
        .eq('qr_token', token)
        .maybeSingle()

      if (error) throw error

      return data
    },
    enabled: !!token,
  })
}
