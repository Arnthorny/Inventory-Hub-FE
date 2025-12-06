"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useCurrentUser } from "@/hooks/use-current-user";
import { RoleGate } from "@/components/auth/role-gate";
import { RequestActions } from "@/components/requests/admin/request-actions";
import { RequestStatusBadge } from "@/components/requests/request-status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Calendar, User, Box, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { clientService } from "@/lib/services/client-service";

export default function RequestDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useCurrentUser();

  const {
    data: request,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["request", id],
    queryFn: async () => await clientService.getClientRequestById(id),
  });

  const isAdmin = user?.role === "admin";

  if (isLoading)
    return <div className="p-10 text-center">Loading request...</div>;

  if (error) {
    return (
      <div className="p-4 border border-red-200 bg-red-50 text-red-600 rounded-md flex items-center gap-2">
        <AlertTriangle className="h-4 w-4" />
        <span>Failed to load request. {error.message}</span>
      </div>
    );
  }

  if (!request) {
    return <div className="p-10 text-center">Request not found.</div>;
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="flex items-center gap-4 w-full">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="-ml-2 md:ml-0 cursor-pointer"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1 min-w-0">
            {" "}
            {/* min-w-0 prevents text overflow */}
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-xl md:text-2xl font-bold truncate">
                {request.reason && request.reason.length > 20
                  ? `${request.reason.slice(0, 20)}...`
                  : request.reason || "Request Details"}
              </h1>
              <RequestStatusBadge status={request.status} />
            </div>
            <p className="text-muted-foreground text-sm mt-1">
              ID: {request.id}
            </p>
          </div>
        </div>

        {/* ADMIN ACTIONS (Only visible to Admin) */}
        <div className="w-full md:w-auto">
          <RoleGate allowedRoles={["admin"]}>
            <RequestActions request={request} />
          </RoleGate>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* LEFT COLUMN: ITEMS */}
        <div
          className={
            isAdmin ? "md:col-span-2 space-y-6" : "md:col-span-3 space-y-6"
          }
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Box className="h-5 w-5 text-muted-foreground" />
                Requested Items ({(request.items && request.items.length) || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="divide-y border rounded-md">
                {request.items &&
                  request.items.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 flex justify-between items-center"
                    >
                      <span className="font-medium">{item.name}</span>
                      <span className="text-sm bg-muted px-2 py-1 rounded">
                        Qty: {item.quantity}
                      </span>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* TIMELINE (Simplified) */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Requested</span>
                <span>{format(new Date(request.created_at), "PPP")}</span>
              </div>
              {request.due_date && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Due Date</span>
                  <span>{format(new Date(request.due_date), "PPP")}</span>
                </div>
              )}
              {request.returned_at && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Returned</span>
                  <span>{format(new Date(request.returned_at), "PPP")}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN: USER DETAILS */}
        <RoleGate allowedRoles={["admin"]}>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <User className="h-5 w-5 text-muted-foreground" />
                  Requester
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center text-center p-4">
                  <Avatar className="h-20 w-20 mb-4">
                    <AvatarImage src={undefined} />
                    <AvatarFallback className="bg-muted">
                      <User className="h-8 w-8 text-muted-foreground" />
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-lg font-bold">{request.requester}</h3>
                  <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                    {request.requester_role}
                  </span>
                </div>
                <Separator className="my-4" />
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground">
                        Needed From
                      </span>
                      <span>{format(new Date(request.created_at), "PPP")}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground">
                        Until
                      </span>
                      <span>
                        {format(
                          request.due_date
                            ? new Date(request.due_date)
                            : new Date(),
                          "PPP"
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </RoleGate>
      </div>
    </div>
  );
}
