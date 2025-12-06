import { notFound } from "next/navigation";
import { guestService } from "@/lib/services/guests-service";
import { RequestStatusBadge } from "@/components/requests/request-status-badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CalendarIcon, Package, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

export default async function GuestPortalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // 1. Fetch Data
  const { guest } = await guestService.getGuestById(id);

  // 2. Security Check: 404 if not found OR if inactive
  if (!guest || !guest.is_active) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <AlertCircle className="h-12 w-12 text-muted-foreground" />
        <h1 className="text-2xl font-bold text-muted-foreground">
          Link Expired or Invalid
        </h1>
        <p className="text-muted-foreground">
          Please contact the studio admin for a new link.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* HEADER SECTION */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome, {guest.first_name}
        </h1>
        <p className="text-muted-foreground">
          Track your equipment requests and status here.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* LEFT COL: PROFILE CARD */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Guest Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase">
                  Email
                </p>
                <p className="text-sm font-medium">{guest.email}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase">
                  Status
                </p>
                <Badge
                  variant="outline"
                  className="mt-1 bg-green-50 text-green-700 border-green-200"
                >
                  Active Guest
                </Badge>
              </div>
              <Separator />
              <p className="text-xs text-muted-foreground">
                This is a temporary access link. If you lose it, ask an admin to
                resend it or check your confirmation email.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COL: REQUESTS LIST */}
        <div className="md:col-span-2 space-y-6">
          <h2 className="text-xl font-semibold">Your Requests</h2>

          {guest.requests.length === 0 ? (
            <div className="text-center py-10 border rounded-lg bg-muted/20">
              <p className="text-muted-foreground">No requests found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {guest.requests.map((req) => (
                <Card key={req.id} className="overflow-hidden">
                  <div className="border-l-4 border-l-primary h-full">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-base">
                            {req.reason.length > 150
                              ? `${req.reason.slice(0, 150)}...`
                              : req.reason || "Request Details"}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-2 mt-1">
                            <CalendarIcon className="h-3 w-3" />
                            {format(new Date(req.created_at), "MMM d, yyyy")} -{" "}
                            {req.due_date && format(new Date(req.due_date), "MMM d, yyyy")}
                          </CardDescription>
                        </div>
                        <RequestStatusBadge status={req.status} />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-muted/40 rounded-md p-3">
                        <div className="flex items-center gap-2 text-sm font-medium mb-2 text-muted-foreground">
                          <Package className="h-4 w-4" />
                          Items Requested
                        </div>
                        <ul className="space-y-1">
                          {req.items &&
                            req.items.map((item, idx) => (
                              <li
                                key={idx}
                                className="text-sm flex justify-between"
                              >
                                <span>{item.name}</span>
                                <span className="text-muted-foreground font-mono text-xs">
                                  x{item.quantity}
                                </span>
                              </li>
                            ))}
                        </ul>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
