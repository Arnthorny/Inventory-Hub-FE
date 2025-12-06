import { type NextRequest, NextResponse } from "next/server";
import { authService } from "../services/auth-service";

export async function updateSession(request: NextRequest) {
  const accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;
  const path = request.nextUrl.pathname;

  const isAdminPath = path.startsWith("/admin") || path.startsWith("/api/admin");

  if (accessToken) {
    const user = await authService.getUser();
    if (isAdminPath && user.role !== "admin")
      return NextResponse.redirect(new URL("/forbidden", request.url));
    return NextResponse.next();
  }

  if (!accessToken && refreshToken) {
    console.log("[Middleware] Access token missing. Attempting refresh...");

    try {
      const data = await authService.refreshTokens(refreshToken);
      const response = NextResponse.next();

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
        maxAge:
          60 * 60 * 24 * (Number(process.env.JWT_REFRESH_EXPIRY_DAYS) || 7),
      });

      response.headers.set("x-access-token", data.access_token);

      return response;
    } catch (error) {
      console.error("[Middleware] Refresh failed. Redirecting to login.");

      const response = NextResponse.redirect(
        new URL("/auth/login", request.url)
      );
      response.cookies.delete("access_token");
      response.cookies.delete("refresh_token");
      return response;
    }
  }

  const isPublicPath =
    path === "/" ||
    path.startsWith("/auth") ||
    path.startsWith("/api/auth") ||
    path.startsWith("/guests") ||
    path.startsWith("/api/guests");

  if (!refreshToken && !isPublicPath) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}
