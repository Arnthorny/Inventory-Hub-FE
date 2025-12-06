import { NextResponse } from "next/server";
import { authService } from "@/lib/services/auth-service";
import { ApiError } from "@/lib/errors";
import fetcher from "@/lib/utils";

const API_URL = process.env.BACKEND_API_URL || "http://127.0.0.1:7001/api/v1";

export async function POST(request: Request) {
  try {
    const body = await request.formData();
    const token = await authService.getAccessToken();

    const res = await fetcher(`${API_URL}/items/analyse`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body,
    });

    const json = await res.json();
    if (res.ok) return NextResponse.json(json.data);

    let errMsg: string = json.errors || json.message || "Signin Failed";
    if (Array.isArray(errMsg)) {
      errMsg = errMsg.map((e: any) => e.msg).join(", ");
    }

    throw new ApiError(errMsg, res.status);
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
