import { NextResponse } from "next/server";
import { authService } from "@/lib/services/auth-service";
import { ApiError } from "@/lib/errors";



export async function POST(request: Request) {
  try {
    const data = await authService.logout();

    const response = NextResponse.json({ success: true });

    response.cookies.delete("access_token");
    response.cookies.delete("refresh_token");

    return response;
  } catch (error) {
    console.error("Logout route error:", error);
    if (error instanceof ApiError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      );
    }
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
