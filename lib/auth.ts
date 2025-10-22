import { cookies } from "next/headers"
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"

export interface JWTPayload {
  userId: number
  username: string
  email: string
  accountNumber: string
  isAdmin: boolean
}

export async function createToken(payload: JWTPayload): Promise<string> {
  const header = { alg: "HS256", typ: "JWT" }
  const now = Math.floor(Date.now() / 1000)
  const jwtPayload = {
    ...payload,
    iat: now,
    exp: now + 60 * 60 * 24 * 7, // 7 days
  }

  const encodedHeader = btoa(JSON.stringify(header))
  const encodedPayload = btoa(JSON.stringify(jwtPayload))
  const signature = await createSignature(`${encodedHeader}.${encodedPayload}`, JWT_SECRET)

  return `${encodedHeader}.${encodedPayload}.${signature}`
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const [encodedHeader, encodedPayload, signature] = token.split(".")

    // Verify signature
    const expectedSignature = await createSignature(`${encodedHeader}.${encodedPayload}`, JWT_SECRET)
    if (signature !== expectedSignature) {
      return null
    }

    const payload = JSON.parse(atob(encodedPayload))

    // Check expiration
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null
    }

    return {
      userId: payload.userId,
      username: payload.username,
      email: payload.email,
      accountNumber: payload.accountNumber,
      isAdmin: payload.isAdmin,
    }
  } catch (error) {
    return null
  }
}

async function createSignature(data: string, secret: string): Promise<string> {
  const encoder = new TextEncoder()
  const keyData = encoder.encode(secret)
  const messageData = encoder.encode(data)

  const key = await crypto.subtle.importKey("raw", keyData, { name: "HMAC", hash: "SHA-256" }, false, ["sign"])

  const signature = await crypto.subtle.sign("HMAC", key, messageData)
  return btoa(String.fromCharCode(...Array.from(new Uint8Array(signature))))
}

export async function getSession(): Promise<JWTPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth-token")

  if (!token) return null

  return await verifyToken(token.value)
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set("auth-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  })
}

export async function clearAuthCookie() {
  const cookieStore = await cookies()
  cookieStore.delete("auth-token")
}
