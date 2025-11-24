import { createClient } from "@/lib/supabase/server"
import type { Request, RequestItem, CreateRequestRequest, UpdateRequestRequest } from "@/lib/types"

/**
 * Requests service handles the request workflow including approvals and returns.
 * Abstracted from database implementation for flexible backend switching.
 */
export const requestsService = {
  async getRequests(): Promise<{ requests: Request[]; error: any }> {
    try {
      const supabase = await createClient()
      const { data, error } = await supabase.from("requests").select("*").order("created_at", { ascending: false })

      if (error) {
        console.error("[v0] Get requests error:", error)
        return { requests: [], error }
      }

      console.log("[v0] Successfully fetched requests, count:", data?.length || 0)
      return { requests: data || [], error: null }
    } catch (error) {
      console.error("[v0] Get requests exception:", error)
      return { requests: [], error }
    }
  },

  async getRequestsByUser(userId: string): Promise<{ requests: Request[]; error: any }> {
    try {
      const supabase = await createClient()
      const { data, error } = await supabase
        .from("requests")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
      return { requests: data || [], error }
    } catch (error) {
      return { requests: [], error }
    }
  },

  async getRequestById(id: string): Promise<{ request: Request | null; error: any }> {
    try {
      const supabase = await createClient()
      const { data, error } = await supabase.from("requests").select("*").eq("id", id).single()
      return { request: data, error }
    } catch (error) {
      return { request: null, error }
    }
  },

  async createRequest(userId: string, request: CreateRequestRequest): Promise<{ request: Request | null; error: any }> {
    try {
      const supabase = await createClient()
      console.log("[v0] Creating request for user:", userId)

      const { data: userData, error: userError } = await supabase.from("users").select("role").eq("id", userId).single()

      if (userError) throw userError

      const userRole = userData?.role || "guest"

      const { data: requestItemsData, error: itemsError } = await supabase
        .from("request_items")
        .select("item_id")
        .eq("request_id", request.id)

      // Check if user can auto-approve based on item levels
      let shouldAutoApprove = true
      if (requestItemsData && requestItemsData.length > 0) {
        const { data: itemsData } = await supabase
          .from("items")
          .select("level")
          .in(
            "id",
            requestItemsData.map((ri: any) => ri.item_id),
          )

        // Role hierarchy: admin > staff > intern > guest
        const roleHierarchy: Record<string, number> = { admin: 4, staff: 3, intern: 2, guest: 1 }
        const userRoleLevel = roleHierarchy[userRole] || 1

        // Check if user's role level is sufficient for all items
        for (const item of itemsData || []) {
          const itemRoleLevel = roleHierarchy[item.level] || 4
          if (userRoleLevel < itemRoleLevel) {
            shouldAutoApprove = false
            break
          }
        }
      }

      const { data, error } = await supabase
        .from("requests")
        .insert({
          user_id: userId,
          status: shouldAutoApprove ? "approved" : "pending", // auto-approve if user level is sufficient
          notes: request.notes || null,
          due_date: request.due_date || null,
        })
        .select()
        .single()

      if (error) {
        console.error("[v0] Create request error:", error)
      } else {
        console.log("[v0] Request created successfully:", data?.id, "Auto-approved:", shouldAutoApprove)
      }
      return { request: data, error }
    } catch (error) {
      console.error("[v0] Create request exception:", error)
      return { request: null, error }
    }
  },

  async addRequestItem(
    requestId: string,
    itemId: string,
    quantity: number,
  ): Promise<{ item: RequestItem | null; error: any }> {
    try {
      const supabase = await createClient()
      console.log("[v0] Adding request item - request:", requestId, "item:", itemId, "qty:", quantity)
      const { data, error } = await supabase
        .from("request_items")
        .insert({
          request_id: requestId,
          item_id: itemId,
          quantity,
        })
        .select()
        .single()

      if (error) {
        console.error("[v0] Add request item error:", error)
      } else {
        console.log("[v0] Request item added successfully")
      }
      return { item: data, error }
    } catch (error) {
      console.error("[v0] Add request item exception:", error)
      return { item: null, error }
    }
  },

  async getRequestItems(requestId: string): Promise<{ items: RequestItem[]; error: any }> {
    try {
      const supabase = await createClient()
      const { data, error } = await supabase.from("request_items").select("*").eq("request_id", requestId)
      return { items: data || [], error }
    } catch (error) {
      return { items: [], error }
    }
  },

  async updateRequest(id: string, request: UpdateRequestRequest): Promise<{ request: Request | null; error: any }> {
    try {
      const supabase = await createClient()
      const { data, error } = await supabase.from("requests").update(request).eq("id", id).select().single()
      return { request: data, error }
    } catch (error) {
      return { request: null, error }
    }
  },

  async deleteRequest(id: string): Promise<{ error: any }> {
    try {
      const supabase = await createClient()
      const { error } = await supabase.from("requests").delete().eq("id", id)
      return { error }
    } catch (error) {
      return { error }
    }
  },
}
