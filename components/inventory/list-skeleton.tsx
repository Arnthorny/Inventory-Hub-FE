import { Skeleton } from "@/components/ui/skeleton"

export function ListSkeleton() {
  return (
    <div className="space-y-4">
      {/* Header-like skeleton */}
      <div className="flex gap-4 mb-6">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/4" />
      </div>

      {/* The Data Rows */}
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 py-3 border-b border-border/50">
          {/* Column 1 (Name - wider) */}
          <div className="w-1/4">
             <Skeleton className="h-5 w-3/4 mb-2" />
             <Skeleton className="h-3 w-1/2" />
          </div>
          
          {/* Column 2 */}
          <Skeleton className="h-4 w-1/4" />
          
          {/* Column 3 */}
          <Skeleton className="h-4 w-1/4" />
          
          {/* Column 4 (Actions - right aligned) */}
          <div className="w-1/4 flex justify-end gap-2">
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  )
}