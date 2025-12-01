"use client";

import type React from "react";

import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import type { User } from "@/lib/types";

interface DashboardLayoutProps {
  children: React.ReactNode;
  user: User | null;
}

export function DashboardLayout({ children, user }: DashboardLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar user={user} />
      <div className="flex flex-1">
        <Sidebar user={user} />
        <main className="flex-1 overflow-auto pb-24">
          <div className="max-w-7xl mx-auto p-6 md:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
