"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useDebounce } from "@/hooks/use-debounce";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar } from "@/components/ui/calendar"; // <--- Ensure you have this shadcn component
import { Label } from "@/components/ui/label";
import {
  Trash2,
  Plus,
  Check,
  ChevronsUpDown,
  Minus,
  CalendarIcon,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { clientService } from "@/lib/services/client-service";
import { Item } from "@/lib/types";

interface EditRequestDialogProps {
  requestId: string;
  guestReason: string;
  givenDueDate?: Date;
  open: boolean;
  onClose: () => void;
}

interface SelectedItem {
  item: Item;
  quantity: number;
}

export function EditRequestDialog({
  requestId,
  guestReason,
  givenDueDate,
  open,
  onClose,
}: EditRequestDialogProps) {
  const queryClient = useQueryClient();
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const today = new Date();
  const tomorrow = new Date(today.setDate(today.getDate() + 1));
  const [dueDate, setDueDate] = useState<Date | undefined>(givenDueDate || tomorrow);

  const [openCombobox, setOpenCombobox] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 300);

  // 1. SEARCH QUERY
  const { data: searchResults, isLoading: isSearching } = useQuery({
    queryKey: ["item-search", debouncedSearch],
    queryFn: async () => {
      if (!debouncedSearch) return [];
      const res = await clientService.getItems(1, 5, debouncedSearch);
      return res.results;
    },
    enabled: debouncedSearch.length > 1,
  });

  // 2. MUTATION
  const mutation = useMutation({
    mutationFn: async () => {
      if (selectedItems.length === 0)
        throw new Error("Please add at least one item");
      if (!dueDate) throw new Error("Please select a due date"); // <--- Validation

      // A. Update Items
      await clientService.updateGuestRequest(
        requestId,
        selectedItems.map((i) => ({
          item_id: i.item.id,
          quantity: i.quantity,
        })),
        dueDate
      );
    },
    onSuccess: () => {
      toast.success("Request Processed & Approved");
      queryClient.invalidateQueries({ queryKey: ["request", requestId] });
      onClose();
    },
    onError: (err) => toast.error(err.message),
  });

  // ... (addItem, removeItem, updateQty handlers remain the same) ...
  const addItem = (item: Item) => {
    const existing = selectedItems.find((x) => x.item.id === item.id);
    if (!existing) {
      setSelectedItems([
        ...selectedItems,
        {
          item,
          quantity: 1,
        },
      ]);
    }
    // setSearchQuery("");
  };
  const removeItem = (id: string) => {
    setSelectedItems((prev) => prev.filter((i) => i.item.id !== id));
  };

  const updateQty = (id: string, delta: number) => {
    setSelectedItems((prev) =>
      prev.map((selItem) => {
        if (selItem.item.id === id) {
          const newQuantity = Math.max(1, selItem.quantity + delta);
          const cappedQuantity = Math.min(newQuantity, selItem.item.available);
          return { ...selItem, quantity: cappedQuantity };
        } else return selItem;
      })
    );
  };

  const setExactQty = (id: string, value: string) => {
    const parsed = parseInt(value);
    // Allow empty string temporarily (while typing), otherwise default to 0
    const newQty = isNaN(parsed) ? 0 : parsed;

    setSelectedItems((prev) =>
      prev.map((selItem) => {
        if (selItem.item.id === id) {
          // Cap at available stock immediately
          if (newQty > selItem.item.available) {
            return { ...selItem, quantity: selItem.item.available };
          }
          return { ...selItem, quantity: newQty };
        }
        return selItem;
      })
    );
  };

  // Auto-correct on Blur (User leaves the field)
  // If they left it empty or 0, reset to 1
  const handleBlur = (id: string) => {
    setSelectedItems((prev) =>
      prev.map((selItem) => {
        if (selItem.item.id === id && selItem.quantity < 1) {
          return { ...selItem, quantity: 1 };
        }
        return selItem;
      })
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      {/* 1. RESPONSIVE CONTAINER: Full screen on mobile, centered modal on tablet+ */}
      <DialogContent className="w-full h-full max-w-none sm:h-[85vh] sm:max-w-[600px] p-0 flex flex-col gap-0">
        {/* HEADER */}
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle>Process Guest Request</DialogTitle>
        </DialogHeader>

        {/* SCROLLABLE BODY */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* 1. GUEST REASON */}
          <div className="bg-muted/50 p-3 sm:p-4 rounded-md border border-border">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Guest Request Note
            </span>
            <p className="mt-1 text-sm font-medium text-foreground leading-relaxed">
              "{guestReason}"
            </p>
          </div>

          {/* 2. CONTROLS GRID (Stacks on mobile) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* ITEM SEARCH */}
            <div className="space-y-2">
              <Label>Add Items</Label>
              <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                {/* ... (Trigger/Content same as before) ... */}
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    Select item...
                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                {/* Note: PopoverContent automatically adjusts to viewport width on mobile */}
                <PopoverContent
                  className="w-[var(--radix-popover-trigger-width)] p-0"
                  align="start"
                >
                  <Command shouldFilter={false}>
                    <CommandInput
                      placeholder="Search inventory..."
                      value={searchQuery}
                      onValueChange={setSearchQuery}
                    />
                    <CommandList>
                      {isSearching && (
                        <div className="py-6 text-center text-sm text-muted-foreground">
                          Searching...
                        </div>
                      )}
                      <CommandGroup>
                        {searchResults?.map((item: any) => (
                          <CommandItem
                            key={item.id}
                            value={item.id}
                            onSelect={() => addItem(item)}
                            disabled={item.available < 1}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedItems.find((i) => i.item.id === item.id)
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            <span>{item.name}</span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* DUE DATE */}
            <div className="space-y-2">
              <Label>Set Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dueDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? (
                      format(dueDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={setDueDate}
                    disabled={(date) => date < new Date()} // Block past dates
                    autoFocus={true}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* 3. SELECTED ITEMS LIST */}
          <div className="border rounded-md overflow-hidden flex flex-col">
            <div className="bg-muted/30 px-4 py-2 border-b text-xs font-medium text-muted-foreground">
              Items to be Approved ({selectedItems.length})
            </div>

            {/* Remove ScrollArea here. Just let the page scroll naturally on mobile. */}
            <div className="divide-y">
              {selectedItems.length === 0 ? (
                <div className="h-32 flex items-center justify-center text-sm text-muted-foreground">
                  No items added.
                </div>
              ) : (
                selectedItems.map(({ item, quantity }) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3 gap-3"
                  >
                    {/* Item Name */}
                    <div className="flex-1">
                      <span className="text-sm font-medium block">
                        {item.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {item.available} available
                      </span>
                    </div>

                    {/* Controls Row */}
                    <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                      <div className="flex items-center border rounded-md h-8 bg-background">
                        <button
                          onClick={() => updateQty(item.id, -1)}
                          disabled={quantity <= 1}
                          className="px-3 h-full hover:bg-muted disabled:opacity-30 border-r flex items-center justify-center"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <input
                          type="number"
                          min="1"
                          max={item.available}
                          value={quantity === 0 ? "" : quantity} // Show empty if 0 so user can type
                          onChange={(e) => setExactQty(item.id, e.target.value)}
                          onBlur={() => handleBlur(item.id)}
                          className="w-12 h-full text-center text-sm font-medium bg-transparent border-0 focus:outline-none focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <button
                          onClick={() => updateQty(item.id, 1)}
                          disabled={quantity >= item.available}
                          className="px-3 h-full hover:bg-muted disabled:opacity-30 border-l flex items-center justify-center"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <DialogFooter className="px-6 py-4 border-t bg-background mt-auto sm:mt-0 flex flex-col-reverse sm:flex-row gap-2">
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => {
              setSelectedItems([]);
              onClose();
            }}
          >
            Cancel
          </Button>
          <Button
            className="w-full sm:w-auto"
            onClick={() => mutation.mutate()}
            disabled={
              mutation.isPending || selectedItems.length === 0 || !dueDate
            }
          >
            {mutation.isPending ? "Approving..." : "Confirm & Approve"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
