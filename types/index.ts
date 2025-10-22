export interface User {
  id: number
  username: string
  email: string
  account_number: string
  balance: number
  is_admin: number
  created_at: string
}

export interface Transaction {
  id: number
  from_account: string
  to_account: string
  amount: number
  description: string | null
  status: string
  created_at: string
}

export interface OTP {
  id: number
  email: string
  otp: string
  expires_at: string
  used: number
  created_at: string
}
