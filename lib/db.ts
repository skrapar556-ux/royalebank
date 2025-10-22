interface User {
  id: number
  username: string
  email: string
  password: string
  account_number: string
  balance: number
  is_admin: number
  created_at: string
}

interface OTP {
  id: number
  email: string
  otp: string
  expires_at: string
  used: number
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

// In-memory database
class InMemoryDB {
  private users: User[] = []
  private otps: OTP[] = []
  private transactions: Transaction[] = []
  private userIdCounter = 1
  private otpIdCounter = 1
  private transactionIdCounter = 1

  constructor() {
    this.initializeDefaultAdmin()
  }

  private initializeDefaultAdmin() {
    const bcrypt = require("bcryptjs")
    const hashedPassword = bcrypt.hashSync("admin123", 10)
    this.users.push({
      id: this.userIdCounter++,
      username: "admin",
      email: "admin@royalebank.com",
      password: hashedPassword,
      account_number: "RB00000001",
      balance: 10000,
      is_admin: 1,
      created_at: new Date().toISOString(),
    })
  }

  // User operations
  getUserByUsername(username: string): User | undefined {
    return this.users.find((u) => u.username === username)
  }

  getUserByEmail(email: string): User | undefined {
    return this.users.find((u) => u.email === email)
  }

  getUserByAccountNumber(accountNumber: string): User | undefined {
    return this.users.find((u) => u.account_number === accountNumber)
  }

  getUserById(id: number): User | undefined {
    return this.users.find((u) => u.id === id)
  }

  getAllUsers(): User[] {
    return [...this.users]
  }

  createUser(user: Omit<User, "id" | "created_at">): User {
    const newUser: User = {
      ...user,
      id: this.userIdCounter++,
      created_at: new Date().toISOString(),
    }
    this.users.push(newUser)
    return newUser
  }

  updateUserBalance(accountNumber: string, newBalance: number): boolean {
    const user = this.getUserByAccountNumber(accountNumber)
    if (user) {
      user.balance = newBalance
      return true
    }
    return false
  }

  deleteUser(id: number): boolean {
    const index = this.users.findIndex((u) => u.id === id)
    if (index !== -1) {
      this.users.splice(index, 1)
      return true
    }
    return false
  }

  // OTP operations
  createOTP(email: string, otp: string, expiresAt: string): OTP {
    const newOTP: OTP = {
      id: this.otpIdCounter++,
      email,
      otp,
      expires_at: expiresAt,
      used: 0,
      created_at: new Date().toISOString(),
    }
    this.otps.push(newOTP)
    return newOTP
  }

  getValidOTP(email: string, otp: string): OTP | undefined {
    return this.otps.find(
      (o) => o.email === email && o.otp === otp && o.used === 0 && new Date(o.expires_at) > new Date(),
    )
  }

  markOTPAsUsed(id: number): boolean {
    const otp = this.otps.find((o) => o.id === id)
    if (otp) {
      otp.used = 1
      return true
    }
    return false
  }

  // Transaction operations
  createTransaction(transaction: Omit<Transaction, "id" | "created_at">): Transaction {
    const newTransaction: Transaction = {
      ...transaction,
      id: this.transactionIdCounter++,
      created_at: new Date().toISOString(),
    }
    this.transactions.push(newTransaction)
    return newTransaction
  }

  getTransactionsByAccount(accountNumber: string): Transaction[] {
    return this.transactions.filter((t) => t.from_account === accountNumber || t.to_account === accountNumber)
  }

  getAllTransactions(): Transaction[] {
    return [...this.transactions]
  }
}

// Export singleton instance
const db = new InMemoryDB()
export default db
