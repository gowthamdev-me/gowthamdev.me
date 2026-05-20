import { NextResponse } from "next/server";
import { readJsonFile } from "@/lib/admin-data";

export const dynamic = "force-dynamic";

// Public API - no auth required - serves content for portfolio display
export async function GET() {
  const profile = readJsonFile("profile.json", null);
  const projects = readJsonFile("projects.json", []);
  const experiences = readJsonFile("experiences.json", []);
  const blogPosts = readJsonFile("blog-posts.json", []);
  const socialLinks = readJsonFile("social-links.json", []);

  return NextResponse.json({
    profile,
    projects,
    experiences,
    blogPosts: (blogPosts as any[]).filter((p: any) => p.published !== false),
    socialLinks,
  });
}

