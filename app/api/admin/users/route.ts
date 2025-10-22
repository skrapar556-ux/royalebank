import { type NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"
import { getSession } from "@/lib/auth"
import bcrypt from "bcryptjs"
import { generateAccountNumber } from "@/lib/utils/account"

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session || !session.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const users = db.getAllUsers().map((user) => ({
      id: user.id,
      username: user.username,
      email: user.email,
      account_number: user.account_number,
      balance: user.balance,
      is_admin: user.is_admin,
      created_at: user.created_at,
    }))

    return NextResponse.json({ users })
  } catch (error) {
    console.error("Users fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session || !session.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { username, email, password, balance, isAdmin } = await request.json()

    // Validation
    if (!username || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    const existingUser = db.getUserByUsername(username) || db.getUserByEmail(email)

    if (existingUser) {
      return NextResponse.json({ error: "Username or email already exists" }, { status: 400 })
    }

    // Create user
    const hashedPassword = bcrypt.hashSync(password, 10)
    const accountNumber = generateAccountNumber()

    const newUser = db.createUser({
      username,
      email,
      password: hashedPassword,
      account_number: accountNumber,
      balance: balance || 0,
      is_admin: isAdmin ? 1 : 0,
    })

    return NextResponse.json({
      message: "User created successfully",
      userId: newUser.id,
    })
  } catch (error) {
    console.error("User creation error:", error)
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}
