import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

// Admin credentials - can be overridden with environment variables
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "gowtham@2906";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "gowtham@2006";
const SESSION_TOKEN = "admin_session_token_2024";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      const cookieStore = await cookies();
      cookieStore.set("admin_session", SESSION_TOKEN, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24, // 24 hours
      });

      return NextResponse.json({ success: true, message: "Login successful" });
    }

    return NextResponse.json(
      { success: false, message: "Invalid credentials" },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid request" },
      { status: 400 }
    );
  }
}

