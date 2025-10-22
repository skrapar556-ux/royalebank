import { type NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"
import { getSession } from "@/lib/auth"

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()

    if (!session || !session.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const { balance } = await request.json()

    if (balance === undefined || balance < 0) {
      return NextResponse.json({ error: "Invalid balance" }, { status: 400 })
    }

    const user = db.getUserById(Number.parseInt(id))
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    db.updateUserBalance(user.account_number, balance)

    return NextResponse.json({ message: "Balance updated successfully" })
  } catch (error) {
    console.error("Balance update error:", error)
    return NextResponse.json({ error: "Failed to update balance" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()

    if (!session || !session.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    // Prevent deleting yourself
    if (Number.parseInt(id) === session.userId) {
      return NextResponse.json({ error: "Cannot delete your own account" }, { status: 400 })
    }

    const deleted = db.deleteUser(Number.parseInt(id))

    if (!deleted) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "User deleted successfully" })
  } catch (error) {
    console.error("User deletion error:", error)
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 })
  }
}
