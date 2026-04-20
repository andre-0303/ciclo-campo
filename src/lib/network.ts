// src/lib/network.ts
import { processQueue } from '../services/processor.service'

export function setupNetworkListener() {
  window.addEventListener('online', () => {
    console.log('🟢 Conexão restabelecida. Iniciando sincronização...')
    processQueue()
  })

  window.addEventListener('offline', () => {
    console.log('🔴 O app está operando em modo offline.')
  })
}
