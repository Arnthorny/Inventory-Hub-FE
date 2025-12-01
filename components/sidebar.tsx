"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react"; // Hamburger Icon
import { cn } from "@/lib/utils";
import type { User } from "@/lib/types";

// Shadcn UI Imports
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";

interface SidebarProps {
  user: User | null;
}

const navigationItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    roles: ["admin", "staff", "intern", "guest"],
  },
  {
    href: "/inventory",
    label: "Inventory",
    roles: ["admin", "staff", "intern", "guest"],
  },
  {
    href: "/requests",
    label: "Requests",
    roles: ["admin", "staff", "intern", "guest"],
  },
  { href: "/admin/users", label: "Users", roles: ["admin"] },
];

// --- 1. REUSABLE NAV LINKS (Shared by Desktop & Mobile) ---
function NavLinks({
  user,
  setOpen,
}: {
  user: User | null;
  setOpen?: (open: boolean) => void;
}) {
  const pathname = usePathname();
  const visibleItems = navigationItems.filter(
    (item) => user && item.roles.includes(user.role)
  );

  return (
    <nav className="space-y-2">
      {visibleItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={() => {
            // Close the mobile menu when a link is clicked
            if (setOpen) setOpen(false);
          }}
          className={cn(
            "block px-4 py-2 rounded-lg text-sm font-medium transition-colors",
            pathname.startsWith(item.href)
              ? "bg-sidebar-primary text-sidebar-primary-foreground font-bold"
              : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

// --- 2. DESKTOP SIDEBAR (Hidden on Mobile) ---
export function Sidebar({ user }: SidebarProps) {
  return (
    <aside className="hidden md:block w-64 border-r border-border bg-sidebar min-h-[calc(100vh-4rem)]">
      <div className="p-6">
        <NavLinks user={user} />
      </div>
    </aside>
  );
}

// --- 3. MOBILE SIDEBAR (Hamburger - Hidden on Desktop) ---
export function MobileSidebar({ user }: SidebarProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-[300px] sm:w-[400px] bg-sidebar p-0"
      >
        <SheetHeader className="p-6 text-left border-b border-border/10">
          <SheetTitle>Navigation</SheetTitle>
        </SheetHeader>
        <div className="p-6">
          <NavLinks user={user} setOpen={setOpen} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
