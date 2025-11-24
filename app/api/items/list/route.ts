import { itemsService } from "@/lib/api/items-service"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const { items, error } = await itemsService.getItems()

    if (error) {
      console.error("[v0] Items API error:", error)
      return NextResponse.json({ error: "Failed to fetch items", items: [] }, { status: 500 })
    }

    console.log("[v0] Items API returning:", items.length)
    return NextResponse.json({ items })
  } catch (error) {
    console.error("[v0] Items API exception:", error)
    return NextResponse.json({ error: "Failed to fetch items", items: [] }, { status: 500 })
  }
}
