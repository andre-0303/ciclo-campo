import { openDB } from 'idb'
import type { QueueEvent } from '../types/queue'

export const dbPromise = openDB<QueueEvent>('ciclocampo-db', 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains('event_queue')) {
      db.createObjectStore('event_queue', {
        keyPath: 'id',
      })
    }
  },
})
