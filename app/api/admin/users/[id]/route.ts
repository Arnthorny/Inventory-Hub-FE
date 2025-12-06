import { ApiError } from "@/lib/errors";
import { usersService } from "@/lib/services/users-service";
// import { useSearchParams } from "next/navigation";
import { type NextRequest, NextResponse } from "next/server";

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


  const { searchParams } = request.nextUrl;

  const is_active = searchParams.get("is_active") || undefined;
  const is_deleted = searchParams.get("is_deleted") || undefined;
  const role = searchParams.get("role");

  const { id } = await params;
  try {
    const { user, error } = await usersService.updateUser(
      id,
      is_deleted,
      is_active,
      role || undefined
    );

    if (error) throw error;
    return NextResponse.json(user);
  } catch (error) {
    console.error("[PATCH] user route error:", error);
    if (error instanceof ApiError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      );
    }
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
