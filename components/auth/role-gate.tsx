"use client";

import { ReactNode } from "react";
import { useCurrentUser } from "@/hooks/use-current-user";

type Role = "admin" | "staff" | "intern" | "guest";

interface RoleGateProps {
  children: ReactNode;
  allowedRoles: Role[];
}

export function RoleGate({ children, allowedRoles }: RoleGateProps) {
  const { user, isLoading } = useCurrentUser();

  if (isLoading) {
    return null;
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return null;
  }

  // 3. Success: Show the protected content
  return <>{children}</>;
}
