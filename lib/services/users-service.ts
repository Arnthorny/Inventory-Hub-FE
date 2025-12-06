import type { PaginatedListBase, User } from "@/lib/types";
import { ApiError } from "@/lib/errors";
import { authService } from "./auth-service";
import fetcher from "../utils";

const API_URL = process.env.BACKEND_API_URL || "http://127.0.0.1:7001/api/v1";

export const usersService = {
  async getUsers(
    page: number = 1,
    limit: number = 10,
    search?: string,
    status?: string
  ): Promise<{ users_res: PaginatedListBase<User> | null; error: any }> {
    const token = await authService.getAccessToken();

    const url = new URL(`${API_URL}/users`);
    const sParams: Record<string, string> = {
      page: String(page),
      fields: "all",
      limit: String(limit),
    };

    if (search) sParams["search"] = search;
    if (status) sParams["status"] = status;
    url.search = new URLSearchParams(sParams).toString();

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
        console.log("Fetched users count: ", json?.data?.results.length || []);
        return { users_res: json.data || [], error: null };
      }

      let errMsg: string =
        json.errors || json.message || "Users Retrieval Failed";
      if (Array.isArray(errMsg)) {
        errMsg = errMsg.map((e: any) => e.msg).join(", ");
      }

      throw new ApiError(errMsg, res.status);
    } catch (error) {
      console.error("Users service exception:", error);
      return { users_res: null, error };
    }
  },

  async updateUser(
    id: string,
    is_deleted?: string,
    is_active?: string,
    role?: string // "admin" | "staff" | "guest"
  ): Promise<{ user: User | null; error: any }> {
    try {
      const token = await authService.getAccessToken();
      const url = new URL(`${API_URL}/users/${id}/status`);

      const params = new URLSearchParams();
      if (is_deleted) params.append("is_deleted", is_deleted);
      if (is_active) params.append("is_active", is_active);
      if (role) params.append("role", role);

      url.search = params.toString();

      const res = await fetcher(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await res.json();

      if (res.ok) {
        console.log("Updated user:", json.message || null);
        return { user: json.data, error: null };
      }

      let errMsg: string = json.errors || json.message || "user update Failed";
      if (Array.isArray(errMsg)) {
        errMsg = errMsg.map((e: any) => e.msg).join(", ");
      }
      throw new ApiError(errMsg, res.status);
    } catch (error) {
      console.error("User service exception:", error);
      return { user: null, error };
    }
  },
};
