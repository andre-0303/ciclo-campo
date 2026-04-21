// src/hooks/useIsOnline.ts
import { useSyncExternalStore } from 'react';

function subscribe(cb: () => void) {
  window.addEventListener('online', cb);
  window.addEventListener('offline', cb);
  return () => {
    window.removeEventListener('online', cb);
    window.removeEventListener('offline', cb);
  };
}

function getSnapshot() {
  return navigator.onLine;
}

/**
 * Hook reativo que retorna true/false conforme o estado da rede.
 * Atualiza instantaneamente quando a conexão cai ou volta.
 */
export function useIsOnline() {
  return useSyncExternalStore(subscribe, getSnapshot);
}
