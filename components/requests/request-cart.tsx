"use client";
import type { CreateRequestBody } from "@/lib/types";
import { useRequestStore } from "@/hooks/use-request-store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { CalendarIcon, Minus, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useCurrentUser } from "@/hooks/use-current-user";
import { clientService } from "@/lib/services/client-service";
import { RoleGate } from "../auth/role-gate";
import { UserSearch } from "../users/user-search";

export function RequestCart() {
  const { items, removeItem, updateQuantity, isOpen, toggleCart, clearCart } =
    useRequestStore();
  const { user, isLoading: isUserLoading } = useCurrentUser();

  const [reason, setReason] = useState("");
  const [proxyUserId, setProxyUserId] = useState<undefined | string>(undefined);

  const queryClient = useQueryClient();
  const today = new Date();
  const tomorrow = new Date(today.setDate(today.getDate() + 1))
    .toISOString()
    .split("T")[0];
  const [dueDate, setDueDate] = useState(tomorrow);

  const submitMutation = useMutation({
    mutationFn: async () =>
      await clientService.submitRequest(
        user,
        proxyUserId,
        dueDate,
        items,
        reason
      ),
    onSuccess: () => {
      toast.success("Request Submitted");
      clearCart();
      queryClient.invalidateQueries({ queryKey: ["inventory-items"] });
      setReason("");
      setDueDate("");
      toggleCart();
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  return (
    <Sheet open={isOpen} onOpenChange={toggleCart}>
      {/* Increased width and padding */}
      <SheetContent className="w-full sm:w-[540px] flex flex-col h-full p-0 gap-0">
        {/* Header with padding */}
        <SheetHeader className="p-6 border-b border-border bg-muted/10">
          <SheetTitle>Current Request</SheetTitle>
          <SheetDescription>
            Review the items you want to check out.
          </SheetDescription>
        </SheetHeader>

        {/* Scrollable Item List */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50">
              <p>Your cart is empty.</p>
            </div>
          ) : (
            <div className="space-y-6">
              <RoleGate allowedRoles={["admin"]}>
                <div className="space-y-2 p-3 bg-muted/50 rounded-md border">
                  <Label>Requesting On Behalf Of (Optional)</Label>

                  <UserSearch
                    selectedUserId={proxyUserId}
                    onSelect={setProxyUserId}
                  />

                  <p className="text-[10px] text-muted-foreground">
                    Leave empty to request for yourself.
                  </p>
                </div>
              </RoleGate>

              {items.map((item) => (
                <div key={item.id} className="flex gap-4 items-start">
                  {/* Item Details */}
                  <div className="flex-1 space-y-1">
                    <p className="font-medium text-sm leading-none">
                      {item.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.category}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center border border-border rounded-md h-8">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="px-2 h-full hover:bg-muted transition-colors border-r border-border"
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-8 text-center text-xs font-medium">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="px-2 h-full hover:bg-muted transition-colors border-l border-border"
                      //   disabled={item.quantity >= item.available} // Optional cap
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>

                  {/* Remove Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer / Checkout Form */}
        {items.length > 0 && (
          <div className="p-6 bg-background border-t border-border shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Project / Reason</Label>
                <Input
                  placeholder="e.g. Nike Photo Shoot"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <CalendarIcon className="h-3 w-3 text-muted-foreground" />
                    Due Date
                  </Label>
                  <Input
                    type="date"
                    value={dueDate}
                    min={tomorrow}
                    onChange={(e) => {
                      setDueDate(e.target.value);
                      console.log(e.target.value);
                    }}
                  />
                </div>
              </div>

              <Separator className="my-2" />

              <SheetFooter>
                <Button
                  className="w-full"
                  onClick={() => submitMutation.mutate()}
                  disabled={submitMutation.isPending || !reason || !dueDate}
                >
                  {submitMutation.isPending
                    ? "Submitting..."
                    : `Request ${items.length} Items`}
                </Button>
              </SheetFooter>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
