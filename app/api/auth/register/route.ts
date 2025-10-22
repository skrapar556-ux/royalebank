import { type NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"
import bcrypt from "bcryptjs"
import { sendOTPEmail } from "@/lib/email"
import { generateAccountNumber } from "@/lib/utils/account"

export async function POST(request: NextRequest) {
  try {
    const { username, email, password } = await request.json()

    // Validation
    if (!username || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
    }

    // Check if user exists
    const existingUser = db.getUserByUsername(username) || db.getUserByEmail(email)

    if (existingUser) {
      return NextResponse.json({ error: "Username or email already exists" }, { status: 400 })
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Save OTP
    db.createOTP(email, otp, expiresAt.toISOString())

    // Send OTP email
    const emailSent = await sendOTPEmail(email, otp)

    if (!emailSent) {
      return NextResponse.json({ error: "Failed to send OTP email" }, { status: 500 })
    }

    // Hash password and store user data temporarily (we'll complete registration after OTP verification)
    const hashedPassword = bcrypt.hashSync(password, 10)
    const accountNumber = generateAccountNumber()

    // Store pending user data in a temporary way (using OTP table with additional data)
    // In production, you'd want a separate pending_users table
    db.updateOTP(email, JSON.stringify({ otp, username, password: hashedPassword, accountNumber }))

    return NextResponse.json({
      message: "OTP sent to your email",
      email,
      requiresOTP: true,
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Registration failed" }, { status: 500 })
  }
}
