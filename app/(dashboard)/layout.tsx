import { redirect } from "next/navigation";
import { authService } from "@/lib/services/auth-service";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { RequestCart } from "@/components/requests/request-cart";
import { RequestCartToggle } from "@/components/requests/request-cart-toggle";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    const user = await authService.getUser();

    return (
      <DashboardLayout user={user}>
        {children}
        <RequestCartToggle />
        <RequestCart />
      </DashboardLayout>
    );
  } catch (error) {
    console.error(error);
    redirect("/auth/login?error=SessionExpired");
  }
}
