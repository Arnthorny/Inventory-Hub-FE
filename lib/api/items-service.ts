import { createClient } from "@/lib/supabase/server"
import type { Item, CreateItemRequest, UpdateItemRequest } from "@/lib/types"

/**
 * Items service provides CRUD operations for inventory items.
 * Abstracted from the database layer for easy backend switching.
 */
export const itemsService = {
  async getItems(): Promise<{ items: Item[]; error: any }> {
    try {
      const supabase = await createClient()
      const { data, error } = await supabase.from("items").select("*").order("created_at", { ascending: false })

      if (error) {
        console.error("[v0] Items query error:", error)
        return { items: [], error }
      }

      console.log("[v0] Successfully fetched items, count:", data?.length || 0)
      return { items: data || [], error: null }
    } catch (error) {
      console.error("[v0] Items service exception:", error)
      return { items: [], error }
    }
  },

  async getItemById(id: string): Promise<{ item: Item | null; error: any }> {
    try {
      const supabase = await createClient()
      const { data, error } = await supabase.from("items").select("*").eq("id", id).single()
      return { item: data, error }
    } catch (error) {
      return { item: null, error }
    }
  },

  async createItem(request: CreateItemRequest): Promise<{ item: Item | null; error: any }> {
    try {
      const supabase = await createClient()
      const { data, error } = await supabase
        .from("items")
        .insert({
          name: request.name,
          description: request.description || null,
          category: request.category || null,
          available: request.available || 0,
          damaged: request.damaged || 0,
          in_use: request.in_use || 0,
        })
        .select()
        .single()

      if (error) {
        console.error("[v0] Create item error:", error)
      }
      return { item: data, error }
    } catch (error) {
      console.error("[v0] Create item exception:", error)
      return { item: null, error }
    }
  },

  async updateItem(id: string, request: UpdateItemRequest): Promise<{ item: Item | null; error: any }> {
    try {
      const supabase = await createClient()
      const { data, error } = await supabase.from("items").update(request).eq("id", id).select().single()
      return { item: data, error }
    } catch (error) {
      return { item: null, error }
    }
  },

  async deleteItem(id: string): Promise<{ error: any }> {
    try {
      const supabase = await createClient()
      const { error } = await supabase.from("items").delete().eq("id", id)
      return { error }
    } catch (error) {
      return { error }
    }
  },
}
