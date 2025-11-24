import { createClient } from "@/lib/supabase/server"
import { itemsService } from "@/lib/api/items-service"
import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    const { items, error } = await itemsService.getItems()
    if (error) throw error
    return NextResponse.json({ items })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch items" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin
    const { user: userData } = await itemsService.getItems()
    // Note: In production, verify admin role here

    const body = await request.json()
    const { item, error } = await itemsService.createItem(body)

    if (error) throw error

    return NextResponse.json({ item })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create item" }, { status: 500 })
  }
}
