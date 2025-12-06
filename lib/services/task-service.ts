import { ApiError } from "@/lib/errors";
import type { InventoryItemAnalysis, TaskData } from "@/lib/types";
import { URL } from "node:url";
import { authService } from "./auth-service";
import fetcher from "../utils";
const API_URL = process.env.BACKEND_API_URL || "http://127.0.0.1:7001/api/v1";

export const tasksService = {
  async getTaskInfo(
    task_id: string
  ): Promise<{
    item_data: TaskData<InventoryItemAnalysis> | null;
    error: any;
  }> {
    const token = await authService.getAccessToken();
    const url = new URL(`${API_URL}/tasks/${task_id}/status`);

    try {
      const res = await fetcher(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await res.json();

      if (res.ok) {
        console.log("Fetched task info: ", json?.data || {});
        return { item_data: json.data || [], error: null };
      }

      let errMsg: string =
        json.errors || json.message || "Task Info Retrieval Failed";
      if (Array.isArray(errMsg)) {
        errMsg = errMsg.map((e: any) => e.msg).join(", ");
      }

      throw new ApiError(errMsg, res.status);
    } catch (error) {
      console.error("Items service exception:", error);
      return { item_data: null, error };
    }
  },
};
