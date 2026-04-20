import { openDB } from 'idb'

export const dbPromise = openDB('ciclocampo-db', 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains('event_queue')) {
      db.createObjectStore('event_queue', {
        keyPath: 'id',
      })
    }
  },
})