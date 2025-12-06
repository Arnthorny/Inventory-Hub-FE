"use client"

import { useState } from "react"
import Link from "next/link"
import { useMutation } from "@tanstack/react-query"
import { ArrowLeft, CheckCircle2, Loader2, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const mutation = useMutation({
    mutationFn: async (email: string) => {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || "Failed to send reset link")
      }
    },
    onSuccess: () => {
      setIsSubmitted(true)
      toast.success("Reset link sent!")
    },
    onError: (err) => {
      toast.error("Error", { description: err.message })
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutation.mutate(email)
  }

  return (
      <div className="w-full max-w-sm">
        <Button variant="ghost" asChild className="mb-4 pl-0 hover:bg-transparent hover:text-muted-foreground cursor-pointer">
            <Link href="/auth/login" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" /> Back to Login
            </Link>
        </Button>

        <Card className="border border-border">
          {!isSubmitted ? (
            <>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
                    <CardDescription>
                    Enter your email address and we'll send you a link to reset your password.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <Button type="submit" className="w-full cursor-pointer" disabled={mutation.isPending}>
                        {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Send Reset Link
                    </Button>
                    </form>
                </CardContent>
            </>
          ) : (
            <CardContent className="pt-6 text-center space-y-4">
                <div className="flex justify-center">
                    <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                        <Mail className="h-6 w-6 text-green-600" />
                    </div>
                </div>
                <div className="space-y-2">
                    <h3 className="text-xl font-semibold">Check your email</h3>
                    <p className="text-muted-foreground text-sm">
                        We have sent a password reset link to <span className="font-medium text-foreground">{email}</span>.
                    </p>
                </div>
                <Button variant="outline" className="w-full cursor-pointer" onClick={() => setIsSubmitted(false)}>
                    Try another email
                </Button>
            </CardContent>
          )}
        </Card>
      </div>
  )
}