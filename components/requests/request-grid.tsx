import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RequestStatusBadge } from "./request-status-badge";
import { CalendarIcon, Package } from "lucide-react";
import { format } from "date-fns"; // npm install date-fns
import { Request } from "@/lib/types";

export function RequestGrid({ requests }: { requests: Request[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {requests.map((req) => (
        <Link href={`/requests/${req.id}`} key={req.id}>
          <Card className="hover:border-primary transition-colors cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-medium truncate">
                {req.reason || "No Project Name"}
              </CardTitle>
              <RequestStatusBadge status={req.status} />
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  <span>
                    {/* {req?.items[0]?.name} */}
                    {/* {req?.items?.length > 1 && ` + ${req.items.length - 1} more`} */}
                    {"Due: "}
                    {req.due_date && format(new Date(req.due_date), "MMM d")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  {"Created:"}
                  <span>{format(new Date(req.created_at), "MMM d")}</span>
                </div>

                {req.returned_at && (
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    {"Returned:"}
                    <span>{format(new Date(req.returned_at), "MMM d")}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
