import { requestsService } from "@/lib/services/requests-service";
import { type NextRequest, NextResponse } from "next/server";
import { ApiError } from "@/lib/errors";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const page = searchParams.get("page") || 1;
    const limit = searchParams.get("limit") || 10;
    const statusFilter = searchParams.get("statusFilter") || undefined;
    const roleFilter = searchParams.get("roleFilter") || undefined;
    const guest_id = searchParams.get("guest_id") || undefined;
    const user_id = searchParams.get("user_id") || undefined;

    const requests_res = await requestsService.getRequests(
      +page,
      +limit,
      statusFilter,
      roleFilter,
      guest_id,
      user_id
    );
    return NextResponse.json({ requests_res });
  } catch (error) {
    console.error("[GET] Requests route error:", error);
    if (error instanceof ApiError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      );
    }
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { req, error } = await requestsService.createRequest(body);

    if (error) throw error;
    return NextResponse.json({ req }, { status: 201 });
  } catch (error) {
    console.error("[POST] Items route error:", error);
    if (error instanceof ApiError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      );
    }
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
