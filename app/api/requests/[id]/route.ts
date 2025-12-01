import { ApiError } from "@/lib/errors";

import { requestsService } from "@/lib/services/requests-service";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const { req, error } = await requestsService.getReqById(id);

    if (error) throw error;
    return NextResponse.json(req);
  } catch (error) {
    console.error("[GET /id]req route error:", error);
    if (error instanceof ApiError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      );
    }
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  const { id } = await params;
  const { searchParams } = request.nextUrl;
  const status = searchParams.get("status") || "";
  try {
    const { req, error } = await requestsService.updateRequestStatus(
      id,
      status
    );

    if (error) throw error;
    return NextResponse.json(req);
  } catch (error) {
    console.error("[PATCH] Request route error:", error);
    if (error instanceof ApiError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      );
    }
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { items, due_date } = await request.json();
  try {
    const { req, error } = await requestsService.updateRequestItems(
      id,
      items,
      due_date
    );

    if (error) throw error;
    return NextResponse.json(req);
  } catch (error) {
    console.error("[PUT] Request route error:", error);
    if (error instanceof ApiError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      );
    }
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
