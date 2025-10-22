import { type NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"
import { createToken, setAuthCookie } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json()

    if (!email || !otp) {
      return NextResponse.json({ error: "Email and OTP are required" }, { status: 400 })
    }

    const otpRecord = db.getValidOTP(email, otp)

    if (!otpRecord) {
      return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 })
    }

    // Parse stored data from OTP field
    let storedData
    try {
      storedData = JSON.parse(otpRecord.otp)
    } catch {
      return NextResponse.json({ error: "Invalid OTP format" }, { status: 400 })
    }

    // Check OTP
    if (storedData.otp !== otp) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 })
    }

    const newUser = db.createUser({
      username: storedData.username,
      email,
      password: storedData.password,
      account_number: storedData.accountNumber,
      balance: 0,
      is_admin: 0,
    })

    db.markOTPAsUsed(otpRecord.id)

    // Create session
    const token = await createToken({
      userId: newUser.id,
      username: newUser.username,
      email: newUser.email,
      accountNumber: newUser.account_number,
      isAdmin: newUser.is_admin === 1,
    })

    await setAuthCookie(token)

    return NextResponse.json({
      message: "Registration successful",
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        accountNumber: newUser.account_number,
        balance: newUser.balance,
        isAdmin: newUser.is_admin === 1,
      },
    })
  } catch (error) {
    console.error("OTP verification error:", error)
    return NextResponse.json({ error: "Verification failed" }, { status: 500 })
  }
}
