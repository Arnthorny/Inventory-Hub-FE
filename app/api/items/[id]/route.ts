import { ApiError } from "@/lib/errors";
import { itemsService } from "@/lib/services/items-service";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const { item, error } = await itemsService.getItemById(id);

    if (error) throw error;
    return NextResponse.json(item);
  } catch (error) {
    console.error("[GET]Item route error:", error);
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
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  try {
    const { item, error } = await itemsService.updateItem(id, body);

    if (error) throw error;
    return NextResponse.json(item );
  } catch (error) {
    console.error("[PATCH] Item route error:", error);
    if (error instanceof ApiError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      );
    }
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
