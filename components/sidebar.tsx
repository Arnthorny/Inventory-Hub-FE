"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import type { User } from "@/lib/types"

interface SidebarProps {
  user: User | null
}

const navigationItems = [
  { href: "/dashboard", label: "Dashboard", roles: ["admin", "staff", "intern", "guest"] },
  { href: "/inventory", label: "Inventory", roles: ["admin", "staff", "intern", "guest"] },
  { href: "/requests", label: "Requests", roles: ["admin", "staff", "intern", "guest"] },
  { href: "/admin/users", label: "Users", roles: ["admin"] },
]

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()

  const visibleItems = navigationItems.filter((item) => user && item.roles.includes(user.role))

  return (
    <aside className="w-64 border-r border-border bg-sidebar min-h-[calc(100vh-4rem)]">
      <nav className="p-6 space-y-2">
        {visibleItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "block px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              pathname === item.href
                ? "bg-sidebar-primary text-sidebar-primary-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent",
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
