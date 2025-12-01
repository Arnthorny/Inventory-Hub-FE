"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RequestTable } from "@/components/requests/request-table";
import { RequestGrid } from "@/components/requests/request-grid";
import { clientService } from "@/lib/services/client-service";

const REQUEST_PER_PAGE = 10;
export default function RequestsPage() {
  const { user } = useCurrentUser();
  const isAdmin = user?.role === "admin";

  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");

  const { data, isLoading, error } = useQuery({
    queryKey: ["requests", page, statusFilter, roleFilter],
    queryFn: () =>
      clientService.getClientRequests(
        page,
        REQUEST_PER_PAGE,
        statusFilter === "all" ? undefined : statusFilter,
        roleFilter === "all" ? undefined : roleFilter
      ),
  });

  const requests = data?.results || [];
  const totalReqs = data?.total || 0;
  const totalPages = Math.ceil(totalReqs / REQUEST_PER_PAGE);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <h1 className="text-3xl font-bold">Requests</h1>

        {/* FILTERS */}
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="returned">Returned</SelectItem>
            </SelectContent>
          </Select>

          {isAdmin && (
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="staff">Staff</SelectItem>
                <SelectItem value="intern">Intern</SelectItem>
                <SelectItem value="guest">Guest</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : requests.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          No requests found.
        </div>
      ) : (
        <>
          {/* CONDITIONAL RENDERING */}
          {isAdmin ? (
            <RequestTable requests={requests} />
          ) : (
            <RequestGrid requests={requests} />
          )}

          {/* --- PAGINATION CONTROLS (ADDED) --- */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || isLoading}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || isLoading}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
