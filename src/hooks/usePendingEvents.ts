// src/hooks/usePendingEvents.ts
import { useQuery } from '@tanstack/react-query'
import { getPendingEvents } from '../services/queue.service'

export function usePendingEvents(batchId: string) {
  const { data: pendingEvents = [], refetch } = useQuery({
    queryKey: ['pending-events', batchId],
    queryFn: async () => {
      const all = await getPendingEvents()
      return all.filter(e => e.batch_id === batchId)
    },
    enabled: !!batchId,
    refetchInterval: 3000,
  })

  return { 
    pendingEvents, 
    refresh: refetch 
  }
}
