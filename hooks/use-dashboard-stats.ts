"use client"

import { useQuery } from "@tanstack/react-query"
import { clientService } from "@/lib/services/client-service"

export function useDashboardStats() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["dashboard-stats"], // <--- The Cache Key
    queryFn: () => clientService.getStats(),
    
    // Cache Rules:
    staleTime: 1000 * 60 * 5, // Data is considered fresh for 5 minutes
    gcTime: 1000 * 60 * 10,   // Keep unused data in garbage collector for 10 mins
    refetchOnWindowFocus: true, // Auto-update when user tabs back
    retry: 1,
  })

  return { 
    stats: data, 
    isLoading, 
    error,
    refetch 
  }
}