import { requestsService } from "@/lib/services/requests-service";
import { type NextRequest, NextResponse } from "next/server";
import { ApiError } from "@/lib/errors";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {type} = body
    const { req, error } = await requestsService.createRequest(body, type);

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
