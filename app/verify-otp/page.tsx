"use client"

import type React from "react"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"

function VerifyOTPContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [otp, setOtp] = useState("")
  const email = searchParams.get("email") || ""

  useEffect(() => {
    if (!email) {
      router.push("/register")
    }
  }, [email, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (otp.length !== 6) {
      toast({
        title: "Error",
        description: "Please enter a valid 6-digit OTP",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Verification failed")
      }

      toast({
        title: "Success",
        description: "Account created successfully",
      })

      router.push("/dashboard")
      router.refresh()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
      <Card className="w-full max-w-md bg-slate-900 border-slate-800">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-white">Verify your email</CardTitle>
          <CardDescription className="text-slate-400">
            We sent a 6-digit code to <span className="text-sky-600">{email}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4 bg-sky-950 border-sky-800">
            <AlertDescription className="text-sky-200 text-sm">
              <strong>Preview Mode:</strong> Open browser console (F12) to see your OTP code.
            </AlertDescription>
          </Alert>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center">
              <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} className="bg-slate-800 border-slate-700 text-white" />
                  <InputOTPSlot index={1} className="bg-slate-800 border-slate-700 text-white" />
                  <InputOTPSlot index={2} className="bg-slate-800 border-slate-700 text-white" />
                  <InputOTPSlot index={3} className="bg-slate-800 border-slate-700 text-white" />
                  <InputOTPSlot index={4} className="bg-slate-800 border-slate-700 text-white" />
                  <InputOTPSlot index={5} className="bg-slate-800 border-slate-700 text-white" />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <Button type="submit" className="w-full bg-sky-600 hover:bg-sky-700" disabled={loading || otp.length !== 6}>
              {loading ? "Verifying..." : "Verify Email"}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm text-slate-400">
            {"Didn't receive the code? "}
            <button className="text-sky-600 hover:text-sky-500 font-medium">Resend</button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function VerifyOTPPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyOTPContent />
    </Suspense>
  )
}
