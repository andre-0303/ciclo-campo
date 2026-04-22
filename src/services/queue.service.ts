// src/services/queue.service.ts
import { dbPromise } from '../lib/db'
import { QueueEvent } from '../types/queue'

export async function addToQueue(event: QueueEvent) {
  const db = await dbPromise
  await db.put('event_queue', event)
}

export async function getPendingEvents() {
  const db = await dbPromise
  const all = await db.getAll('event_queue')

  return all.filter(
    (event) => event.status === 'pending' || event.status === 'error'
  )
}

export async function updateEvent(event: QueueEvent) {
  const db = await dbPromise
  await db.put('event_queue', event)
}

export async function deleteEvent(id: string) {
  const db = await dbPromise
  await db.delete('event_queue', id)
}
