import type { CreateRequestBody, Guest } from "@/lib/types";
import { ApiError } from "@/lib/errors";
import fetcher from "../utils";

const API_URL = process.env.BACKEND_API_URL || "http://127.0.0.1:7001/api/v1";

export const guestService = {
  async getGuestById(id: string): Promise<{ guest: Guest | null; error: any }> {
    try {
      const res = await fetcher(`${API_URL}/guests/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const json = await res.json();

      if (res.ok) {
        console.log("Fetched guest:", json.message || null);
        return { guest: json.data, error: null };
      }

      let errMsg: string =
        json.errors || json.message || "Guest Retrieval Failed";
      if (Array.isArray(errMsg)) {
        errMsg = errMsg.map((e: any) => e.msg).join(", ");
      }
      throw new ApiError(errMsg, res.status);
    } catch (error) {
      console.error("Guest service exception:", error);
      return { guest: null, error };
    }
  },

  async submitGuestRequest(
    due_date: Date,
    email: string,
    phone: string,
    first_name: string,
    last_name: string,
    reason: string
  ) {
    let body: CreateRequestBody;

    body = {
      type: "guest",
      due_date,
      reason: reason,
      first_name,
      last_name,
      phone,
      email,
    };
    const res = await fetcher("/api/guests/requests", {
      method: "POST",
      body: JSON.stringify(body),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error);
  },
};
