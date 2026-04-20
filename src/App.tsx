import { useEffect } from 'react'
import { AppRoutes } from './routes'
import { AuthProvider } from './context/AuthContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { setupNetworkListener } from './lib/network'
import { processQueue } from './services/processor.service'

import { ToastProvider } from "./components/ui/Toast";

const queryClient = new QueryClient();

function App() {
  useEffect(() => {
    setupNetworkListener()
    processQueue()
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App
