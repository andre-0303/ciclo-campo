export type QueueEvent = {
  id: string // client_id (idempotência)
  batch_id: string
  event_type: string
  phase: string
  description?: string
  created_at: string

  status: 'pending' | 'sent' | 'error'
  retry_count: number
}