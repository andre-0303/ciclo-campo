import { getPendingEvents, updateEvent, deleteEvent } from './queue.service'
import { sendEventToServer } from './sync.service'

export async function processQueue() {
  const events = await getPendingEvents()

  for (const event of events) {
    if (event.retry_count >= 5) {
      event.status = 'error'; // Mantém como erro mas interrompe retries automáticos
      await updateEvent(event);
      continue;
    }

    try {
      await sendEventToServer(event)
      
      // Sucesso! Remove da fila local para não ocupar espaço
      await deleteEvent(event.id)

    } catch (err) {
      console.error(`Falha ao sincronizar evento ${event.id}:`, err);
      event.status = 'error'
      event.retry_count += 1

      await updateEvent(event)
    }
  }
}