"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState } from "react"

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  // useState to ensure the QueryClient is only created once per session
  // and doesn't reset on re-renders.
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        // Data is fresh for 1 minute (no refetching)
        staleTime: 60 * 1000,
        // Retry failed requests 1 time before showing error
        retry: 1, 
      },
    },
  }))

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}