import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { usersService } from "@/lib/api/users-service"
import { itemsService } from "@/lib/api/items-service"
import { requestsService } from "@/lib/api/requests-service"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser()

  if (!authUser) {
    redirect("/auth/login")
  }

  let user = null
  const { user: foundUser } = await usersService.getUser(authUser.id)

  if (!foundUser) {
    const { user: newUser } = await usersService.createUser(authUser.id, authUser.email || "", "guest")
    user = newUser
  } else {
    user = foundUser
  }

  const { items } = await itemsService.getItems()
  const { requests } = await requestsService.getRequests()

  const totalItems = items.reduce((sum, item) => sum + item.available + item.damaged + item.in_use, 0)
  const pendingRequests = requests.filter((req) => req.status === "pending").length
  const approvedRequests = requests.filter((req) => req.status === "approved").length

  return (
    <DashboardLayout user={user}>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-2">Welcome back! Here&apos;s an overview of your inventory.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Items</CardTitle>
              <CardDescription>All inventory</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{items.length}</div>
              <p className="text-xs text-muted-foreground mt-1">{totalItems} units in system</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
              <CardDescription>Awaiting approval</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingRequests}</div>
              <p className="text-xs text-muted-foreground mt-1">Review and approve</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Approved Requests</CardTitle>
              <CardDescription>Active requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{approvedRequests}</div>
              <p className="text-xs text-muted-foreground mt-1">In active use</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest inventory changes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground text-center py-8">No recent activity yet</div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
