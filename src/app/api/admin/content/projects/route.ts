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
  const data = readJsonFile("projects.json", [] as any[]);
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const projects = readJsonFile("projects.json", [] as any[]);
    const newProject = {
      id: `project-${Date.now()}`,
      ...body,
      createdAt: new Date().toISOString(),
    };
    projects.push(newProject);
    const result = await writeJsonFileAsync("projects.json", projects);
    revalidatePath("/", "page");
    revalidatePath("/portfolio", "page");
    return NextResponse.json({ success: true, data: newProject, syncedToGitHub: result.syncedToGitHub });
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
    
    // Support reordering: if an array is passed, overwrite the entire projects list
    if (Array.isArray(body)) {
      const result = await writeJsonFileAsync("projects.json", body);
      revalidatePath("/", "page");
      revalidatePath("/portfolio", "page");
      return NextResponse.json({ success: true, data: body, syncedToGitHub: result.syncedToGitHub });
    }

    const projects = readJsonFile("projects.json", [] as any[]);
    const index = projects.findIndex((p: any) => p.id === body.id);
    if (index === -1) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    projects[index] = { ...projects[index], ...body };
    const result = await writeJsonFileAsync("projects.json", projects);
    revalidatePath("/", "page");
    revalidatePath("/portfolio", "page");
    return NextResponse.json({ success: true, data: projects[index], syncedToGitHub: result.syncedToGitHub });
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
      return NextResponse.json({ error: "Missing project id" }, { status: 400 });
    }

    const projects = readJsonFile("projects.json", [] as any[]);
    const filtered = projects.filter((p: any) => String(p.id) !== String(id));
    const result = await writeJsonFileAsync("projects.json", filtered);
    revalidatePath("/", "page");
    revalidatePath("/portfolio", "page");
    return NextResponse.json({ success: true, count: filtered.length, syncedToGitHub: result.syncedToGitHub });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

