import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RequestStatusBadge } from "./request-status-badge";
import { format } from "date-fns";
import { Request } from "@/lib/types";
import { User } from "lucide-react"; // <--- Import the generic icon

export function RequestTable({ requests }: { requests: Request[] }) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Requester</TableHead>
            <TableHead>Project</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Due</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((req) => (
            <TableRow key={req.id} className="cursor-pointer hover:bg-muted/50">
              <TableCell>
                <Link
                  href={`/requests/${req.id}`}
                  className="flex items-center gap-2"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={undefined} alt={"nA"} />
                    <AvatarFallback className="bg-muted">
                      <User className="h-5 w-5 text-muted-foreground" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-medium text-sm">{req.requester}</span>
                    <span className="text-xs text-muted-foreground capitalize">
                      {req.requester_role}
                    </span>
                  </div>
                </Link>
              </TableCell>
              <TableCell>
                {req.reason && req.reason.length > 20
                  ? `${req.reason.slice(0, 20)}...`
                  : req.reason}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                <span>{format(new Date(req.created_at), "MMM d")}</span>
              </TableCell>
              <TableCell>
                {req.due_date && (
                  <span> {format(new Date(req.due_date), "MMM d")}</span>
                )}
              </TableCell>
              <TableCell>
                <RequestStatusBadge status={req.status} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
