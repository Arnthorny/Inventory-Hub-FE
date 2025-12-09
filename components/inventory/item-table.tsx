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
import { useRequestStore } from "@/hooks/use-request-store";
import { ItemAdminActions } from "./item-admin-actions";

interface ItemTableProps {
  items: Item[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => Promise<void>;
  isAdmin?: boolean;
}

export function ItemTable({
  items,
  onEdit,
  onDelete,
  isAdmin = false,
}: ItemTableProps) {
  const { addItem, removeItem, items: cartItems } = useRequestStore();
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
                <TableHead className="text-right">Level</TableHead>
              </>
            ) : (
              <>
                <TableHead className="text-right">Available</TableHead>
                <TableHead className="text-right">Level</TableHead>
              </>
            )}
            {<TableHead className="text-right">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={isAdmin ? 8 : 4}
                className="text-center text-muted-foreground py-8"
              >
                No items available
              </TableCell>
            </TableRow>
          ) : (
            items.map((item) => {
              const isInCart = cartItems.some(
                (cartItem) => cartItem.id === item.id
              );
              return (
                <TableRow key={item.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div>
                      <p className="font-medium">{item.name}</p>
                      {item.description && (
                        <p className="text-xs text-muted-foreground">
                          {item.description.length > 70
                            ? `${item.description.slice(0, 70)}...`
                            : item.description}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {`${item.category[0].toLocaleUpperCase()}${item.category.slice(
                      1
                    )}` || "-"}
                  </TableCell>
                  {isAdmin ? (
                    <>
                      <TableCell className="text-right">
                        {item.available}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.in_use}
                      </TableCell>
                      <TableCell className="text-right text-destructive">
                        {item.damaged}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {getTotalQuantity(item)}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {`${item.level[0].toUpperCase()}${item.level.slice(1)}`}
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell className="text-right font-medium">
                        {item.available}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {`${item.level[0].toUpperCase()}${item.level.slice(1)}`}
                      </TableCell>
                    </>
                  )}
                  {isAdmin ? (
                    <TableCell className="text-right">
                      <ItemAdminActions
                        item={item}
                        isInCart={isInCart}
                        onEdit={onEdit}
                      />
                    </TableCell>
                  ) : (
                    <TableCell>
                      <div className="flex gap-1">
                        {isInCart ? (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => removeItem(item.id)}
                            className="cursor-pointer"
                          >
                            Remove
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => addItem(item)}
                            disabled={item.available < 1}
                            className="cursor-pointer"
                          >
                            Request
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
