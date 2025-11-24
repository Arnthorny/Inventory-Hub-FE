import { createClient } from "@/lib/supabase/server"
import type { User } from "@/lib/types"

/**
 * Users service handles user data operations.
 * Abstracted for easy backend migration.
 */
export const usersService = {
  async getUser(userId: string): Promise<{ user: User | null; error: any }> {
    try {
      const supabase = await createClient()
      const { data, error } = await supabase.from("users").select("*").eq("id", userId)
      return { user: data && data.length > 0 ? data[0] : null, error }
    } catch (error) {
      return { user: null, error }
    }
  },

  async getAllUsers(): Promise<{ users: User[]; error: any }> {
    try {
      const supabase = await createClient()
      const { data, error } = await supabase.from("users").select("*").order("created_at", { ascending: false })
      return { users: data || [], error }
    } catch (error) {
      return { users: [], error }
    }
  },

  async createUser(id: string, email: string, role = "guest"): Promise<{ user: User | null; error: any }> {
    try {
      const supabase = await createClient()
      const { data, error } = await supabase
        .from("users")
        .insert({
          id,
          email,
          role,
        })
        .select()
        .single()
      return { user: data, error }
    } catch (error) {
      return { user: null, error }
    }
  },

  async updateUser(id: string, role: string): Promise<{ user: User | null; error: any }> {
    try {
      const supabase = await createClient()
      const { data, error } = await supabase.from("users").update({ role }).eq("id", id).select().single()
      return { user: data, error }
    } catch (error) {
      return { user: null, error }
    }
  },

  async deleteUser(id: string): Promise<{ error: any }> {
    try {
      const supabase = await createClient()
      const { error } = await supabase.from("users").delete().eq("id", id)
      return { error }
    } catch (error) {
      return { error }
    }
  },
}
