export function generateAccountNumber(): string {
  const timestamp = Date.now().toString().slice(-8)
  const random = Math.floor(Math.random() * 100)
    .toString()
    .padStart(2, "0")
  return `RB${timestamp}${random}`
}

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
  }).format(amount)
}

export function formatAccountNumber(accountNumber: string): string {
  return accountNumber.replace(/(.{4})/g, "$1 ").trim()
}
