import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import App from './App.tsx'
import './index.css'

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
})

// Debug output
console.log('🚀 Privacy Jenga app is starting...');
console.log('📍 Current location:', window.location.href);
console.log('🔧 Environment mode:', (import.meta as any).env.MODE);
console.log('🏠 Base name will be:', (import.meta as any).env.PROD ? "/Privacy-Jenga" : "/");

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter basename={(import.meta as any).env.PROD ? "/Privacy-Jenga" : "/"}>
        <App />
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1f2937',
              color: '#f9fafb',
              borderRadius: '8px',
            },
            success: {
              iconTheme: {
                primary: '#22c55e',
                secondary: '#f9fafb',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#f9fafb',
              },
            },
          }}
        />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
)
