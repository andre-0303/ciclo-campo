// src/hooks/usePendingEvents.ts
import { useEffect, useState } from 'react'
import { getPendingEvents } from '../services/queue.service'
import type { QueueEvent } from '../types/queue'

export function usePendingEvents(batchId: string) {
  const [pendingEvents, setPendingEvents] = useState<QueueEvent[]>([])

  async function load() {
    try {
      const all = await getPendingEvents()
      const filtered = all.filter(e => e.batch_id === batchId)
      setPendingEvents(filtered)
    } catch (err) {
      console.error('Erro ao carregar eventos pendentes:', err)
    }
  }

  useEffect(() => {
    load()
    const interval = setInterval(load, 3000)
    return () => clearInterval(interval)
  }, [batchId])

  return { pendingEvents, refresh: load }
}
