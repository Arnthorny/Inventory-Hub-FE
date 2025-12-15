import { ApiError } from "@/lib/errors";
import type {
  Item,
  CreateItemRequest,
  UpdateItemRequest,
  PaginatedListBase,
  ApiResponseBase,
} from "@/lib/types";
import { URL, URLSearchParams } from "node:url";
import { authService } from "./auth-service";
import fetcher from "../utils";
const API_URL = process.env.BACKEND_API_URL || "http://127.0.0.1:7001/api/v1";

export const itemsService = {
  async getItems(
    page: number = 1,
    limit: number = 10,
    search?: string,
    category?: string,
    location?: string
  ): Promise<{ items_res: PaginatedListBase<Item> | null; error: any }> {
    const token = await authService.getAccessToken();

    const url = new URL(`${API_URL}/items`);
    const sParams: Record<string, string> = {
      page: String(page),
      fields: "all",
      limit: String(limit),
    };

    if (search) sParams["search"] = search;
    if (category) sParams["category"] = category;
    if (location) sParams["location"] = location;
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
        console.log("Fetched items count: ", json?.data?.results.length || []);
        return { items_res: json.data || [], error: null };
      }

      let errMsg: string =
        json.errors || json.message || "Items Retrieval Failed";
      if (Array.isArray(errMsg)) {
        errMsg = errMsg.map((e: any) => e.msg).join(", ");
      }

      throw new ApiError(errMsg, res.status);
    } catch (error) {
      console.error("Items service exception:", error);
      return { items_res: null, error };
    }
  },

  async getItemById(id: string): Promise<{ item: Item | null; error: any }> {
    const token = await authService.getAccessToken();
    try {
      const res = await fetcher(`${API_URL}/items/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await res.json();

      if (res.ok) {
        console.log("Fetched item:", json.message || null);
        return { item: json.data, error: null };
      }

      let errMsg: string =
        json.errors || json.message || "Items Retrieval Failed";
      if (Array.isArray(errMsg)) {
        errMsg = errMsg.map((e: any) => e.msg).join(", ");
      }
      throw new ApiError(errMsg, res.status);
    } catch (error) {
      console.error("Items service exception:", error);
      return { item: null, error };
    }
  },

  async createItem(
    body: CreateItemRequest
  ): Promise<{ item: Item | null; error: any }> {
    try {
      const token = await authService.getAccessToken();
      const res = await fetcher(`${API_URL}/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const json = await res.json();

      if (res.ok) {
        console.log("Created item:", json.data || null);
        return { item: json.data, error: null };
      }

      let errMsg: string =
        json.errors || json.message || "Items Creation Failed";
      if (Array.isArray(errMsg)) {
        errMsg = errMsg.map((e: any) => e.msg).join(", ");
      }
      throw new ApiError(errMsg, res.status);
    } catch (error) {
      console.error("Items service exception:", error);
      return { item: null, error };
    }
  },

  async updateItem(
    id: string,
    request: UpdateItemRequest
  ): Promise<{ item: Item | null; error: any }> {
    try {
      const token = await authService.getAccessToken();
      const res = await fetcher(`${API_URL}/items/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(request),
      });

      const json = await res.json();

      if (res.ok) {
        console.log("Updated item:", json.data || null);
        return { item: json.data, error: null };
      }

      let errMsg: string = json.errors || json.message || "Items update Failed";
      if (Array.isArray(errMsg)) {
        errMsg = errMsg.map((e: any) => e.msg).join(", ");
      }
      throw new ApiError(errMsg, res.status);
    } catch (error) {
      console.error("Items service exception:", error);
      return { item: null, error };
    }
  },

  async getCategories(): Promise<{ categories: string[] | null; error: any }> {
    const token = await authService.getAccessToken();

    const url = new URL(`${API_URL}/items/categories`);

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
        console.log("Fetched categories count: ", json?.data?.length || []);
        return { categories: json.data || [], error: null };
      }

      let errMsg: string =
        json.errors || json.message || "Categories Retrieval Failed";
      if (Array.isArray(errMsg)) {
        errMsg = errMsg.map((e: any) => e.msg).join(", ");
      }

      throw new ApiError(errMsg, res.status);
    } catch (error) {
      console.error("Items service exception:", error);
      return { categories: null, error };
    }
  },

  async deleteItem(
    id: string
  ): Promise<{ res: ApiResponseBase | null; error: any }> {
    try {
      const token = await authService.getAccessToken();
      const res = await fetcher(`${API_URL}/items/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await res.json();

      if (res.ok) {
        console.log("Deleted item:", json.data || null);
        return { res: json, error: null };
      }

      let errMsg: string = json.errors || json.message || "Items delete Failed";
      if (Array.isArray(errMsg)) {
        errMsg = errMsg.map((e: any) => e.msg).join(", ");
      }
      throw new ApiError(errMsg, res.status);
    } catch (error) {
      console.error("Items service exception:", error);
      return { res: null, error };
    }
  },
  
  async getLocations(): Promise<{ locations: string[] | null; error: any }> {
    const token = await authService.getAccessToken();

    const url = new URL(`${API_URL}/items/locations`);

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
        console.log("Fetched locations count: ", json?.data?.length || []);
        return { locations: json.data || [], error: null };
      }

      let errMsg: string =
        json.errors || json.message || "locations Retrieval Failed";
      if (Array.isArray(errMsg)) {
        errMsg = errMsg.map((e: any) => e.msg).join(", ");
      }

      throw new ApiError(errMsg, res.status);
    } catch (error) {
      console.error("Items service exception:", error);
      return { locations: null, error };
    }
  },
};
