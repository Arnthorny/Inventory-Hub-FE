"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ItemTable } from "@/components/inventory/item-table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Item, User } from "@/lib/types";
import { useCurrentUser } from "@/hooks/use-current-user";
import { RoleGate } from "@/components/auth/role-gate";
import { Label } from "@/components/ui/label";

let ITEMS_PER_PAGE = 10;

export default function InventoryPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const { user, isLoading: isUserLoading } = useCurrentUser();

  const { data: items = [], isLoading: isItemsLoading } = useQuery({
    queryKey: ["inventory-items"],
    queryFn: async () => {
      const res = await fetch("/api/items");
      if (!res.ok) throw new Error("Failed to fetch items");
      const data = await res.json();
      return (data.items || []) as Item[];
    },
  });

  // --- MUTATION: CREATE ITEM ---
  // Replaces: The manual fetch in onSubmit
  const createItemMutation = useMutation({
    mutationFn: async (newItem: any) => {
      const res = await fetch("/api/items", {
        method: "POST",
        body: JSON.stringify(newItem),
      });
      if (!res.ok) throw new Error("Failed to create item");
      return res.json();
    },
    // THE MAGIC MOMENT:
    onSuccess: () => {
      // Tell React Query: "The list is old now. Go fetch it again."
      // This automatically updates the table without us writing fetch logic again.
      queryClient.invalidateQueries({ queryKey: ["inventory-items"] });
      setShowForm(false);
    },
  });

  const handleEdit = (item: Item) => {
    router.push(`/inventory/${item.id}`);
  };

  // Client-side pagination logic (remains the same)
  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedItems = items.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Combined Loading State
  if (isUserLoading || isItemsLoading || !user) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Inventory
          </h1>

          <p className="text-muted-foreground mt-2">
            Items in your design studio
          </p>
        </div>
        <RoleGate allowedRoles={["admin"]}>
          <Button
            className="cursor-pointer"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "View Inventory" : "Add Item"}
          </Button>
        </RoleGate>
      </div>

      {showForm && (
        <RoleGate allowedRoles={["admin"]}>
          <Card>
            <CardHeader>
              <CardTitle>Create New Item</CardTitle>
              <CardDescription>
                Add a new item to your inventory
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                className="space-y-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const rawData = Object.fromEntries(formData);

                  // Trigger the mutation
                  createItemMutation.mutate(rawData);
                }}
              >
                {/* Inputs remain the same... */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Name</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Item name"
                      required
                      className="w-full px-3 py-2 border border-border rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Category</label>
                    <input
                      type="text"
                      name="category"
                      placeholder="Category"
                      className="w-full px-3 py-2 border border-border rounded-lg"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <input
                    type="text"
                    name="description"
                    placeholder="Description"
                    className="w-full px-3 py-2 border border-border rounded-lg"
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Location</label>
                    <input
                      type="text"
                      name="location"
                      placeholder="Location"
                      className="w-full px-3 py-2 border border-border rounded-lg"
                    />
                  </div>
                  <Label htmlFor="role">Role</Label>
                  <div className="relative"></div>
                  <select
                    id="level"
                    name="level"
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                  >
                    <option value="guest">Guest</option>
                    <option value="intern">Intern</option>
                    <option value="staff">Staff</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="space-y-2">
                    <label className="text-xs text-muted-foreground">
                      Available
                    </label>
                    <input
                      type="number"
                      name="available"
                      defaultValue="0"
                      min="0"
                      className="w-full px-3 py-2 border border-border rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-muted-foreground">
                      In Use
                    </label>
                    <input
                      type="number"
                      name="in_use"
                      defaultValue="0"
                      min="0"
                      className="w-full px-3 py-2 border border-border rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-muted-foreground">
                      Damaged
                    </label>
                    <input
                      type="number"
                      name="damaged"
                      defaultValue="0"
                      min="0"
                      className="w-full px-3 py-2 border border-border rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-muted-foreground">
                      Total
                    </label>
                    <input
                      type="number"
                      name="in_use"
                      defaultValue="0"
                      min="0"
                      className="w-full px-3 py-2 border border-border rounded-lg"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={createItemMutation.isPending} // Disable button while saving
                >
                  {createItemMutation.isPending ? "Creating..." : "Create Item"}
                </Button>

                {/* Show error if mutation fails */}
                {createItemMutation.isError && (
                  <p className="text-red-500 text-sm">
                    Failed to create item. Try again.
                  </p>
                )}
              </form>
            </CardContent>
          </Card>
        </RoleGate>
      )}

      <ItemTable
        items={paginatedItems}
        isAdmin={user.role === "admin"}
        onEdit={user.role === "admin" ? handleEdit : undefined}
      />

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
