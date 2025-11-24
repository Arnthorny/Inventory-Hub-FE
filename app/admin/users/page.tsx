"use client"

import { useEffect, useState } from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { usersService } from "@/lib/api/users-service"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { UserTable } from "@/components/admin/user-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { User } from "@/lib/types"

export default function AdminUsersPage() {
  const [user, setUser] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const supabase = createClient()
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser()

        if (!authUser) {
          redirect("/auth/login")
        }

        // Fetch current user
        const userResponse = await fetch("/api/users/profile")
        const userData = await userResponse.json()
        setUser(userData.user)

        // Check if admin
        if (userData.user?.role !== "admin") {
          redirect("/dashboard")
        }

        // Fetch all users
        const { users: fetchedUsers } = await usersService.getAllUsers()
        setUsers(fetchedUsers)
      } catch (error) {
        console.error("Error loading users:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        body: JSON.stringify({ role: newRole }),
      })

      // Refresh users
      const { users: updated } = await usersService.getAllUsers()
      setUsers(updated)
    } catch (error) {
      console.error("Error updating user role:", error)
    }
  }

  const handleDelete = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return

    try {
      await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      })

      // Refresh users
      const { users: updated } = await usersService.getAllUsers()
      setUsers(updated)
    } catch (error) {
      console.error("Error deleting user:", error)
    }
  }

  if (isLoading || !user || user.role !== "admin") {
    return (
      <DashboardLayout user={user}>
        <div>Loading...</div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout user={user}>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">User Management</h1>
          <p className="text-muted-foreground mt-2">Manage user roles and permissions</p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <CardDescription>Registered accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Admins</CardTitle>
              <CardDescription>Administrator accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.filter((u) => u.role === "admin").length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Staff</CardTitle>
              <CardDescription>Staff members</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.filter((u) => u.role === "staff").length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Guests</CardTitle>
              <CardDescription>Guest accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.filter((u) => u.role === "guest").length}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
            <CardDescription>Manage user roles and access</CardDescription>
          </CardHeader>
          <CardContent>
            <UserTable users={users} onRoleChange={handleRoleChange} onDelete={handleDelete} />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
