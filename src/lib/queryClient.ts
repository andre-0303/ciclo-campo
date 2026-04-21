import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minuto
      retry: (failureCount) => {
        // Não faz retry quando está offline
        if (!navigator.onLine) return false;
        return failureCount < 1;
      },
    },
  },
});
