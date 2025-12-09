"use client";

import { Item, PaginatedListBase } from "@/lib/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export function useCurrentItem(id: string) {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["item", id],
    queryFn: async () => {
      const res = await fetch(`/api/items/${id}`);
      if (!res.ok) throw new Error("Failed to fetch item");
      return res.json();
    },
    initialData: () => {
      // 1. Get ALL cached queries that start with 'inventory-items'
      // This covers ['inventory-items', 1, ...], ['inventory-items', 2, ...], etc.
      const allQueries = queryClient.getQueriesData<PaginatedListBase<Item>>({
        queryKey: ["inventory-items"],
      });

      for (const [_, queryData] of allQueries) {
        const foundItem = queryData?.results?.find((i) => i.id === id);
        if (foundItem) return foundItem;
      }
      return undefined;
    },
  });

  return { data, isLoading, error };
}
