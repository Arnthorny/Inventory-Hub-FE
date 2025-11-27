import { redirect } from "next/navigation";
import { authService } from "@/lib/services/auth-service";
import { DashboardLayout } from "@/components/layout/dashboard-layout";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    const user = await authService.getUser();

    return <DashboardLayout user={user}>{children}</DashboardLayout>;
  } catch (error) {
    console.error(error);
    redirect("/auth/login?error=SessionExpired");
  }
}
