import { updateSession } from "@/lib/supabase/middleware";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const start = Date.now();
  console.log(`[Proxy] 🟢 Request started: ${request.nextUrl.pathname}`);

  const response = await updateSession(request);

  const duration = Date.now() - start;
  if (duration > 500) {
    console.log(
      `[Proxy] 🔴 SLOW: Took ${duration}ms to process ${request.nextUrl.pathname}`
    );
  } else {
    console.log(`[Proxy] 🟢 Fast: Took ${duration}ms`);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
