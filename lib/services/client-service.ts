import type {
  User,
  DashboardStats,
  PaginatedListBase,
  Item,
  CreateRequestBody,
  CreateRequestItem,
  Request,
  ItemReq,
} from "@/lib/types";

export const clientService = {
  async getUser(): Promise<User> {
    const res = await fetch(`/api/users/profile`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      throw new Error("Unauthorized to getUser");
    }

    return res.json();
  },

  async getStats(): Promise<DashboardStats> {
    const res = await fetch("/api/dashboard/stats");
    if (!res.ok) {
      throw new Error("Failed to fetch dashboard stats");
    }

    const json = await res.json();

    return json.data;
  },

  async getItems(
    currentPage: number,
    ITEMS_PER_PAGE: number,
    debouncedSearch: string,
    selectedCategory?: string
  ) {
    const params = new URLSearchParams({
      page: String(currentPage),
      limit: String(ITEMS_PER_PAGE),
    });

    if (debouncedSearch) params.append("search", debouncedSearch);

    if (selectedCategory && selectedCategory !== "all")
      params.append("category", selectedCategory);

    const res = await fetch(`/api/items?${params.toString()}`);
    if (!res.ok) throw new Error("Failed to fetch items");
    const { items_res } = await res.json();
    return items_res as PaginatedListBase<Item>;
  },

  async getCategories() {
    const res = await fetch("/api/categories");
    if (!res.ok) return ["general", "design", "prototyping", "electronics"];
    return res.json();
  },

  async submitRequest(
    user: User | undefined,
    dueDate: string,
    items: CreateRequestItem[],
    reason: string
  ) {
    let body: CreateRequestBody;

    if (user?.role !== "admin") {
      body = {
        type: "user",
        due_date: dueDate ? new Date(dueDate) : undefined,
        items: items.map((i) => ({ item_id: i.id, quantity: i.quantity })),
        reason: reason,
      };
      const res = await fetch("/api/requests", {
        method: "POST",
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
    }
  },

  async getClientRequests(
    page: number = 1,
    limit: number = 10,
    statusFilter?: string,
    roleFilter?: string,
    guest_id?: string,
    user_id?: string
  ) {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      statusFilter: statusFilter || "",
      roleFilter: roleFilter || "",
      guest_id: guest_id || "",
      user_id: user_id || "",
    });

    const res = await fetch(`/api/requests?${params.toString()}`);
    if (!res.ok) throw new Error("Failed to fetch requests");
    const { requests_res } = await res.json();
    return requests_res as PaginatedListBase<Request>;
  },

  async updateRequestStatus(
    id: string,
    status: "approved" | "rejected" | "returned"
  ) {
    const res = await fetch(`/api/requests/${id}?status=${status}`, {
      method: "PATCH",
    });
    if (!res.ok) throw new Error("Failed to update request status");
    const { data } = await res.json();
    return data as Request;
  },

  async getClientRequestById(id: string) {
    const res = await fetch(`/api/requests/${id}`);
    if (!res.ok) throw new Error("Failed to get request");
    const json = await res.json();
    return json as Request;
  },

  async updateGuestRequest(id: string, items: ItemReq[], due_date: Date) {
    const res = await fetch(`/api/requests/${id}`, {
      method: "PUT",
      body: JSON.stringify({ items, due_date }),
    });
    if (!res.ok) throw new Error("Failed to update guest request");
    const { data } = await res.json();
    return data as Request;
  },
};
