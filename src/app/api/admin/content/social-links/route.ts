import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { readJsonFile, writeJsonFile } from "@/lib/admin-data";

const SESSION_TOKEN = "admin_session_token_2024";

async function isAuthenticated() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  return session?.value === SESSION_TOKEN;
}

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const data = readJsonFile("social-links.json", [] as any[]);
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const items = readJsonFile("social-links.json", [] as any[]);
    const newItem = {
      id: `social-${Date.now()}`,
      ...body,
    };
    items.push(newItem);
    writeJsonFile("social-links.json", items);
    revalidatePath("/", "layout");
    return NextResponse.json({ success: true, data: newItem });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function PUT(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const items = readJsonFile("social-links.json", [] as any[]);
    const index = items.findIndex((item: any) => item.id === body.id);
    if (index === -1) {
      return NextResponse.json({ error: "Social link not found" }, { status: 404 });
    }
    items[index] = { ...items[index], ...body };
    writeJsonFile("social-links.json", items);
    revalidatePath("/", "layout");
    return NextResponse.json({ success: true, data: items[index] });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const items = readJsonFile("social-links.json", [] as any[]);
    const filtered = items.filter((p: any) => p.id !== id);
    writeJsonFile("social-links.json", filtered);
    revalidatePath("/", "layout");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
