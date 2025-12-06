import { usersService } from "@/lib/services/users-service";
import { type NextRequest, NextResponse } from "next/server";
import { ApiError } from "@/lib/errors";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const page = searchParams.get("page") || 1;
    const limit = searchParams.get("limit") || 10;

    const search = searchParams.get("search") || undefined;
    const status = searchParams.get("status") || undefined;

    const { users_res, error } = await usersService.getUsers(
      +page,
      +limit,
      search,
      status
    );

    if (error) throw error;
    return NextResponse.json({ users_res });
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