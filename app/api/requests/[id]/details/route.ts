import { createClient } from "@/lib/supabase/server";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: request_id } = await params;
    // Fetch request items with item details
    const { data: requestItems, error: itemsError } = await supabase
      .from("request_items")
      .select(
        `
        id,
        quantity,
        items (
          name,
          category
        )
      `
      )
      .eq("request_id", request_id);

    if (itemsError) {
      console.error("[v0] Error fetching request items:", itemsError);
      return NextResponse.json(
        { error: "Failed to fetch request items" },
        { status: 500 }
      );
    }

    // Transform the data to a more usable format
    const items = (requestItems || []).map((item: any) => ({
      name: item.items?.name || "Unknown Item",
      category: item.items?.category || null,
      quantity: item.quantity,
    }));

    return NextResponse.json({ items });
  } catch (error) {
    console.error("[v0] Error in request details:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
