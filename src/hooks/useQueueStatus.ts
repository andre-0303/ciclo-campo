// src/hooks/useQueueStatus.ts
import { useEffect, useState } from 'react'
import { dbPromise } from '../lib/db'

export function useQueueStatus() {
  const [pending, setPending] = useState(0)

  async function load() {
    try {
      const db = await dbPromise
      const all = await db.getAll('event_queue')

      const count = all.filter(
        e => e.status === 'pending' || e.status === 'error'
      ).length

      setPending(count)
    } catch (err) {
      console.error('Erro ao ler status da fila:', err)
    }
  }

  useEffect(() => {
    // Carrega inicialmente
    load()

    // Ouve mudanças na fila (polling simples por enquanto, 
    // já que IndexedDB não tem disparos nativos de mudança sem BroadcastChannel)
    const interval = setInterval(load, 3000)
    
    return () => clearInterval(interval)
  }, [])

  return { pending, refresh: load }
}
