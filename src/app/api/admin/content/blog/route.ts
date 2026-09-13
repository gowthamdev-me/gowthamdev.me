import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { readJsonFile, writeJsonFile, writeJsonFileAsync } from "@/lib/admin-data";

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
  const data = readJsonFile("blog-posts.json", [] as any[]);
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const items = readJsonFile("blog-posts.json", [] as any[]);
    const newItem = {
      id: `post-${Date.now()}`,
      slug: body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, ""),
      ...body,
      createdAt: new Date().toISOString(),
    };
    items.push(newItem);
    const result = await writeJsonFileAsync("blog-posts.json", items);
    revalidatePath("/", "page");
    revalidatePath("/portfolio", "page");
    revalidatePath("/blog", "page");
    revalidatePath(`/blog/${newItem.slug}`, "page");
    return NextResponse.json({ success: true, data: newItem, syncedToGitHub: result.syncedToGitHub });
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
    const items = readJsonFile("blog-posts.json", [] as any[]);
    const index = items.findIndex((p: any) => p.id === body.id);
    if (index === -1) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    items[index] = { ...items[index], ...body, updatedAt: new Date().toISOString() };
    const result = await writeJsonFileAsync("blog-posts.json", items);
    revalidatePath("/", "page");
    revalidatePath("/portfolio", "page");
    revalidatePath("/blog", "page");
    revalidatePath(`/blog/${items[index].slug}`, "page");
    return NextResponse.json({ success: true, data: items[index], syncedToGitHub: result.syncedToGitHub });
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
    const items = readJsonFile("blog-posts.json", [] as any[]);
    const filtered = items.filter((p: any) => String(p.id) !== String(id));
    const result = await writeJsonFileAsync("blog-posts.json", filtered);
    revalidatePath("/", "page");
    revalidatePath("/portfolio", "page");
    revalidatePath("/blog", "page");
    return NextResponse.json({ success: true, syncedToGitHub: result.syncedToGitHub });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

