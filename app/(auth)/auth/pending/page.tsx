"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Clock } from "lucide-react"

export default function PendingPage() {
  return (
      <Card className="w-full max-w-sm text-center border-border">
        <CardHeader className="flex flex-col items-center gap-4">
          <div className="p-3 bg-muted rounded-full">
            <Clock className="w-8 h-8 text-muted-foreground" />
          </div>
          <CardTitle className="text-2xl">Account Under Review</CardTitle>
          <CardDescription>
            Your account has been created successfully, but it requires administrator approval before you can access the system.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
              You will receive an email once your account has been approved.
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link href="/auth/login">Back to Login</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
  )
}