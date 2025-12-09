import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function ItemDetailsSkeleton() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto p-6 md:p-8">
      {/* 1. HEADER SKELETON */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-4 w-full">
          {/* Back Link */}
          <Skeleton className="h-4 w-32" />

          {/* Title & Badges */}
          <div className="space-y-2">
            <Skeleton className="h-10 w-3/4 max-w-[400px]" />
            <div className="flex items-center gap-3">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-32 rounded-full" />
            </div>
          </div>
        </div>

        {/* Edit Button Placeholder */}
        <Skeleton className="h-10 w-28 shrink-0" />
      </div>

      <Separator />

      <div className="grid gap-8 md:grid-cols-3">
        {/* 2. LEFT COLUMN (Description & Admin Panel) */}
        <div className="md:col-span-2 space-y-8">
          {/* Description Area */}
          <div className="space-y-4">
            <Skeleton className="h-6 w-32" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[90%]" />
              <Skeleton className="h-4 w-[95%]" />
              <Skeleton className="h-4 w-[80%]" />
            </div>
          </div>

          {/* Admin/Restricted Card Placeholder */}
          {/* We simulate the Admin Card structure so there is no jump if the user is an admin */}
          <Card className="border-muted bg-muted/10">
            <CardHeader className="pb-2">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-4 w-64 opacity-50" />
            </CardHeader>
            <CardContent className="grid gap-6 sm:grid-cols-2 pt-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-5 w-32" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* 3. RIGHT COLUMN (Status Card) */}
        <div className="space-y-6">
          <Card className="h-fit shadow-sm">
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-32 mx-auto" />
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center gap-4 py-4">
                {/* The Big Circle Ring */}
                <Skeleton className="h-20 w-20 rounded-full" />

                <div className="flex flex-col items-center gap-2">
                  {/* The Big Number */}
                  <Skeleton className="h-10 w-16" />
                  {/* "Available" Text */}
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Skeleton className="h-4 w-48 mx-auto" />
        </div>
      </div>
    </div>
  );
}
