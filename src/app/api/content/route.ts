import { NextResponse } from "next/server";
import { readJsonFile } from "@/lib/admin-data";

export const dynamic = "force-dynamic";

// Public API - no auth required - serves content for portfolio display
export async function GET() {
  try {
    const profile = readJsonFile("profile.json", null);
    const projects = readJsonFile("projects.json", []);
    const experiences = readJsonFile("experiences.json", []);
    const blogPosts = readJsonFile<any[]>("blog-posts.json", []);
    const socialLinks = readJsonFile("social-links.json", []);
    const coverSettings = readJsonFile("cover-settings.json", null);

    return NextResponse.json({
      profile,
      projects,
      experiences,
      blogPosts: blogPosts.filter((p: any) => p.published !== false),
      socialLinks,
      coverSettings,
    });
  } catch (err) {
    console.error("[/api/content] Error:", err);
    return NextResponse.json(
      { error: "Failed to load content" },
      { status: 500 }
    );
  }
}
