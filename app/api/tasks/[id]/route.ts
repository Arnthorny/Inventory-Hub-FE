import { ApiError } from "@/lib/errors";
import { tasksService } from "@/lib/services/task-service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(  request: NextRequest,
    { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { item_data, error } = await tasksService.getTaskInfo(id);

    if (error) throw error;
    return NextResponse.json({ item_data });
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