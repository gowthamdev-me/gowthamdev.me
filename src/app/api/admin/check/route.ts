import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const SESSION_TOKEN = "admin_session_token_2024";

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");

  if (session?.value === SESSION_TOKEN) {
    return NextResponse.json({ authenticated: true });
  }

  return NextResponse.json({ authenticated: false }, { status: 401 });
}

