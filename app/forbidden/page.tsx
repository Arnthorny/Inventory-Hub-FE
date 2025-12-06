"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ShieldAlert, ArrowLeft, LogOut } from "lucide-react";
import { useLogout } from "@/hooks/use-logout"; // Assuming you have this hook from earlier

export default function ForbiddenPage() {
  const router = useRouter();
  const { logout } = useLogout();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md border-destructive/20 shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-full">
              <ShieldAlert className="h-12 w-12 text-red-600 dark:text-red-500" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">
            Access Denied
          </CardTitle>
          <CardDescription className="text-base mt-2">
            You do not have permission to view this page. This area is
            restricted to administrators only.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="p-3 bg-muted rounded-md text-sm text-center text-muted-foreground">
            Error Code: <strong>403 Forbidden</strong>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-2">
          <Button className="w-full cursor-pointer" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>

          <div className="grid grid-cols-2 gap-2 w-full">
            <Button variant="outline" className="cursor-pointer" asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <Button
              variant="outline"
              onClick={logout}
              className="text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
