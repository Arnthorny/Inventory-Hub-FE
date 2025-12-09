"use client";

import { useDashboardStats } from "@/hooks/use-dashboard-stats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, Package, Clock, CheckCircle } from "lucide-react";
import { RoleGate } from "@/components/auth/role-gate";
import { useCurrentUser } from "@/hooks/use-current-user";

export function StatsGrid() {
  const { stats, isLoading, error } = useDashboardStats();
  const { user } = useCurrentUser();
  const isAdmin = user?.role === "admin";

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <Skeleton className="h-4 w-[100px]" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-[60px]" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border border-red-200 bg-red-50 text-red-600 rounded-md flex items-center gap-2">
        <AlertTriangle className="h-4 w-4" />
        <span>Failed to load dashboard statistics.</span>
      </div>
    );
  }

  return (
    <div
      className={
        isAdmin ? "grid gap-4 md:grid-cols-4" : "grid gap-4 md:grid-cols-3"
      }
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Items</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.total_items || 0}</div>
          <RoleGate allowedRoles={["admin"]}>
            <p className="text-xs text-muted-foreground mt-1">
              {stats?.total_units} units in system
            </p>
          </RoleGate>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Pending Requests
          </CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats?.total_pending_requests || 0}
          </div>
          <p className="text-xs text-muted-foreground">Requires approval</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Approved Requests
          </CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats?.total_approved_requests || 0}
          </div>
          <p className="text-xs text-muted-foreground">Currently active</p>
        </CardContent>
      </Card>
      <RoleGate allowedRoles={["admin"]}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Users</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.pending_users || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats?.active_users || 0} active users
            </p>
          </CardContent>
        </Card>
      </RoleGate>
    </div>
  );
}
