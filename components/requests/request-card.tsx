"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Request } from "@/lib/types";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface RequestDetailedItem {
  name: string;
  category: string | null;
  quantity: number;
}

interface RequestCardProps {
  request: Request;
  itemCount?: number;
  onApprove?: (id: string) => Promise<void>;
  onReject?: (id: string) => Promise<void>;
  onReturn?: (id: string) => Promise<void>;
  isStaff?: boolean;
  isLoading?: boolean;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  returned: "bg-gray-100 text-gray-800",
};

export function RequestCard({
  request,
  itemCount = 0,
  onApprove,
  onReject,
  onReturn,
  isStaff = false,
  isLoading = false,
}: RequestCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [details, setDetails] = useState<{
    items: RequestDetailedItem[];
  } | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  useEffect(() => {
    if (isOpen && !details) {
      const loadDetails = async () => {
        try {
          setIsLoadingDetails(true);
          const response = await fetch(`/api/requests/${request.id}/details`);
          const data = await response.json();
          console.log(data);
          setDetails(data);
        } catch (error) {
          console.error("Error loading request details:", error);
        } finally {
          setIsLoadingDetails(false);
        }
      };
      loadDetails();
    }
  }, [isOpen, details, request.id]);

  return (
    <>
      <Card
        className="cursor-pointer hover:shadow-lg transition-shadow"
        onClick={() => setIsOpen(true)}
      >
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-base">
                Request #{request.id.slice(0, 8)}
              </CardTitle>
              <CardDescription>
                {format(
                  new Date(request.created_at),
                  "MMM d, yyyy 'at' h:mm a"
                )}
              </CardDescription>
            </div>
            <Badge
              className={
                statusColors[request.status] || "bg-gray-100 text-gray-800"
              }
            >
              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Items Requested</p>
            <p className="text-2xl font-bold">{itemCount}</p>
          </div>

          {request.notes && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">Notes</p>
              <p className="text-sm line-clamp-2">{request.notes}</p>
            </div>
          )}

          {request.due_date && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">Due Date</p>
              <p className="text-sm">
                {format(new Date(request.due_date), "MMM d, yyyy")}
              </p>
            </div>
          )}

          <p className="text-xs text-muted-foreground pt-2">
            Click to view details
          </p>

          {isStaff && request.status === "pending" && (
            <div className="flex gap-2 pt-4 border-t">
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onApprove?.(request.id);
                }}
                disabled={isLoading}
                className="flex-1"
                variant="default"
              >
                Approve
              </Button>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onReject?.(request.id);
                }}
                disabled={isLoading}
                className="flex-1"
                variant="outline"
              >
                Reject
              </Button>
            </div>
          )}

          {isStaff && request.status === "approved" && (
            <div className="flex gap-2 pt-4 border-t">
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onReturn?.(request.id);
                }}
                disabled={isLoading}
                className="flex-1"
                variant="outline"
              >
                Mark Returned
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal dialog to display full request details */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Request #{request.id.slice(0, 8)} Details</DialogTitle>
            <DialogDescription>
              {format(new Date(request.created_at), "MMM d, yyyy 'at' h:mm a")}
            </DialogDescription>
          </DialogHeader>

          {isLoadingDetails ? (
            <div className="py-8 text-center text-muted-foreground">
              Loading details...
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge
                    className={
                      statusColors[request.status] ||
                      "bg-gray-100 text-gray-800"
                    }
                  >
                    {request.status.charAt(0).toUpperCase() +
                      request.status.slice(1)}
                  </Badge>
                </div>
                {request.due_date && (
                  <div>
                    <p className="text-sm text-muted-foreground">Due Date</p>
                    <p className="font-medium">
                      {format(new Date(request.due_date), "MMM d, yyyy")}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-semibold mb-3">
                  Items Requested ({details?.items.length || 0})
                </h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {details?.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center p-3 bg-muted rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{item.name}</p>
                        {item.category && (
                          <p className="text-xs text-muted-foreground">
                            {item.category}
                          </p>
                        )}
                      </div>
                      <p className="font-semibold">Qty: {item.quantity}</p>
                    </div>
                  ))}
                </div>
              </div>

              {request.notes && (
                <div>
                  <h3 className="font-semibold mb-2">Notes</h3>
                  <p className="text-sm p-3 bg-muted rounded-lg">
                    {request.notes}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
