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
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const data = readJsonFile("tech-stack.json", [] as any[]);
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const techStack = readJsonFile("tech-stack.json", [] as any[]);
    const newItem = {
      id: `tech-${Date.now()}`,
      ...body,
      createdAt: new Date().toISOString(),
    };
    techStack.push(newItem);
    writeJsonFile("tech-stack.json", techStack);
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
    const techStack = readJsonFile("tech-stack.json", [] as any[]);
    const index = techStack.findIndex((t: any) => t.id === body.id);
    if (index === -1) {
      return NextResponse.json({ error: "Tech stack item not found" }, { status: 404 });
    }
    techStack[index] = { ...techStack[index], ...body };
    writeJsonFile("tech-stack.json", techStack);
    return NextResponse.json({ success: true, data: techStack[index] });
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
    const techStack = readJsonFile("tech-stack.json", [] as any[]);
    const filtered = techStack.filter((t: any) => t.id !== id);
    writeJsonFile("tech-stack.json", filtered);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

