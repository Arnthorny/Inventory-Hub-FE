"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Edit,
  MapPin,
  Package,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useCurrentItem } from "@/hooks/use-current-item";
import { useCurrentUser } from "@/hooks/use-current-user";
import NotFound from "@/app/not-found/page";
import { use } from "react";
import ItemDetailsSkeleton from "@/components/inventory/item-details-skeleton";

export default function ItemDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: item_id } = use(params);
  const { data: item, isLoading, error } = useCurrentItem(item_id);

  const { user, isLoading: isUserLoading } = useCurrentUser();
  const userRole = user && user.role;

  const isAdmin = userRole === "admin";

  if (!isLoading && !item) return NotFound();

  if (isLoading || isUserLoading) return <ItemDetailsSkeleton />;

  if (item) {
    return (
      <div className="space-y-8 max-w-5xl mx-auto p-6 md:p-8">
        {/* 1. TOP NAVIGATION & HEADER */}
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-4">
            <Link
              href="/inventory"
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Inventory
            </Link>

            <div className="space-y-1">
              <h1 className="text-4xl font-extrabold tracking-tight lg:text-4xl mb-2">
                {item.name}
              </h1>
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="px-2 py-0.5 text-sm">
                  {item.category}
                </Badge>
                <span className="text-muted-foreground">•</span>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Lock className="h-3 w-3" />
                  <span className="capitalize">
                    {item.level} Access Required
                  </span>
                </div>
              </div>
            </div>
          </div>

          {isAdmin && (
            <Button asChild>
              <Link href={`/inventory/${item_id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Item
              </Link>
            </Button>
          )}
        </div>

        <Separator />

        <div className="grid gap-8 md:grid-cols-3">
          {/* 2. MAIN CONTENT (Left 2 Columns) */}
          <div className="md:col-span-2 space-y-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Info className="h-5 w-5 text-muted-foreground" />
                Description
              </h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </div>

            {/* ADMIN ONLY SECTION */}
            {isAdmin ? (
              <Card className="border-amber-200 bg-amber-50/50 dark:border-amber-900/50 dark:bg-amber-950/10">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2 text-amber-700 dark:text-amber-500">
                    <ShieldAlert className="h-5 w-5" />
                    <CardTitle className="text-base">
                      Administrative Details
                    </CardTitle>
                  </div>
                  <CardDescription>
                    Confidential metrics visible only to administrators.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6 sm:grid-cols-2 pt-4">
                  <div className="space-y-1">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> Location
                    </span>
                    <p className="font-semibold text-foreground">
                      {item.location}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                      <Package className="h-3 w-3" /> Total Stock
                    </span>
                    <p className="font-semibold text-foreground">
                      {item.total} Units
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      In Use
                    </span>
                    <p className="font-semibold text-blue-600">
                      {item.in_use} Units
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" /> Damaged
                    </span>
                    <p className="font-semibold text-red-600">
                      {item.damaged} Units
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground bg-muted/20">
                Detailed stock metrics and location data are restricted to
                administrators.
              </div>
            )}
          </div>

          {/* 3. SIDEBAR STATS (Right 1 Column) */}
          <div className="space-y-6">
            <Card className="h-fit shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Current Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center gap-4 py-4 text-center">
                  <div
                    className={`
                    flex h-20 w-20 items-center justify-center rounded-full ring-8 ring-opacity-20
                    ${
                      item.available > 0
                        ? "bg-green-100 text-green-600 ring-green-500"
                        : "bg-red-100 text-red-600 ring-red-500"
                    }
                  `}
                  >
                    {item.available > 0 ? (
                      <CheckCircle2 className="h-10 w-10" />
                    ) : (
                      <ShieldAlert className="h-10 w-10" />
                    )}
                  </div>
                  <div>
                    <div className="text-4xl font-bold tracking-tighter">
                      {item.available}
                    </div>
                    <p className="text-sm font-medium text-muted-foreground mt-1">
                      Available for Checkout
                    </p>
                  </div>
                  {item.available === 0 && (
                    <Badge variant="destructive" className="mt-2">
                      Out of Stock
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Optional: Placeholder for Future Quick Actions */}
            <div className="text-xs text-muted-foreground text-center px-4">
              Need to borrow this item? Visit the lab manager.
            </div>
          </div>
        </div>
      </div>
    );
  }
}
