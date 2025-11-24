import { createClient } from "@/lib/supabase/server"
import { usersService } from "@/lib/api/users-service"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser()

    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { user, error } = await usersService.getUser(authUser.id)

    if (error || !user) {
      // Create user profile if it doesn't exist
      const { user: newUser, error: createError } = await usersService.createUser(
        authUser.id,
        authUser.email || "",
        "guest",
      )
      return NextResponse.json({ user: newUser || { ...authUser, role: "guest" } })
    }

    return NextResponse.json({ user })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch user profile" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, email } = await request.json()

    if (!userId || !email) {
      return NextResponse.json({ error: "Missing userId or email" }, { status: 400 })
    }

    // Create user profile with guest role
    const { user, error } = await usersService.createUser(userId, email, "guest")

    if (error) {
      console.error("Error creating user profile:", error)
      // If user already exists, just return success
      return NextResponse.json({ user: { id: userId, email, role: "guest" } })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error("Failed to create user profile:", error)
    return NextResponse.json({ error: "Failed to create user profile" }, { status: 500 })
  }
}
