import { itemsService } from "@/lib/services/items-service";
import { type NextRequest, NextResponse } from "next/server";
import { ApiError } from "@/lib/errors";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const page = searchParams.get("page") || 1;
    const limit = searchParams.get("limit") || 10;

    const search = searchParams.get("search") || undefined;
    const category = searchParams.get("category") || undefined;
    const location = searchParams.get("location") || undefined;

    const { items_res, error } = await itemsService.getItems(
      +page,
      +limit,
      search,
      category,
      location
    );

    if (error) throw error;
    return NextResponse.json({ items_res });
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { item, error } = await itemsService.createItem(body);

    if (error) throw error;
    return NextResponse.json({ item }, { status: 201 });
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
