import Link from "next/link";
import { FileQuestion, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background p-4 text-center">
      {/* 1. Icon / Visual */}
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-muted">
        <FileQuestion className="h-12 w-12 text-muted-foreground" />
      </div>

      {/* 2. Text Content */}
      <h1 className="mb-2 text-4xl font-extrabold tracking-tight lg:text-5xl">
        404
      </h1>
      <h2 className="mb-4 text-2xl font-semibold tracking-tight">
        Resource Not Found
      </h2>
      <p className="mb-8 max-w-[500px] text-muted-foreground">
        The page or record you are looking for does not exist. It may have been
        moved, deleted, or you may not have permission to view it.
      </p>

      {/* 3. Action Buttons */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <Button asChild variant="default">
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Return to Dashboard
          </Link>
        </Button>

        <Button asChild variant="outline">
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Go Home
          </Link>
        </Button>
      </div>

      {/* 4. Footer */}
      <div className="mt-12 text-xs text-muted-foreground/50 font-mono">
        Error Code: 404_NOT_FOUND
      </div>
    </div>
  );
}
