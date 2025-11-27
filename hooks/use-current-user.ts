"use client";

import { useQuery } from "@tanstack/react-query";
import { clientService } from "@/lib/services/client-service";

export function useCurrentUser() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["current-user"],
    queryFn: () => clientService.getUser(),

    retry: false,

    // Cache the user for 5 minutes
    staleTime: 1000 * 60 * 5,
  });

  return { user: data, isLoading, error };
}
