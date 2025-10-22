import { type NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"
import { getSession } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { toAccount, amount, description } = await request.json()

    // Validation
    if (!toAccount || !amount) {
      return NextResponse.json({ error: "Account number and amount are required" }, { status: 400 })
    }

    if (amount <= 0) {
      return NextResponse.json({ error: "Amount must be greater than 0" }, { status: 400 })
    }

    if (toAccount === session.accountNumber) {
      return NextResponse.json({ error: "Cannot transfer to your own account" }, { status: 400 })
    }

    const sender = db.getUserByAccountNumber(session.accountNumber)

    if (!sender) {
      return NextResponse.json({ error: "Sender account not found" }, { status: 404 })
    }

    if (sender.balance < amount) {
      return NextResponse.json({ error: "Insufficient balance" }, { status: 400 })
    }

    // Check recipient exists
    const recipient = db.getUserByAccountNumber(toAccount)

    if (!recipient) {
      return NextResponse.json({ error: "Recipient account not found" }, { status: 404 })
    }

    const newSenderBalance = sender.balance - amount
    const newRecipientBalance = recipient.balance + amount

    db.updateUserBalance(session.accountNumber, newSenderBalance)
    db.updateUserBalance(toAccount, newRecipientBalance)

    // Record transaction
    const transaction = db.createTransaction({
      from_account: session.accountNumber,
      to_account: toAccount,
      amount,
      description: description || "Transfer",
      status: "completed",
    })

    return NextResponse.json({
      message: "Transfer successful",
      transactionId: transaction.id,
    })
  } catch (error) {
    console.error("Transfer error:", error)
    return NextResponse.json({ error: "Transfer failed" }, { status: 500 })
  }
}
