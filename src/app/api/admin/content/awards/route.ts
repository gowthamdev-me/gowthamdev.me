import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { readJsonFile, writeJsonFile } from "@/lib/admin-data";

const SESSION_TOKEN = "admin_session_token_2024";

async function isAuthenticated() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  return session?.value === SESSION_TOKEN;
}

export async function GET() {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const data = readJsonFile("awards.json", [] as any[]);
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await request.json();
    const items = readJsonFile("awards.json", [] as any[]);
    const newItem = { id: `award-${Date.now()}`, ...body, createdAt: new Date().toISOString() };
    items.push(newItem);
    writeJsonFile("awards.json", items);
    return NextResponse.json({ success: true, data: newItem });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function PUT(request: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await request.json();
    const items = readJsonFile("awards.json", [] as any[]);
    const index = items.findIndex((p: any) => p.id === body.id);
    if (index === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
    items[index] = { ...items[index], ...body };
    writeJsonFile("awards.json", items);
    return NextResponse.json({ success: true, data: items[index] });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { searchParams } = new URL(request.url);
    let id = searchParams.get("id");
    if (!id) {
      try {
        const body = await request.json();
        id = body?.id;
      } catch {}
    }
    if (!id) {
      return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    }
    const items = readJsonFile("awards.json", [] as any[]);
    writeJsonFile("awards.json", items.filter((p: any) => String(p.id) !== String(id)));
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
