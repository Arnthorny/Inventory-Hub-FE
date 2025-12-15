import { ApiError } from "@/lib/errors";
import { itemsService } from "@/lib/services/items-service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { locations, error } = await itemsService.getLocations();

    if (error) throw error;
    return NextResponse.json({ locations });
  } catch (error) {
    console.error("[GET] Items route error:", error);
    if (error instanceof ApiError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      );
    }
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}