import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "admin_session";
const SESSION_TOKEN = "admin_session_token_2024";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only guard /admin/dashboard routes
  if (pathname.startsWith("/admin/dashboard")) {
    const session = request.cookies.get(SESSION_COOKIE);
    const isAuthenticated = session?.value === SESSION_TOKEN;

    if (!isAuthenticated) {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // If already logged in and visiting /admin/login, redirect to dashboard
  if (pathname === "/admin/login") {
    const session = request.cookies.get(SESSION_COOKIE);
    const isAuthenticated = session?.value === SESSION_TOKEN;

    if (isAuthenticated) {
      const dashboardUrl = new URL("/admin/dashboard", request.url);
      return NextResponse.redirect(dashboardUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/dashboard/:path*", "/admin/login"],
};

