// src/hooks/useCreateEvent.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createEvent } from '../services/event.service'

export function useCreateEvent(batchId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['batch-events', batchId],
      })
      queryClient.invalidateQueries({
        queryKey: ['pending-events', batchId],
      })
    },
  })
}