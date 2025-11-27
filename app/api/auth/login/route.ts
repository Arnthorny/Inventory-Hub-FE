import { NextResponse } from "next/server";
import { authService } from "@/lib/services/auth-service";
import { ApiError } from "@/lib/errors";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:7001/api/v1";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = await authService.login(body);

    const response = NextResponse.json({ success: true });

    response.cookies.set("access_token", data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * (Number(process.env.ACCESS_TOKEN_EXPIRE_MINUTES) || 15),
    });

    response.cookies.set("refresh_token", data.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * (Number(process.env.JWT_REFRESH_EXPIRY_DAYS) || 7),
    });

    return response;
  } catch (error) {
    console.error("Login route error:", error);
    if (error instanceof ApiError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      );
    }
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
