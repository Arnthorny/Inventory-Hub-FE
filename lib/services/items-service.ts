import { createClient } from "@/lib/supabase/server";
import { authService } from "@/lib/services/auth-service";
import { ApiError } from "@/lib/errors";

import type { Item, CreateItemRequest, UpdateItemRequest } from "@/lib/types";
const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:7001/api/v1";

export const itemsService = {
  async getItems(): Promise<{ items: Item[]; error: any }> {
    const token = await authService.getAccessToken();
    try {
      const res = await fetch(`${API_URL}/items`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await res.json();

      if (res.ok) {
        console.log("Fetched items count: ", json.data.results.length || []);
        return { items: json.data.results || [], error: null };
      }

      let errMsg: string =
        json.errors || json.message || "Items Retrieval Failed";
      if (Array.isArray(errMsg)) {
        errMsg = errMsg.map((e: any) => e.msg).join(", ");
      }

      throw new ApiError(errMsg, res.status);
    } catch (error) {
      console.error("Items service exception:", error);
      return { items: [], error };
    }
  },

  async getItemById(id: string): Promise<{ item: Item | null; error: any }> {
    const token = await authService.getAccessToken();
    try {
      const res = await fetch(`${API_URL}/items/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        console.log("Fetched items, count:", data?.length || 0);
        return { item: data.data, error: null };
      }

      let errMsg: string =
        data.errors || data.message || "Items Retrieval Failed";
      if (Array.isArray(errMsg)) {
        errMsg = errMsg.map((e: any) => e.msg).join(", ");
      }
      throw new ApiError(errMsg, res.status);
    } catch (error) {
      return { item: null, error };
    }
  },

  async createItem(
    request: CreateItemRequest
  ): Promise<{ item: Item | null; error: any }> {
    try {
      const supabase = await createClient();
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
        .single();

      if (error) {
        console.error("[v0] Create item error:", error);
      }
      return { item: data, error };
    } catch (error) {
      console.error("[v0] Create item exception:", error);
      return { item: null, error };
    }
  },

  async updateItem(
    id: string,
    request: UpdateItemRequest
  ): Promise<{ item: Item | null; error: any }> {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("items")
        .update(request)
        .eq("id", id)
        .select()
        .single();
      return { item: data, error };
    } catch (error) {
      return { item: null, error };
    }
  },

  async deleteItem(id: string): Promise<{ error: any }> {
    try {
      const supabase = await createClient();
      const { error } = await supabase.from("items").delete().eq("id", id);
      return { error };
    } catch (error) {
      return { error };
    }
  },
};
