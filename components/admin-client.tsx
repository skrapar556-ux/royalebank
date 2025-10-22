"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import type { JWTPayload } from "@/lib/auth"
import { Switch } from "@/components/ui/switch"

interface User {
  id: number
  username: string
  email: string
  account_number: string
  balance: number
  is_admin: number
  created_at: string
}

interface Transaction {
  id: number
  from_account: string
  to_account: string
  amount: number
  description: string
  status: string
  created_at: string
}

export default function AdminClient({ session }: { session: JWTPayload }) {
  const router = useRouter()
  const { toast } = useToast()
  const [users, setUsers] = useState<User[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(false)
  const [createUserOpen, setCreateUserOpen] = useState(false)
  const [editBalanceOpen, setEditBalanceOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [newBalance, setNewBalance] = useState("")

  const [newUserData, setNewUserData] = useState({
    username: "",
    email: "",
    password: "",
    balance: "0",
    isAdmin: false,
  })

  useEffect(() => {
    fetchUsers()
    fetchTransactions()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/users")
      const data = await response.json()
      if (response.ok) {
        setUsers(data.users)
      }
    } catch (error) {
      console.error("Failed to fetch users:", error)
    }
  }

  const fetchTransactions = async () => {
    try {
      const response = await fetch("/api/admin/transactions")
      const data = await response.json()
      if (response.ok) {
        setTransactions(data.transactions)
      }
    } catch (error) {
      console.error("Failed to fetch transactions:", error)
    }
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: newUserData.username,
          email: newUserData.email,
          password: newUserData.password,
          balance: Number.parseFloat(newUserData.balance),
          isAdmin: newUserData.isAdmin,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create user")
      }

      toast({
        title: "Success",
        description: "User created successfully",
      })

      setCreateUserOpen(false)
      setNewUserData({ username: "", email: "", password: "", balance: "0", isAdmin: false })
      fetchUsers()
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

  const handleUpdateBalance = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedUser) return

    setLoading(true)

    try {
      const response = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ balance: Number.parseFloat(newBalance) }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to update balance")
      }

      toast({
        title: "Success",
        description: "Balance updated successfully",
      })

      setEditBalanceOpen(false)
      setSelectedUser(null)
      setNewBalance("")
      fetchUsers()
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

  const handleDeleteUser = async (userId: number) => {
    if (!confirm("Are you sure you want to delete this user?")) return

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete user")
      }

      toast({
        title: "Success",
        description: "User deleted successfully",
      })

      fetchUsers()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/login")
    router.refresh()
  }

  const totalBalance = users.reduce((sum, user) => sum + user.balance, 0)
  const totalTransactions = transactions.reduce((sum, tx) => sum + tx.amount, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">RoyaleBank Admin</h1>
            <p className="text-sm text-slate-400">System Management Dashboard</p>
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
              <CardDescription className="text-slate-400">Total Users</CardDescription>
              <CardTitle className="text-3xl text-white">{users.length}</CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardDescription className="text-slate-400">Total Balance</CardDescription>
              <CardTitle className="text-3xl text-sky-600">${totalBalance.toFixed(2)}</CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardDescription className="text-slate-400">Total Transactions</CardDescription>
              <CardTitle className="text-3xl text-white">${totalTransactions.toFixed(2)}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="bg-slate-900 border border-slate-800">
            <TabsTrigger value="users" className="data-[state=active]:bg-slate-800 data-[state=active]:text-white">
              User Management
            </TabsTrigger>
            <TabsTrigger
              value="transactions"
              className="data-[state=active]:bg-slate-800 data-[state=active]:text-white"
            >
              All Transactions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-white">Users</CardTitle>
                  <CardDescription className="text-slate-400">Manage user accounts and balances</CardDescription>
                </div>
                <Dialog open={createUserOpen} onOpenChange={setCreateUserOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-sky-600 hover:bg-sky-700">Create User</Button>
                  </DialogTrigger>
                  <DialogContent className="bg-slate-900 border-slate-800">
                    <DialogHeader>
                      <DialogTitle className="text-white">Create New User</DialogTitle>
                      <DialogDescription className="text-slate-400">Add a new user to the system</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateUser} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="new-username" className="text-slate-300">
                          Username
                        </Label>
                        <Input
                          id="new-username"
                          value={newUserData.username}
                          onChange={(e) => setNewUserData({ ...newUserData, username: e.target.value })}
                          required
                          className="bg-slate-800 border-slate-700 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-email" className="text-slate-300">
                          Email
                        </Label>
                        <Input
                          id="new-email"
                          type="email"
                          value={newUserData.email}
                          onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                          required
                          className="bg-slate-800 border-slate-700 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-password" className="text-slate-300">
                          Password
                        </Label>
                        <Input
                          id="new-password"
                          type="password"
                          value={newUserData.password}
                          onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
                          required
                          minLength={6}
                          className="bg-slate-800 border-slate-700 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-balance" className="text-slate-300">
                          Initial Balance
                        </Label>
                        <Input
                          id="new-balance"
                          type="number"
                          step="0.01"
                          value={newUserData.balance}
                          onChange={(e) => setNewUserData({ ...newUserData, balance: e.target.value })}
                          required
                          className="bg-slate-800 border-slate-700 text-white"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="new-admin"
                          checked={newUserData.isAdmin}
                          onCheckedChange={(checked) => setNewUserData({ ...newUserData, isAdmin: checked })}
                        />
                        <Label htmlFor="new-admin" className="text-slate-300">
                          Admin privileges
                        </Label>
                      </div>
                      <Button type="submit" className="w-full bg-sky-600 hover:bg-sky-700" disabled={loading}>
                        {loading ? "Creating..." : "Create User"}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-slate-800 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-800 hover:bg-slate-800/50">
                        <TableHead className="text-slate-300">Username</TableHead>
                        <TableHead className="text-slate-300">Email</TableHead>
                        <TableHead className="text-slate-300">Account Number</TableHead>
                        <TableHead className="text-slate-300">Balance</TableHead>
                        <TableHead className="text-slate-300">Role</TableHead>
                        <TableHead className="text-slate-300">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id} className="border-slate-800 hover:bg-slate-800/50">
                          <TableCell className="text-white">{user.username}</TableCell>
                          <TableCell className="text-slate-400">{user.email}</TableCell>
                          <TableCell className="text-slate-400 font-mono">{user.account_number}</TableCell>
                          <TableCell className="text-sky-600 font-semibold">${user.balance.toFixed(2)}</TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-1 rounded text-xs ${user.is_admin ? "bg-purple-500/20 text-purple-400" : "bg-slate-700 text-slate-300"}`}
                            >
                              {user.is_admin ? "Admin" : "User"}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedUser(user)
                                  setNewBalance(user.balance.toString())
                                  setEditBalanceOpen(true)
                                }}
                                className="border-slate-700 text-slate-300 hover:bg-slate-800 bg-transparent"
                              >
                                Edit Balance
                              </Button>
                              {user.id !== session.userId && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleDeleteUser(user.id)}
                                  className="border-red-900 text-red-400 hover:bg-red-950 bg-transparent"
                                >
                                  Delete
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">All Transactions</CardTitle>
                <CardDescription className="text-slate-400">System-wide transaction history</CardDescription>
              </CardHeader>
              <CardContent>
                {transactions.length === 0 ? (
                  <p className="text-center text-slate-400 py-8">No transactions yet</p>
                ) : (
                  <div className="rounded-lg border border-slate-800 overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-slate-800 hover:bg-slate-800/50">
                          <TableHead className="text-slate-300">Date</TableHead>
                          <TableHead className="text-slate-300">From</TableHead>
                          <TableHead className="text-slate-300">To</TableHead>
                          <TableHead className="text-slate-300">Amount</TableHead>
                          <TableHead className="text-slate-300">Description</TableHead>
                          <TableHead className="text-slate-300">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {transactions.map((transaction) => (
                          <TableRow key={transaction.id} className="border-slate-800 hover:bg-slate-800/50">
                            <TableCell className="text-slate-400">
                              {new Date(transaction.created_at).toLocaleString()}
                            </TableCell>
                            <TableCell className="text-slate-400 font-mono">{transaction.from_account}</TableCell>
                            <TableCell className="text-slate-400 font-mono">{transaction.to_account}</TableCell>
                            <TableCell className="text-sky-600 font-semibold">
                              ${transaction.amount.toFixed(2)}
                            </TableCell>
                            <TableCell className="text-slate-400">{transaction.description}</TableCell>
                            <TableCell>
                              <span className="px-2 py-1 rounded text-xs bg-green-500/20 text-green-400">
                                {transaction.status}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={editBalanceOpen} onOpenChange={setEditBalanceOpen}>
        <DialogContent className="bg-slate-900 border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-white">Edit Balance</DialogTitle>
            <DialogDescription className="text-slate-400">
              Update balance for {selectedUser?.username}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateBalance} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-balance" className="text-slate-300">
                New Balance
              </Label>
              <Input
                id="edit-balance"
                type="number"
                step="0.01"
                value={newBalance}
                onChange={(e) => setNewBalance(e.target.value)}
                required
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <Button type="submit" className="w-full bg-sky-600 hover:bg-sky-700" disabled={loading}>
              {loading ? "Updating..." : "Update Balance"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
