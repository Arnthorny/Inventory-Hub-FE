"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@/hooks/use-debounce";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { clientService } from "@/lib/services/client-service";

interface UserSearchProps {
  onSelect: (userId?: string) => void;
  selectedUserId?: string;
}

export function UserSearch({ onSelect, selectedUserId }: UserSearchProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);

  // Fetch users based on search
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["user-search", debouncedQuery],
    queryFn: async () => {
      if (!debouncedQuery) {
        onSelect(undefined);
        return [];
      }
      const res = await clientService.getUsers(1, 5, debouncedQuery);
      return res.results;
    },
    enabled: open, // Only fetch when dropdown is open
  });

  // Find selected user object for display label
  const selectedUser = users.find((u: any) => u.id === selectedUserId);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-auto py-2"
        >
          {selectedUser ? (
            <div className="flex items-center gap-2 text-left">
              <Avatar className="h-6 w-6">
                <AvatarImage src={undefined} />
                <AvatarFallback>{selectedUser.first_name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium leading-none">
                  {selectedUser.first_name} {selectedUser.last_name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {selectedUser.email}
                </span>
              </div>
            </div>
          ) : (
            <span className="text-muted-foreground">
              Search user by name or email...
            </span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <Command shouldFilter={false}>
          {" "}
          {/* Server-side filtering */}
          <CommandInput
            placeholder="Search users..."
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
            {isLoading && (
              <div className="py-6 text-center text-xs text-muted-foreground">
                Searching...
              </div>
            )}
            {!isLoading && users.length === 0 && (
              <CommandEmpty>No users found.</CommandEmpty>
            )}

            <CommandGroup>
              {users.map((user: any) => (
                <CommandItem
                  key={user.id}
                  value={user.id}
                  onSelect={() => {
                    onSelect(user.id);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedUserId === user.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col">
                    <span>
                      {user.first_name} {user.last_name}
                    </span>
                    <span className="text-xs text-foreground">
                      {user.email}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
