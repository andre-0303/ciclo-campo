// src/hooks/useBatchEvents.ts
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";

export function useBatchEvents(batchId: string) {
  return useQuery({
    queryKey: ["batch-events", batchId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('batch_events')
        .select(`
          id,
          phase,
          event_type,
          description,
          photo_url,
          created_at,
          created_by
        `)
        .eq('batch_id', batchId)
        .order('created_at', { ascending: false })

      if (error) throw error

      return data ?? []
    },
    enabled: !!batchId,
  })
}