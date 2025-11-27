import { createClient } from "@/lib/supabase/server";
import { requestsService } from "@/lib/services/requests-service";
import { type NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("[v0] GET /api/requests called");
    const { requests, error } = await requestsService.getRequests();
    if (error) throw error;
    return NextResponse.json({ requests });
  } catch (error) {
    console.error("[v0] GET requests error:", error);
    return NextResponse.json(
      { error: "Failed to fetch requests" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] POST /api/requests called");
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.log("[v0] No authenticated user");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    console.log("[v0] Request body:", body);

    // Get user's role for level-based approval
    const { data: userData } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    const userRole = userData?.role || "guest";

    const roleHierarchy: Record<string, number> = {
      admin: 4,
      staff: 3,
      intern: 2,
      guest: 1,
    };
    const userRoleLevel = roleHierarchy[userRole] || 1;

    let shouldAutoApprove = true;
    for (const item of body.items || []) {
      const { data: itemData } = await supabase
        .from("items")
        .select("level")
        .eq("id", item.item_id)
        .single();

      const itemRoleLevel = roleHierarchy[itemData?.level || "admin"] || 4;
      if (userRoleLevel < itemRoleLevel) {
        shouldAutoApprove = false;
        break;
      }
    }

    // Create request with appropriate status
    const { data: createdRequest, error: requestError } = await supabase
      .from("requests")
      .insert({
        user_id: user.id,
        status: shouldAutoApprove ? "approved" : "pending", // auto-approve if user level is sufficient
        notes: body.notes || null,
        due_date: body.due_date || null,
      })
      .select()
      .single();

    if (requestError) {
      console.error("[v0] Failed to create request:", requestError);
      throw requestError;
    }

    if (!createdRequest) {
      throw new Error("No request returned from service");
    }

    // Add request items
    console.log("[v0] Adding", body.items?.length || 0, "items to request");
    for (const item of body.items || []) {
      const { error: itemError } = await supabase.from("request_items").insert({
        request_id: createdRequest.id,
        item_id: item.item_id,
        quantity: item.quantity,
      });

      if (itemError) {
        console.error("[v0] Failed to add request item:", itemError);
        throw itemError;
      }
    }

    console.log(
      "[v0] Request created successfully:",
      createdRequest.id,
      "Auto-approved:",
      shouldAutoApprove
    );
    return NextResponse.json({ request: createdRequest });
  } catch (error) {
    console.error("[v0] POST requests error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to create request",
      },
      { status: 500 }
    );
  }
}
