"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import type { Item } from "@/lib/types";

interface ItemTableProps {
  items: Item[];
  onEdit?: (item: Item) => void;
  onDelete?: (id: string) => Promise<void>;
  isAdmin?: boolean;
}

export function ItemTable({
  items,
  onEdit,
  onDelete,
  isAdmin = false,
}: ItemTableProps) {
  const getTotalQuantity = (item: Item) => item?.total || 0;

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted">
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            {isAdmin ? (
              <>
                <TableHead className="text-right">Available</TableHead>
                <TableHead className="text-right">In Use</TableHead>
                <TableHead className="text-right">Damaged</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </>
            ) : (
              <TableHead className="text-right">Available</TableHead>
            )}
            {isAdmin && <TableHead className="w-24">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={isAdmin ? 7 : 3}
                className="text-center text-muted-foreground py-8"
              >
                No items found
              </TableCell>
            </TableRow>
          ) : (
            items.map((item) => (
              <TableRow key={item.id} className="hover:bg-muted/50">
                <TableCell>
                  <div>
                    <p className="font-medium">{item.name}</p>
                    {item.description && (
                      <p className="text-xs text-muted-foreground">
                        {item.description}
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {item.category || "-"}
                </TableCell>
                {isAdmin ? (
                  <>
                    <TableCell className="text-right">
                      {item.available}
                    </TableCell>
                    <TableCell className="text-right">{item.in_use}</TableCell>
                    <TableCell className="text-right text-destructive">
                      {item.damaged}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {getTotalQuantity(item)}
                    </TableCell>
                  </>
                ) : (
                  <TableCell className="text-right font-medium">
                    {item.available}
                  </TableCell>
                )}
                {isAdmin && (
                  <TableCell>
                    <div className="flex gap-2">
                      {onEdit && (
                        <Button
                          variant="outline"
                          className="cursor-pointer"
                          size="sm"
                          onClick={() => onEdit(item)}
                        >
                          Edit
                        </Button>
                      )}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
