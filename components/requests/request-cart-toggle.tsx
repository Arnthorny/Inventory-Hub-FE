"use client";

import { ShoppingBag } from "lucide-react";
import { useRequestStore } from "@/hooks/use-request-store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCurrentUser } from "@/hooks/use-current-user";

export function RequestCartToggle() {
  const { toggleCart, items } = useRequestStore();
  const { user } = useCurrentUser();
  const itemCount = items.length;

  if (user?.role === "admin") return null;

  return (
    <Button
      onClick={toggleCart}
      size="icon"
      className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-xl transition-transform hover:scale-105"
    >
      <ShoppingBag className="h-6 w-6" />

      {itemCount > 0 && (
        <Badge
          className="absolute -top-1 -right-1 h-6 w-6 flex items-center justify-center rounded-full p-0 text-xs border-2 border-background"
          variant="destructive" // Red color makes it pop
        >
          {itemCount}
        </Badge>
      )}
    </Button>
  );
}
