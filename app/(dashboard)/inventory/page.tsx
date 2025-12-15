"use client";

import { useState, useEffect } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ItemTable } from "@/components/inventory/item-table";
import { ItemForm } from "@/components/inventory/item-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Item } from "@/lib/types";
import { useCurrentUser } from "@/hooks/use-current-user";
import { RoleGate } from "@/components/auth/role-gate";
import { Search, Filter, X } from "lucide-react";
import { clientService } from "@/lib/services/client-service";
import { ListSkeleton } from "@/components/inventory/list-skeleton";

const ITEMS_PER_PAGE = 10;

export default function InventoryPage() {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const { user, isLoading: isUserLoading } = useCurrentUser();

  // 1. Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    undefined
  );
  const [selectedLoc, setSelectedLoc] = useState<string | undefined>(undefined);

  // 1.5 Debounce the search
  // This variable will only update 500ms AFTER you stop typing
  const debouncedSearch = useDebounce(searchQuery, 500);

  // 2. Query with Dependency on Page
  const {
    data: items_res,
    isLoading: isItemsLoading,
    isPlaceholderData,
  } = useQuery({
    queryKey: [
      "inventory-items",
      currentPage,
      debouncedSearch,
      selectedCategory,
      selectedLoc,
    ], // <--- Unique key per page per search per category
    queryFn: () =>
      clientService.getItems(
        currentPage,
        ITEMS_PER_PAGE,
        debouncedSearch,
        selectedCategory,
        selectedLoc
      ),
    // Keep previous data visible while fetching next page (prevents layout jump)
    placeholderData: (previousData) => previousData,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => clientService.getCategories(),
    staleTime: 1000 * 60 * 30,
  });

  const { data: locations = [] } = useQuery({
    queryKey: ["locations"],
    queryFn: () => clientService.getLocations(),
    staleTime: 1000 * 60 * 30,
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, selectedCategory]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedLoc("all");
  };

  const items = items_res?.results || [];
  const totalItems = items_res?.total || 0;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const handleEdit = (id: string) => {
    router.push(`/inventory/${id}/edit`);
  };
  const handleDelete = async (id: string) => {
    return;
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Inventory
          </h1>
          {!isItemsLoading && (
            <p className="text-muted-foreground mt-1">
              {totalItems} items available
            </p>
          )}
        </div>
        <RoleGate allowedRoles={["admin"]}>
          <Button
            className="cursor-pointer"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "Hide Form" : "Add Item"}
          </Button>
        </RoleGate>
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-col sm:flex-row gap-4 items-center bg-card p-4 rounded-lg border border-border">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search items..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Category Filter */}
        <div className="w-full sm:w-48">
          <Select
            value={selectedCategory}
            onValueChange={(val) =>
              setSelectedCategory(val === "all" ? undefined : val)
            }
          >
            <SelectTrigger>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Category" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat: string) => (
                <SelectItem key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Location Filter */}
        <RoleGate allowedRoles={["admin"]}>
          <div className="w-full sm:w-48">
            <Select
              value={selectedLoc}
              onValueChange={(val) =>
                setSelectedLoc(val === "all" ? undefined : val)
              }
            >
              <SelectTrigger>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Location" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {locations.map((loc: string) => (
                  <SelectItem key={loc} value={loc}>
                    {loc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </RoleGate>
        {/* Clear Filters Button */}
        {(searchQuery || selectedCategory || selectedLoc) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-10 px-3 text-muted-foreground"
          >
            <X className="mr-2 h-4 w-4" />
            Reset
          </Button>
        )}
      </div>

      {/* CREATE FORM */}
      {showForm && (
        <RoleGate allowedRoles={["admin"]}>
          <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
            <ItemForm onSuccess={() => setShowForm(false)} />
          </div>
        </RoleGate>
      )}

      {/* TABLE */}
      <div className="relative">
        {isItemsLoading && !items.length ? (
          <ListSkeleton />
        ) : (
          <ItemTable
            items={items}
            isAdmin={user?.role === "admin"}
            onEdit={user?.role === "admin" ? handleEdit : undefined}
          />
        )}
      </div>

      {/* PAGINATION CONTROLS */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1 || isItemsLoading}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={() => {
              if (!isPlaceholderData && currentPage < totalPages) {
                setCurrentPage((p) => p + 1);
              }
            }}
            disabled={currentPage === totalPages || isItemsLoading}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
