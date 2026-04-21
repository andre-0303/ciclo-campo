import { getPendingEvents, updateEvent, deleteEvent } from './queue.service'
import { sendEventToServer } from './sync.service'
import { queryClient } from '../lib/queryClient'

export async function processQueue() {
  const events = await getPendingEvents()

  for (const event of events) {
    if (event.retry_count >= 5) {
      event.status = 'error';
      await updateEvent(event);
      queryClient.invalidateQueries({ queryKey: ['pending-events'] });
      continue;
    }

    try {
      await sendEventToServer(event)
      await deleteEvent(event.id)
      
      // Notifica a UI que o estado mudou
      queryClient.invalidateQueries({ queryKey: ['batch-events'] });
      queryClient.invalidateQueries({ queryKey: ['pending-events'] });

    } catch (err: any) {
      // Erro 23505 = chave duplicada. O evento JÁ foi sincronizado antes.
      // Tratamos como sucesso: remove da fila local.
      if (err?.code === '23505') {
        console.info(`Evento ${event.id} já existe no servidor. Removendo da fila local.`);
        await deleteEvent(event.id);
        queryClient.invalidateQueries({ queryKey: ['batch-events'] });
        queryClient.invalidateQueries({ queryKey: ['pending-events'] });
        continue;
      }

      console.error(`Falha ao sincronizar evento ${event.id}:`, err);
      event.status = 'error'
      event.retry_count += 1

      await updateEvent(event)
      queryClient.invalidateQueries({ queryKey: ['pending-events'] });
    }
  }
}