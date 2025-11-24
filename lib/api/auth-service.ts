import { createClient } from "@/lib/supabase/client"

/**
 * Authentication service provides a clean interface for auth operations.
 * This abstraction allows you to swap backends by replacing this file.
 */
export const authService = {
  async login(email: string, password: string) {
    const supabase = createClient()
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  },

  async signUp(email: string, password: string) {
    const supabase = createClient()
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo:
          process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
          `${typeof window !== "undefined" ? window.location.origin : ""}`,
      },
    })
    return { data, error }
  },

  async logout() {
    const supabase = createClient()
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  async getSession() {
    const supabase = createClient()
    const { data, error } = await supabase.auth.getSession()
    return { data, error }
  },

  async getUser() {
    const supabase = createClient()
    const { data, error } = await supabase.auth.getUser()
    return { data, error }
  },
}
