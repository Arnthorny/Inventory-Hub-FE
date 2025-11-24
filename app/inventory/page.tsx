"use client"

import { useEffect, useState } from "react"
import { redirect, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { ItemTable } from "@/components/inventory/item-table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Item, User } from "@/lib/types"

const ITEMS_PER_PAGE = 10

export default function InventoryPage() {
  const [user, setUser] = useState<User | null>(null)
  const [items, setItems] = useState<Item[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const router = useRouter()

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

        // Fetch user profile
        const response = await fetch("/api/users/profile")
        const userData = await response.json()
        setUser(userData.user)

        // Fetch items
        console.log("[v0] Fetching items...")
        const itemsResponse = await fetch("/api/items/list")
        const itemsData = await itemsResponse.json()
        console.log("[v0] Items fetch complete. Count:", itemsData.items?.length || 0, "Error:", itemsData.error)
        setItems(itemsData.items || [])
        setCurrentPage(1)
      } catch (error) {
        console.error("[v0] Error loading inventory:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const handleEdit = (item: Item) => {
    router.push(`/inventory/${item.id}`)
  }

  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedItems = items.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  if (isLoading || !user) {
    return (
      <DashboardLayout user={null}>
        <div>Loading...</div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout user={user}>
      <div className="space-y-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Inventory</h1>
            <p className="text-muted-foreground mt-2">Manage all items in your design studio</p>
          </div>
          {user.role === "admin" && (
            <Button onClick={() => setShowForm(!showForm)}>{showForm ? "View Inventory" : "Add Item"}</Button>
          )}
        </div>

        {showForm && user.role === "admin" && (
          <Card>
            <CardHeader>
              <CardTitle>Create New Item</CardTitle>
              <CardDescription>Add a new item to your inventory</CardDescription>
            </CardHeader>
            <CardContent>
              <form
                className="space-y-6"
                onSubmit={async (e) => {
                  e.preventDefault()
                  const formData = new FormData(e.currentTarget)
                  try {
                    await fetch("/api/items", {
                      method: "POST",
                      body: JSON.stringify(Object.fromEntries(formData)),
                    })
                    setShowForm(false)
                    const itemsResponse = await fetch("/api/items/list")
                    const itemsData = await itemsResponse.json()
                    setItems(itemsData.items || [])
                    setCurrentPage(1)
                  } catch (error) {
                    console.error("Error creating item:", error)
                  }
                }}
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Name</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Item name"
                      required
                      className="w-full px-3 py-2 border border-border rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Category</label>
                    <input
                      type="text"
                      name="category"
                      placeholder="Category"
                      className="w-full px-3 py-2 border border-border rounded-lg"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <input
                    type="text"
                    name="description"
                    placeholder="Description"
                    className="w-full px-3 py-2 border border-border rounded-lg"
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <label className="text-xs text-muted-foreground">Available</label>
                    <input
                      type="number"
                      name="available"
                      defaultValue="0"
                      min="0"
                      className="w-full px-3 py-2 border border-border rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-muted-foreground">In Use</label>
                    <input
                      type="number"
                      name="in_use"
                      defaultValue="0"
                      min="0"
                      className="w-full px-3 py-2 border border-border rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-muted-foreground">Damaged</label>
                    <input
                      type="number"
                      name="damaged"
                      defaultValue="0"
                      min="0"
                      className="w-full px-3 py-2 border border-border rounded-lg"
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full">
                  Create Item
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        <ItemTable
          items={paginatedItems}
          isAdmin={user.role === "admin"}
          onEdit={user.role === "admin" ? handleEdit : undefined}
        />

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
