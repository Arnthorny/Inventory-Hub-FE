import { createClient } from "@/lib/supabase/server";
import { requestsService } from "@/lib/services/requests-service";
import { type NextRequest, NextResponse } from "next/server";

export async function PATCH(
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

    const body = await request.json();
    const { id: request_id } = await params;
    const { request: updatedRequest, error } =
      await requestsService.updateRequest(request_id, body);

    if (error) throw error;

    return NextResponse.json({ request: updatedRequest });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update request" },
      { status: 500 }
    );
  }
}
