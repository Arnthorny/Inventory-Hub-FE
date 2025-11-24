"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Item } from "@/lib/types"
import { X } from "lucide-react"

interface SelectedItem {
  item: Item
  quantity: number
  requiresApproval: boolean
}

interface RequestFormProps {
  items: Item[]
  onSubmit: (data: any) => Promise<void>
  isLoading?: boolean
}

export function RequestForm({ items, onSubmit, isLoading = false }: RequestFormProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([])
  const [notes, setNotes] = useState("")
  const [dueDate, setDueDate] = useState(() => {
    const date = new Date()
    date.setDate(date.getDate() + 7)
    return date.toISOString().split("T")[0]
  })
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const addItem = (item: Item) => {
    const existing = selectedItems.find((x) => x.item.id === item.id)
    if (!existing) {
      setSelectedItems([...selectedItems, { item, quantity: 1, requiresApproval: false }])
    }
    setSearchQuery("")
  }

  const removeItem = (itemId: string) => {
    setSelectedItems(selectedItems.filter((x) => x.item.id !== itemId))
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity > 0) {
      setSelectedItems(selectedItems.map((x) => (x.item.id === itemId ? { ...x, quantity } : x)))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (selectedItems.length === 0) {
      setError("Please select at least one item")
      return
    }

    try {
      setSubmitting(true)
      await onSubmit({
        items: selectedItems.map((x) => ({
          item_id: x.item.id,
          quantity: x.quantity,
        })),
        notes,
        due_date: dueDate,
      })
      setSelectedItems([])
      setNotes("")
      const date = new Date()
      date.setDate(date.getDate() + 7)
      setDueDate(date.toISOString().split("T")[0])
    } catch (err) {
      console.error("[v0] Request submission error:", err)
      setError(err instanceof Error ? err.message : "Failed to create request")
    } finally {
      setSubmitting(false)
    }
  }

  const hasRequiresApprovalItems = selectedItems.some((item) => item.requiresApproval)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Request</CardTitle>
        <CardDescription>Search and add items to your request</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>}

          {/* Search for items */}
          <div className="space-y-2">
            <Label htmlFor="search" className="text-sm font-medium">
              Search Items
            </Label>
            <Input
              id="search"
              type="text"
              placeholder="Search by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10"
            />
            {/* Filtered items dropdown */}
            {searchQuery && filteredItems.length > 0 && (
              <div className="border border-border rounded-lg max-h-48 overflow-y-auto">
                {filteredItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => addItem(item)}
                    className="w-full text-left px-4 py-3 hover:bg-muted border-b border-border last:border-b-0 flex justify-between items-start"
                  >
                    <div>
                      <p className="font-medium text-sm">{item.name}</p>
                      {item.description && <p className="text-xs text-muted-foreground">{item.description}</p>}
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                      {item.available} available
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Selected items */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Selected Items ({selectedItems.length})</Label>
            {selectedItems.length === 0 ? (
              <p className="text-sm text-muted-foreground">No items selected yet</p>
            ) : (
              <div className="space-y-2">
                {selectedItems.map((selected) => (
                  <div key={selected.item.id} className="flex items-center gap-3 p-3 border border-border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">{selected.item.name}</p>
                        {selected.requiresApproval && (
                          <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
                            Needs Approval
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{selected.item.available} available</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="1"
                        max={selected.item.available}
                        value={selected.quantity}
                        onChange={(e) => updateQuantity(selected.item.id, Number.parseInt(e.target.value) || 1)}
                        className="w-16 h-9 text-center"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(selected.item.id)}
                        className="h-9 w-9 p-0"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {hasRequiresApprovalItems && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
                Some items require admin approval. Your request will be submitted for review.
              </div>
            )}
          </div>

          {/* Due date */}
          <div className="space-y-2">
            <Label htmlFor="due-date" className="text-sm font-medium">
              Due Date
            </Label>
            <Input
              id="due-date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="h-10"
            />
            <p className="text-xs text-muted-foreground">Defaults to 7 days from now</p>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium">
              Notes (Optional)
            </Label>
            <textarea
              id="notes"
              placeholder="Add any additional notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg min-h-24 resize-none"
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading || submitting}>
            {submitting ? "Creating request..." : "Create Request"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
