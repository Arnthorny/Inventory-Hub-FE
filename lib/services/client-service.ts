import type { User, DashboardStats } from "@/lib/types";

export const clientService = {
  async getUser(): Promise<User> {
    const res = await fetch(`/api/users/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
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
};
