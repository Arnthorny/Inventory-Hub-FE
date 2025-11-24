"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Item } from "@/lib/types"

interface ItemFormProps {
  item?: Item
  onSubmit: (data: any) => Promise<void>
  isLoading?: boolean
}

export function ItemForm({ item, onSubmit, isLoading = false }: ItemFormProps) {
  const [formData, setFormData] = useState({
    name: item?.name || "",
    description: item?.description || "",
    category: item?.category || "",
    available: item?.available || 0,
    damaged: item?.damaged || 0,
    in_use: item?.in_use || 0,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name.includes("_") ? Number.parseInt(value) || 0 : value,
    }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{item ? "Edit Item" : "Create Item"}</CardTitle>
        <CardDescription>{item ? "Update item details" : "Add a new item to inventory"}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="Item name"
                required
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-medium">
                Category
              </Label>
              <Input
                id="category"
                name="category"
                placeholder="e.g. Equipment, Furniture"
                value={formData.category}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description
            </Label>
            <Input
              id="description"
              name="description"
              placeholder="Item description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">Stock Levels</Label>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="available" className="text-xs text-muted-foreground">
                  Available
                </Label>
                <Input
                  id="available"
                  name="available"
                  type="number"
                  min="0"
                  value={formData.available}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="in_use" className="text-xs text-muted-foreground">
                  In Use
                </Label>
                <Input
                  id="in_use"
                  name="in_use"
                  type="number"
                  min="0"
                  value={formData.in_use}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="damaged" className="text-xs text-muted-foreground">
                  Damaged
                </Label>
                <Input
                  id="damaged"
                  name="damaged"
                  type="number"
                  min="0"
                  value={formData.damaged}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Saving..." : item ? "Update Item" : "Create Item"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
