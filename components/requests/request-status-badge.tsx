import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export function RequestStatusBadge({ status }: { status: string }) {
  const styles = {
    pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200",
    approved: "bg-green-100 text-green-800 hover:bg-green-100 border-green-200",
    rejected: "bg-red-100 text-red-800 hover:bg-red-100 border-red-200",
    returned: "bg-slate-100 text-slate-800 hover:bg-slate-100 border-slate-200",
    overdue: "bg-red-600 text-white hover:bg-red-600 border-red-600",
  }

  return (
    <Badge variant="outline" className={cn("capitalize", styles[status as keyof typeof styles])}>
      {status}
    </Badge>
  )
}