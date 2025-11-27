"use client";

import { useEffect, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { RequestCard } from "@/components/requests/request-card";
import { RequestForm } from "@/components/requests/request-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Request, Item, User } from "@/lib/types";

export default function RequestsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [requests, setRequests] = useState<Request[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log("[v0] Loading requests page data...");
        const supabase = createClient();
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser();

        if (!authUser) {
          redirect("/auth/login");
        }

        // Fetch user profile
        const userResponse = await fetch("/api/users/profile");
        const userData = await userResponse.json();
        console.log("[v0] User profile loaded:", userData.user?.id);
        setUser(userData.user);

        console.log("[v0] Fetching items from API...");
        const itemsResponse = await fetch("/api/items/list");
        const itemsData = await itemsResponse.json();
        console.log(
          "[v0] Items loaded:",
          itemsData.items?.length || 0,
          "Error:",
          itemsData.error
        );
        setItems(itemsData.items || []);

        console.log("[v0] Fetching requests from API...");
        const requestsResponse = await fetch("/api/requests/list");
        const requestsData = await requestsResponse.json();
        console.log(
          "[v0] Requests loaded:",
          requestsData.requests?.length || 0,
          "Error:",
          requestsData.error
        );
        setRequests(requestsData.requests || []);
      } catch (error) {
        console.error("[v0] Error loading requests page:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleCreateRequest = async (data: any) => {
    try {
      console.log("[v0] Creating request with data:", data);
      const supabase = createClient();
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (!authUser) {
        throw new Error("No authenticated user");
      }

      const response = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: authUser.id,
          items: data.items,
          notes: data.notes,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("[v0] Request creation failed:", errorData);
        throw new Error(errorData.error || "Failed to create request");
      }

      console.log("[v0] Request created successfully, refreshing list...");
      const requestsResponse = await fetch("/api/requests/list");
      const requestsData = await requestsResponse.json();
      setRequests(requestsData.requests || []);
      setShowForm(false);
    } catch (error) {
      console.error("[v0] Error creating request:", error);
      throw error;
    }
  };

  const handleApproveRequest = async (id: string) => {
    try {
      await fetch(`/api/requests/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: "approved" }),
      });

      const requestsResponse = await fetch("/api/requests/list");
      const requestsData = await requestsResponse.json();
      setRequests(requestsData.requests || []);
    } catch (error) {
      console.error("Error approving request:", error);
    }
  };

  const handleRejectRequest = async (id: string) => {
    try {
      await fetch(`/api/requests/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: "rejected" }),
      });

      const requestsResponse = await fetch("/api/requests/list");
      const requestsData = await requestsResponse.json();
      setRequests(requestsData.requests || []);
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
  };

  const handleReturnRequest = async (id: string) => {
    try {
      await fetch(`/api/requests/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: "returned" }),
      });

      const requestsResponse = await fetch("/api/requests/list");
      const requestsData = await requestsResponse.json();
      setRequests(requestsData.requests || []);
    } catch (error) {
      console.error("Error returning request:", error);
    }
  };

  if (isLoading || !user) {
    return (
      <DashboardLayout user={null}>
        <div>Loading...</div>
      </DashboardLayout>
    );
  }

  const isStaff = ["admin", "staff"].includes(user.role);
  const userRequests =
    user.role === "admin" || user.role === "staff"
      ? requests
      : requests.filter((r) => r.user_id === user.id);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Requests
          </h1>
          <p className="text-muted-foreground mt-2">
            {isStaff
              ? "Manage item requests"
              : "Create and track your requests"}
          </p>
        </div>
        {!isStaff && (
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? "View Requests" : "New Request"}
          </Button>
        )}
      </div>

      {showForm && !isStaff && items.length > 0 && (
        <RequestForm items={items} onSubmit={handleCreateRequest} />
      )}

      {showForm && !isStaff && items.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No items available to request. Please check back later.
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {userRequests.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="text-center py-8 text-muted-foreground">
              No requests found
            </CardContent>
          </Card>
        ) : (
          userRequests.map((request) => {
            const requestItemCount = request.items?.length || 0;
            return (
              <RequestCard
                key={request.id}
                request={request}
                itemCount={requestItemCount}
                isStaff={isStaff}
                onApprove={handleApproveRequest}
                onReject={handleRejectRequest}
                onReturn={handleReturnRequest}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
