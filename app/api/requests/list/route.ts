import { requestsService } from "@/lib/services/requests-service";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { requests, error } = await requestsService.getRequests();

    if (error) {
      console.error("[v0] Requests API error:", error);
      return NextResponse.json(
        { error: "Failed to fetch requests", requests: [] },
        { status: 500 }
      );
    }

    console.log("[v0] Requests API returning:", requests.length);
    return NextResponse.json({ requests });
  } catch (error) {
    console.error("[v0] Requests API exception:", error);
    return NextResponse.json(
      { error: "Failed to fetch requests", requests: [] },
      { status: 500 }
    );
  }
}
