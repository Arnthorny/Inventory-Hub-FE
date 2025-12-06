import { ApiError } from "@/lib/errors";
import type {
  Request,
  CreateRequestBody,
  PaginatedListBase,
  ItemReq,
} from "@/lib/types";
import { authService } from "@/lib/services/auth-service";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:7001/api/v1";

export const requestsService = {
  async getRequests(
    page: number = 1,
    limit: number = 10,
    statusFilter?: string,
    roleFilter?: string,
    guest_id?: string,
    user_id?: string
  ): Promise<PaginatedListBase<Request> | null> {
    const token = await authService.getAccessToken();

    const url = new URL(`${API_URL}/requests`);
    const sParams: Record<string, string> = {
      page: String(page),
      fields: "all",
      limit: String(limit),
    };

    if (statusFilter) sParams["status"] = statusFilter;
    if (roleFilter) sParams["role"] = roleFilter;
    if (guest_id) sParams["guest_id"] = guest_id;
    if (user_id) sParams["user_id"] = user_id;
    url.search = new URLSearchParams(sParams).toString();
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const json = await res.json();
    const data = json.data;

    if (res.ok) {
      console.log("Fetched requests count: ", json?.data?.results.length || []);
      return data || [];
    }

    let errMsg: string =
      json.errors || json.message || "Requests Retrieval Failed";
    if (Array.isArray(errMsg)) {
      errMsg = errMsg.map((e: any) => e.msg).join(", ");
    }

    throw new ApiError(errMsg, res.status);
  },

  async getReqById(id: string): Promise<{ req: Request | null; error: any }> {
    const token = await authService.getAccessToken();
    try {
      const res = await fetch(`${API_URL}/requests/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await res.json();

      if (res.ok) {
        console.log("Fetched request:", json.message || null);
        return { req: json.data, error: null };
      }

      let errMsg: string =
        json.errors || json.message || "Request Retrieval Failed";
      if (Array.isArray(errMsg)) {
        errMsg = errMsg.map((e: any) => e.msg).join(", ");
      }
      throw new ApiError(errMsg, res.status);
    } catch (error) {
      console.error("Request service exception:", error);
      return { req: null, error };
    }
  },

  async createRequest(
    body: CreateRequestBody,
    type: string
  ): Promise<{ req: Request | null; error: any }> {
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (type != "guest") {
        const token = await authService.getAccessToken();
        headers["Authorization"] = `Bearer ${token}`;
      }
      const res = await fetch(`${API_URL}/requests`, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });

      const json = await res.json();

      if (res.ok) {
        console.log("Created request:", json.data || null);
        return { req: json.data, error: null };
      }

      let errMsg: string =
        json.errors || json.message || "Requests Creation Failed";
      if (Array.isArray(errMsg)) {
        errMsg = errMsg.map((e: any) => e.msg).join(", ");
      }
      throw new ApiError(errMsg, res.status);
    } catch (error) {
      console.error("Requests service exception:", error);
      return { req: null, error };
    }
  },

  async updateRequestStatus(
    id: string,
    status: string,
    notes?: string
  ): Promise<{ req: Request | null; error: any }> {
    try {
      const token = await authService.getAccessToken();
      const res = await fetch(`${API_URL}/requests/${id}/?status=${status}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await res.json();

      if (res.ok) {
        console.log("Created request:", json.data || null);
        return { req: json.data, error: null };
      }

      let errMsg: string =
        json.errors || json.message || "Requests Status Update Failed";
      if (Array.isArray(errMsg)) {
        errMsg = errMsg.map((e: any) => e.msg).join(", ");
      }
      throw new ApiError(errMsg, res.status);
    } catch (error) {
      console.error("Requests service exception:", error);
      return { req: null, error };
    }
  },

  async updateRequestItems(
    id: string,
    items: ItemReq[],
    due_date?: Date
  ): Promise<{ req: Request | null; error: any }> {
    try {
      const token = await authService.getAccessToken();
      const res = await fetch(`${API_URL}/requests/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ items, due_date }),
      });

      const json = await res.json();

      if (res.ok) {
        console.log("Updated guest request:", json.data || null);
        return { req: json.data, error: null };
      }

      let errMsg: string =
        json.errors || json.message || "Requests Items Update Failed";
      if (Array.isArray(errMsg)) {
        errMsg = errMsg.map((e: any) => e.msg).join(", ");
      }
      throw new ApiError(errMsg, res.status);
    } catch (error) {
      console.error("Requests update service exception:", error);
      return { req: null, error };
    }
  },
};
