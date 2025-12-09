"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Item } from "@/lib/types";
import { toast } from "sonner";
import {
  MoreHorizontal,
  Trash2,
  CirclePlus,
  FilePenLine,
  CircleMinus,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useRequestStore } from "@/hooks/use-request-store";

interface ItemAdminTableProps {
  item: Item;
  isInCart: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => Promise<void>;
}

export function ItemAdminActions({
  item,
  isInCart,
  onEdit,
  onDelete,
}: ItemAdminTableProps) {
  const queryClient = useQueryClient();
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const { addItem, removeItem, items: cartItems } = useRequestStore();

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async (item_id:string) => {
        const url = `/api/items/${item_id}`;
        const res = await fetch(url, {
          method: "DELETE",
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error);
        return json;
    },
    onSuccess: () => {
      toast.success("Item deleted");
      queryClient.invalidateQueries({ queryKey: ["inventory-items"] });
      setShowDeleteAlert(false);
    },
  });

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
            <span className=" sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <DropdownMenuItem
            onClick={() => onEdit && onEdit(item.id)}
            className="cursor-pointer"
          >
            <FilePenLine className="mr-2 h-4 w-4 text-green-500" />
            <span>Edit</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => {
              if (isInCart) removeItem(item.id);
              else addItem(item);
            }}
            className="cursor-pointer"
            disabled={item.available < 1}
          >
            {isInCart ? (
              <>
                <CircleMinus className="mr-2 h-4 w-4 text-red-500" />
                <span>Remove</span>
              </>
            ) : (
              <>
                <CirclePlus className="mr-2 h-4 w-4 text-green-500" />
                <span>Request</span>
              </>
            )}
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => setShowDeleteAlert(true)}
            className="text-red-600 focus:text-red-600 cursor-pointer"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Item
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete Confirmation Modal */}
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will soft-delete the item <strong>{item.name}</strong>. It
              will no longer be requestable.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                deleteMutation.mutate(item.id);
              }}
              className="bg-red-600 hover:bg-red-700 cursor-pointer"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete Item"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
