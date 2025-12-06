import { NextResponse } from "next/server";
import { authService } from "@/lib/services/auth-service";
import { ApiError } from "@/lib/errors";
import fetcher from "@/lib/utils";

const API_URL = process.env.BACKEND_API_URL || "http://127.0.0.1:7001";

export async function GET() {
  const token = await authService.getAccessToken();

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const res = await fetcher(`${API_URL}/users/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const json = await res.json();
    if (res.ok) return NextResponse.json(json.data);

    let errMsg: string = json.errors || json.message || "Failed to fetch user";
    if (Array.isArray(errMsg)) {
      errMsg = errMsg.map((e: any) => e.msg).join(", ");
    }

    throw new ApiError(errMsg, res.status);
  } catch (error) {
    if (error instanceof ApiError)
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      );
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
