import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { FormControl, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Button } from "../ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { UseFormReturn } from "react-hook-form";
import { cn } from "@/lib/utils";

interface CategoryItemSelectProps {
  categories: Array<string>;
  open: boolean;
  inputValue: string;
  field: any;
  form: UseFormReturn<any>;
  setOpen: (open: boolean) => void;
  setInputValue: (inputValue: string) => void;
}

export function CategoryItemSelect({
  open,
  setOpen,
  categories,
  field,
  setInputValue,
  inputValue,
  form,
}: CategoryItemSelectProps) {
  return (
   <FormItem className="flex flex-col">
  <FormLabel>Category</FormLabel>
  <Popover open={open} onOpenChange={setOpen}>
    <PopoverTrigger asChild>
      <FormControl>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between",
            "border border-input shadow-sm", // <--- Explicitly force the border and shadow
            !field.value && "text-muted-foreground"
          )}
        >
          {/* Show selected value, or placeholder */}
          {field.value
            ? field.value.charAt(0).toUpperCase() + field.value.slice(1)
            : "Select or type category..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </FormControl>
    </PopoverTrigger>
    
    {/* Ensure the dropdown itself has a border */}
    <PopoverContent className="w-[--radix-popover-trigger-width] p-0 border border-input shadow-md">
      <Command>
        {/* The Search Input inside the dropdown */}
        <CommandInput
          placeholder="Search or create category..."
          onValueChange={setInputValue}
          className="h-9" // Standard input height
        />
        <CommandList>
          <CommandEmpty>
            <div
              className="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
              onClick={() => {
                form.setValue("category", inputValue);
                setOpen(false);
              }}
            >
              <span className="text-muted-foreground">Create:</span>
              <span className="font-bold">"{inputValue}"</span>
            </div>
          </CommandEmpty>

          <CommandGroup>
            {categories.map((cat) => (
              <CommandItem
                value={cat}
                key={cat}
                onSelect={() => {
                  form.setValue("category", cat);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    cat === field.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
  <FormMessage />
</FormItem>
  );
}
