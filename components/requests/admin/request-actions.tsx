"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Request } from "@/lib/types";
import { clientService } from "@/lib/services/client-service";
import { EditRequestDialog } from "./edit-request-dialog";

export function RequestActions({ request }: { request: Request }) {
  const queryClient = useQueryClient();
  const [showEdit, setShowEdit] = useState(false);

  const statusMutation = useMutation({
    mutationFn: (status: "approved" | "rejected" | "returned") =>
      clientService.updateRequestStatus(request.id, status),
    onSuccess: (_, status) => {
      toast.success(`Request ${status}`);
      queryClient.invalidateQueries({ queryKey: ["request", request.id] });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  // 1. PENDING LOGIC
  if (request.status === "pending") {
    return (
      // Grid ensures buttons take equal width on mobile
      <div className="grid grid-cols-2 md:flex gap-2 w-full md:w-auto">
        <Button
          variant="destructive"
          onClick={() => statusMutation.mutate("rejected")}
          disabled={statusMutation.isPending}
          className="w-full md:w-auto cursor-pointer" // Full width mobile
        >
          Reject
        </Button>

        {request.requester_role === "guest" ? (
          <>
            <Button
              onClick={() => setShowEdit(true)}
              className="w-full md:w-auto cursor-pointer"
            >
              Edit & Approve
            </Button>
            <EditRequestDialog
              requestId={request.id}
              guestReason={request.reason}
              givenDueDate={request.due_date}
              open={showEdit}
              onClose={() => setShowEdit(false)}
            />
          </>
        ) : (
          <Button
            onClick={() => statusMutation.mutate("approved")}
            disabled={statusMutation.isPending}
            className="w-full md:w-auto cursor-pointer"
          >
            Approve
          </Button>
        )}
      </div>
    );
  }

  if (request.status === "approved" || request.status == "overdue") {
    return (
      <Button
        variant="outline"
        className="w-full md:w-auto border-green-600 text-green-600 hover:bg-green-500 cursor-pointer"
        onClick={() => statusMutation.mutate("returned")}
        disabled={statusMutation.isPending}
      >
        Mark as Returned
      </Button>
    );
  }

  return null; // No actions for Rejected/Returned
}
