"use client";

import { use } from "react";
import { useRouter, useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ItemForm } from "@/components/inventory/item-form";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { RoleGate } from "@/components/auth/role-gate";

export default function EditItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = useParams();
  const router = useRouter();

  const {
    data: item,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["item", id],
    queryFn: async () => {
      const res = await fetch(`/api/items/${id}`);
      if (!res.ok) throw new Error("Failed to fetch item");
      return res.json();
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          className="cursor-pointer"
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Edit Item</h1>
      </div>

      {isLoading ? (
        <div className="p-8">Loading...</div>
      ) : (
        <RoleGate allowedRoles={["admin"]}>
          <ItemForm
            initialData={item}
            onSuccess={() => router.push("/inventory")}
          />
        </RoleGate>
      )}
    </div>
  );
}
