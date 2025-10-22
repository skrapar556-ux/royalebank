import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyToken } from "./lib/auth"

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("auth-token")
  const { pathname } = request.nextUrl

  // Public routes
  const publicRoutes = ["/login", "/register", "/verify-otp"]
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route))

  // If no token and trying to access protected route
  if (!token && !isPublicRoute && pathname !== "/") {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // If has token and trying to access auth pages
  if (token && isPublicRoute) {
    const payload = await verifyToken(token.value)
    if (payload) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  }

  // Check admin routes
  if (pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
    const payload = await verifyToken(token.value)
    if (!payload || !payload.isAdmin) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
