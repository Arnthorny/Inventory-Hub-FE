import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function RequestDetailsSkeleton() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto p-6">
      {/* HEADER SKELETON */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="flex items-center gap-4 w-full">
          {/* Back Button */}
          <Skeleton className="h-10 w-10 rounded-md shrink-0" />
          
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              {/* Reason/Title */}
              <Skeleton className="h-8 w-48 md:w-64" />
              {/* Status Badge */}
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
            {/* ID */}
            <Skeleton className="h-4 w-32" />
          </div>
        </div>

        {/* Admin Actions Placeholder */}
        <Skeleton className="h-10 w-full md:w-40" />
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: ITEMS & TIMELINE (Takes 2 cols) */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Items Card */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent>
              <div className="divide-y border rounded-md">
                {/* Simulate 3 items */}
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-4 flex justify-between items-center">
                    <Skeleton className="h-5 w-1/2" />
                    <Skeleton className="h-6 w-16 rounded-md" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Timeline Card */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-24" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-32" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-32" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN: USER DETAILS (Takes 1 col) */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center text-center p-4">
                {/* Avatar */}
                <Skeleton className="h-20 w-20 rounded-full mb-4" />
                {/* Name */}
                <Skeleton className="h-6 w-32 mb-2" />
                {/* Email */}
                <Skeleton className="h-3 w-40 mb-3" />
                {/* Role Badge */}
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
              
              <Separator className="my-4" />
              
              {/* Dates Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}