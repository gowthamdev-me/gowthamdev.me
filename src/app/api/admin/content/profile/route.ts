import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { readJsonFile, writeJsonFile } from "@/lib/admin-data";

const SESSION_TOKEN = "admin_session_token_2024";

async function isAuthenticated() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  return session?.value === SESSION_TOKEN;
}

// Default profile data
const defaultProfile = {
  displayName: "",
  bio: "",
  about: "",
  jobTitle: "",
  email: "",
  avatar: "",
  cvUrl: "",
  typingWords: ["Web Developer", "Vibe Coder"],
  sectionVisibility: {
    aboutMe: true,
    socialLinks: true,
    techStack: true,
    experiences: true,
    blog: true,
    projects: true,
    awards: true,
    certifications: true,
  },
};


export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const data = readJsonFile("profile.json", defaultProfile);
  return NextResponse.json(data);
}

export async function PUT(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    writeJsonFile("profile.json", body);
    return NextResponse.json({ success: true, data: body });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

