import { redirect } from "next/navigation";
import { authService } from "@/lib/services/auth-service";
import { itemsService } from "@/lib/services/items-service";
import { requestsService } from "@/lib/services/requests-service";
import { StatsGrid } from "@/components/dashboard/stats-grid";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Dashboard
        </h1>
        <p className="text-muted-foreground mt-2">
          Welcome back! Here&apos;s an overview of your inventory.
        </p>
      </div>
      <StatsGrid></StatsGrid>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest inventory changes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground text-center py-8">
            No recent activity yet
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
