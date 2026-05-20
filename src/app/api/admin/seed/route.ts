import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { writeJsonFile, readJsonFile } from "@/lib/admin-data";
import { PROJECTS } from "@/features/profile/data/projects";
import { EXPERIENCES } from "@/features/profile/data/experiences";
import { SOCIAL_LINKS } from "@/features/profile/data/social-links";
import { TECH_STACK } from "@/features/profile/data/tech-stack";
import { USER } from "@/data/user";
import { getAllPosts } from "@/data/blog";

const SESSION_TOKEN = "admin_session_token_2024";

async function isAuthenticated() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  return session?.value === SESSION_TOKEN;
}

export async function POST() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Seed Profile
    const profileData = {
      firstName: USER.firstName,
      lastName: USER.lastName,
      displayName: USER.displayName,
      bio: USER.bio,
      about: USER.about,
      jobTitle: USER.jobTitle,
      email: USER.email ? atob(USER.email) : "",
      address: USER.address,
      website: USER.website,
      avatar: USER.avatar,
      phoneNumber: USER.phoneNumber,
      pronouns: USER.pronouns,
      gender: USER.gender,
      keywords: USER.keywords,
    };
    writeJsonFile("profile.json", profileData);

    // Seed Projects
    const projectsData = PROJECTS.map((project) => ({
      id: project.id,
      title: project.title,
      description: project.description || "",
      link: project.link || "",
      skills: (project.skills || []).join(", "),
      logo: project.logo || "",
      period: project.period
        ? `${project.period.start}${project.period.end ? " - " + project.period.end : " - Present"}`
        : "",
      createdAt: new Date().toISOString(),
      showInPortfolio: true,
      source: "existing",
    }));
    writeJsonFile("projects.json", projectsData);

    // Seed Experiences
    const experiencesData = EXPERIENCES.map((exp) => ({
      id: exp.id,
      companyName: exp.companyName,
      companyLogo: exp.companyLogo || "",
      position: exp.positions?.map((p) => p.title).join(", ") || "",
      employmentType: exp.positions?.[0]?.employmentType || "",
      period: exp.positions?.[0]?.employmentPeriod
        ? `${exp.positions[0].employmentPeriod.start}${exp.positions[0].employmentPeriod.end ? " - " + exp.positions[0].employmentPeriod.end : " - Present"}`
        : "",
      description: exp.positions
        ?.map(
          (p) =>
            `**${p.title}** (${p.employmentType || ""})\n${p.description || ""}`
        )
        .join("\n\n"),
      skills: exp.positions
        ?.flatMap((p) => p.skills || [])
        .filter((v, i, a) => a.indexOf(v) === i)
        .join(", "),
      isCurrentEmployer: exp.isCurrentEmployer || false,
      showInPortfolio: true,
      createdAt: new Date().toISOString(),
      source: "existing",
    }));
    writeJsonFile("experiences.json", experiencesData);

    // Seed Blog Posts from MDX files
    const allPosts = getAllPosts();
    const blogPostsData = allPosts.map((post) => ({
      id: `post-${post.slug}`,
      slug: post.slug,
      title: post.metadata.title,
      excerpt: post.metadata.description || "",
      content: post.content,
      category: post.metadata.category || "",
      tags: "",
      coverImage: post.metadata.image || "",
      published: true,
      showInPortfolio: true,
      createdAt: post.metadata.createdAt,
      updatedAt: post.metadata.updatedAt || post.metadata.createdAt,
      source: "existing-mdx",
    }));
    writeJsonFile("blog-posts.json", blogPostsData);

    // Seed Social Links
    const socialLinksData = SOCIAL_LINKS.map((link, index) => ({
      id: `social-${index}-${Date.now()}`,
      platform: link.title,
      username: link.description || "",
      url: link.href,
      icon: link.icon || "",
      showInPortfolio: true,
      source: "existing",
    }));
    writeJsonFile("social-links.json", socialLinksData);

    // Seed Tech Stack
    const techStackData = TECH_STACK.map((tech) => ({
      id: `tech-${tech.key}`,
      key: tech.key,
      title: tech.title,
      href: tech.href,
      categories: (tech.categories || []).join(", "),
      theme: tech.theme || false,
      showInPortfolio: true,
      createdAt: new Date().toISOString(),
      source: "existing",
    }));
    writeJsonFile("tech-stack.json", techStackData);

    return NextResponse.json({
      success: true,
      message: "All existing data seeded successfully",
      counts: {
        profile: 1,
        projects: projectsData.length,
        experiences: experiencesData.length,
        blogPosts: blogPostsData.length,
        socialLinks: socialLinksData.length,
        techStack: techStackData.length,
      },
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { error: "Failed to seed data", details: String(error) },
      { status: 500 }
    );
  }
}

