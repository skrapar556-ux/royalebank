"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import type { JWTPayload } from "@/lib/auth"
import Image from "next/image"

interface Transaction {
  id: number
  from_account: string
  to_account: string
  amount: number
  description: string
  status: string
  created_at: string
}

export default function DashboardClient({ session }: { session: JWTPayload }) {
  const router = useRouter()
  const { toast } = useToast()
  const [balance, setBalance] = useState<number>(0)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(false)
  const [transferData, setTransferData] = useState({
    toAccount: "",
    amount: "",
    description: "",
  })

  useEffect(() => {
    fetchBalance()
    fetchTransactions()
  }, [])

  const fetchBalance = async () => {
    try {
      const response = await fetch("/api/user/balance")
      const data = await response.json()
      if (response.ok) {
        setBalance(data.balance)
      }
    } catch (error) {
      console.error("Failed to fetch balance:", error)
    }
  }

  const fetchTransactions = async () => {
    try {
      const response = await fetch("/api/user/transactions")
      const data = await response.json()
      if (response.ok) {
        setTransactions(data.transactions)
      }
    } catch (error) {
      console.error("Failed to fetch transactions:", error)
    }
  }

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/user/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toAccount: transferData.toAccount,
          amount: Number.parseFloat(transferData.amount),
          description: transferData.description,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Transfer failed")
      }

      toast({
        title: "Success",
        description: "Transfer completed successfully",
      })

      setTransferData({ toAccount: "", amount: "", description: "" })
      fetchBalance()
      fetchTransactions()
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

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/login")
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image
              src="/images/royale-bank-logo.jpg"
              alt="RoyaleBank Logo"
              width={120}
              height={60}
              className="h-10 w-auto"
            />
            <p className="text-sm text-slate-400">Welcome back, {session.username}</p>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="border-slate-700 text-slate-300 hover:bg-slate-800 bg-transparent"
          >
            Logout
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardDescription className="text-slate-400">Account Number</CardDescription>
              <CardTitle className="text-2xl text-white font-mono">{session.accountNumber}</CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardDescription className="text-slate-400">Available Balance</CardDescription>
              <CardTitle className="text-3xl text-sky-600">${balance.toFixed(2)}</CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardDescription className="text-slate-400">Total Transactions</CardDescription>
              <CardTitle className="text-3xl text-white">{transactions.length}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        <Tabs defaultValue="transfer" className="space-y-6">
          <TabsList className="bg-slate-900 border border-slate-800">
            <TabsTrigger value="transfer" className="data-[state=active]:bg-slate-800 data-[state=active]:text-white">
              Transfer Money
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-slate-800 data-[state=active]:text-white">
              Transaction History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="transfer">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Send Money</CardTitle>
                <CardDescription className="text-slate-400">Transfer funds to another account</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleTransfer} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="toAccount" className="text-slate-300">
                      Recipient Account Number
                    </Label>
                    <Input
                      id="toAccount"
                      type="text"
                      placeholder="RB00000000"
                      value={transferData.toAccount}
                      onChange={(e) => setTransferData({ ...transferData, toAccount: e.target.value })}
                      required
                      className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amount" className="text-slate-300">
                      Amount
                    </Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      min="0.01"
                      placeholder="0.00"
                      value={transferData.amount}
                      onChange={(e) => setTransferData({ ...transferData, amount: e.target.value })}
                      required
                      className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-slate-300">
                      Description (Optional)
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="What's this transfer for?"
                      value={transferData.description}
                      onChange={(e) => setTransferData({ ...transferData, description: e.target.value })}
                      className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                    />
                  </div>

                  <Button type="submit" className="w-full bg-sky-600 hover:bg-sky-700" disabled={loading}>
                    {loading ? "Processing..." : "Send Money"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Recent Transactions</CardTitle>
                <CardDescription className="text-slate-400">Your transaction history</CardDescription>
              </CardHeader>
              <CardContent>
                {transactions.length === 0 ? (
                  <p className="text-center text-slate-400 py-8">No transactions yet</p>
                ) : (
                  <div className="space-y-4">
                    {transactions.map((transaction) => {
                      const isReceived = transaction.to_account === session.accountNumber
                      return (
                        <div
                          key={transaction.id}
                          className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50 border border-slate-700"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-sm font-medium ${isReceived ? "text-green-500" : "text-red-500"}`}>
                                {isReceived ? "Received" : "Sent"}
                              </span>
                              <span className="text-xs text-slate-500">
                                {new Date(transaction.created_at).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm text-slate-400">{transaction.description}</p>
                            <p className="text-xs text-slate-500 font-mono mt-1">
                              {isReceived ? `From: ${transaction.from_account}` : `To: ${transaction.to_account}`}
                            </p>
                          </div>
                          <div className={`text-lg font-semibold ${isReceived ? "text-green-500" : "text-red-500"}`}>
                            {isReceived ? "+" : "-"}${transaction.amount.toFixed(2)}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
