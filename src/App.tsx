import { useEffect } from 'react'
import { AppRoutes } from './routes'
import { AuthProvider } from './context/AuthContext'
import { QueryClientProvider } from '@tanstack/react-query'
import { setupNetworkListener } from './lib/network'
import { processQueue } from './services/processor.service'

import { ToastProvider } from "./components/ui/Toast";

import { queryClient } from './lib/queryClient';
import { ErrorBoundary } from './components/ErrorBoundary';

function App() {
  useEffect(() => {
    setupNetworkListener()
    processQueue()
  }, [])

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ToastProvider>
            <AppRoutes />
          </ToastProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App
