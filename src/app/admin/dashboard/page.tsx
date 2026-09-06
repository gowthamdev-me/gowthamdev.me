"use client";

import { useEffect, useState, useCallback } from "react";

type SectionVisibility = {
  aboutMe: boolean;
  socialLinks: boolean;
  techStack: boolean;
  experiences: boolean;
  blog: boolean;
  projects: boolean;
  awards: boolean;
  certifications: boolean;
};

const defaultSectionVisibility: SectionVisibility = {
  aboutMe: true,
  socialLinks: true,
  techStack: true,
  experiences: true,
  blog: true,
  projects: true,
  awards: true,
  certifications: true,
};

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    projects: 0,
    experiences: 0,
    blogPosts: 0,
    socialLinks: 0,
    techStack: 0,
    uploads: 0,
  });
  const [seeding, setSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState<string | null>(null);
  const [sectionVisibility, setSectionVisibility] = useState<SectionVisibility>(
    defaultSectionVisibility
  );
  const [updatingSection, setUpdatingSection] = useState<keyof SectionVisibility | null>(null);

  const loadStats = useCallback(async () => {
    try {
      const [projects, experiences, blog, socialLinks, techStack, uploads, profile] =
        await Promise.all([
          fetch("/api/admin/content/projects", { cache: "no-store" }).then((r) => r.json()),
          fetch("/api/admin/content/experiences", { cache: "no-store" }).then((r) => r.json()),
          fetch("/api/admin/content/blog", { cache: "no-store" }).then((r) => r.json()),
          fetch("/api/admin/content/social-links", { cache: "no-store" }).then((r) => r.json()),
          fetch("/api/admin/content/tech-stack", { cache: "no-store" }).then((r) => r.json()),
          fetch("/api/admin/upload", { cache: "no-store" }).then((r) => r.json()),
          fetch("/api/admin/content/profile", { cache: "no-store" }).then((r) => r.json()),
        ]);

      setStats({
        projects: Array.isArray(projects) ? projects.length : 0,
        experiences: Array.isArray(experiences) ? experiences.length : 0,
        blogPosts: Array.isArray(blog) ? blog.length : 0,
        socialLinks: Array.isArray(socialLinks) ? socialLinks.length : 0,
        techStack: Array.isArray(techStack) ? techStack.length : 0,
        uploads: Array.isArray(uploads) ? uploads.length : 0,
      });

      setSectionVisibility({
        ...defaultSectionVisibility,
        ...(profile?.sectionVisibility ?? {}),
      });
    } catch {
      // Stats will stay at 0
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const handleSeedData = async () => {
    setSeeding(true);
    setSeedResult(null);
    try {
      const res = await fetch("/api/admin/seed", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setSeedResult(
          `Seeded: ${data.counts.projects} projects, ${data.counts.experiences} experiences, ${data.counts.blogPosts} blog posts, ${data.counts.socialLinks} social links, ${data.counts.techStack} tech stack items, and profile data.`
        );
        // Reload stats
        await loadStats();
      } else {
        setSeedResult(`Error: ${data.error}`);
      }
    } catch (err) {
      setSeedResult(`Error: ${String(err)}`);
    } finally {
      setSeeding(false);
    }
  };

  const toggleSectionVisibility = async (section: keyof SectionVisibility) => {
    const prevVisibility = { ...sectionVisibility };
    const nextVal = !(sectionVisibility[section] ?? true);

    // Optimistic update for immediate visual feedback
    setSectionVisibility((prev) => ({
      ...prev,
      [section]: nextVal,
    }));
    setUpdatingSection(section);

    try {
      const profileRes = await fetch("/api/admin/content/profile", { cache: "no-store" });
      const profile = await profileRes.json();

      if (profile?.error) {
        setSectionVisibility(prevVisibility);
        setSeedResult("Error: Failed to load profile settings");
        return;
      }

      const nextSectionVisibility = {
        ...defaultSectionVisibility,
        ...(profile?.sectionVisibility ?? {}),
        [section]: nextVal,
      };

      const saveRes = await fetch("/api/admin/content/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...profile,
          sectionVisibility: nextSectionVisibility,
        }),
      });

      if (!saveRes.ok) {
        setSectionVisibility(prevVisibility);
        setSeedResult("Error: Failed to update section visibility");
        return;
      }

      setSectionVisibility(nextSectionVisibility);
      setSeedResult(null);
    } catch {
      setSectionVisibility(prevVisibility);
      setSeedResult("Error: Failed to update section visibility");
    } finally {
      setUpdatingSection(null);
    }
  };

  const cards = [
    { label: "Projects", count: stats.projects, color: "blue", href: "/admin/dashboard/projects" },
    { label: "Experiences", count: stats.experiences, color: "green", href: "/admin/dashboard/experiences" },
    { label: "Blog Posts", count: stats.blogPosts, color: "purple", href: "/admin/dashboard/blog" },
    { label: "Social Links", count: stats.socialLinks, color: "orange", href: "/admin/dashboard/social-links" },
    { label: "Tech Stack", count: stats.techStack, color: "cyan", href: "/admin/dashboard/tech-stack" },
    { label: "Uploads", count: stats.uploads, color: "pink", href: "/admin/dashboard/uploads" },
  ];

  const colorClasses: Record<string, string> = {
    blue: "from-blue-600/20 to-blue-800/20 border-blue-500/30 text-blue-400",
    green: "from-green-600/20 to-green-800/20 border-green-500/30 text-green-400",
    purple: "from-purple-600/20 to-purple-800/20 border-purple-500/30 text-purple-400",
    orange: "from-orange-600/20 to-orange-800/20 border-orange-500/30 text-orange-400",
    pink: "from-pink-600/20 to-pink-800/20 border-pink-500/30 text-pink-400",
    cyan: "from-cyan-600/20 to-cyan-800/20 border-cyan-500/30 text-cyan-400",
  };

  const isEmpty = stats.projects === 0 && stats.experiences === 0 && stats.blogPosts === 0 && stats.socialLinks === 0;

  const portfolioSections: Array<{
    key: keyof SectionVisibility;
    label: string;
    description: string;
  }> = [
    {
      key: "aboutMe",
      label: "About Me",
      description: "About Me panel above social links",
    },
    {
      key: "socialLinks",
      label: "Social Links",
      description: "Social links section",
    },
    {
      key: "techStack",
      label: "Tech Stack",
      description: "Technology stack section",
    },
    {
      key: "experiences",
      label: "Experience",
      description: "Experience section",
    },
    {
      key: "blog",
      label: "Blog",
      description: "Latest posts section",
    },
    {
      key: "projects",
      label: "Projects",
      description: "Projects showcase section",
    },
    {
      key: "awards",
      label: "Honors & Awards",
      description: "Awards and honors section",
    },
    {
      key: "certifications",
      label: "Certifications",
      description: "Certifications section",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-zinc-400 mt-1">
          Welcome back! Manage your portfolio content here.
        </p>
      </div>

      {/* Seed Existing Data Banner */}
      {isEmpty && (
        <div className="mb-6 bg-gradient-to-r from-amber-600/20 to-orange-600/20 border border-amber-500/30 rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0">
              <svg className="w-6 h-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-amber-300">Import Existing Data</h3>
              <p className="text-amber-200/70 text-sm mt-1">
                Your portfolio already has projects, experiences, blog posts, and social links in the codebase.
                Click below to import them into the admin panel so you can manage everything from here.
              </p>
            </div>
            <button
              onClick={handleSeedData}
              disabled={seeding}
              title="Import existing portfolio data into admin"
              className="px-6 py-3 bg-amber-500 hover:bg-amber-400 disabled:bg-amber-600 disabled:opacity-50 text-black font-semibold rounded-xl transition-all shrink-0"
            >
              {seeding ? "Importing..." : "Import Existing Data"}
            </button>
          </div>
        </div>
      )}

      {/* Seed button also available when data exists */}
      {!isEmpty && (
        <div className="mb-6 flex items-center gap-3">
          <button
            onClick={handleSeedData}
            disabled={seeding}
            title="Re-import existing portfolio data (overwrites current admin data)"
            className="px-4 py-2 bg-zinc-700/50 hover:bg-zinc-700 disabled:opacity-50 text-zinc-300 text-sm font-medium rounded-xl border border-zinc-600/50 transition-all"
          >
            {seeding ? "Importing..." : "Re-import Existing Data"}
          </button>
          <span className="text-xs text-zinc-500">Overwrites admin data with portfolio source data</span>
        </div>
      )}

      {/* Seed Result */}
      {seedResult && (
        <div className={`mb-6 p-4 rounded-xl border text-sm ${
          seedResult.startsWith("Error")
            ? "bg-red-500/10 border-red-500/30 text-red-400"
            : "bg-green-500/10 border-green-500/30 text-green-400"
        }`}>
          {seedResult}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        {cards.map((card) => (
          <a
            key={card.label}
            href={card.href}
            className={`bg-gradient-to-br ${colorClasses[card.color]} border rounded-2xl p-6 hover:scale-[1.02] transition-transform`}
          >
            <div className="text-3xl font-bold mb-1">{card.count}</div>
            <div className="text-sm opacity-80">{card.label}</div>
          </a>
        ))}
      </div>

      {/* Section Visibility Controls */}
      <div className="mb-8 bg-zinc-800/50 border border-zinc-700/50 rounded-2xl p-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-white">Portfolio Section Visibility</h2>
          <p className="text-sm text-zinc-400 mt-1">
            Hide or show complete sections on the main portfolio page.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {portfolioSections.map((section) => {
            const isVisible = sectionVisibility[section.key];
            const isUpdating = updatingSection === section.key;

            return (
              <div
                key={section.key}
                className="p-4 rounded-xl border border-zinc-700/50 bg-zinc-900/40 flex items-center justify-between gap-3"
              >
                <div>
                  <div className="font-medium text-white">{section.label}</div>
                  <div className="text-xs text-zinc-400 mt-0.5">{section.description}</div>
                </div>

                <button
                  onClick={() => toggleSectionVisibility(section.key)}
                  disabled={isUpdating}
                  title={isVisible ? "Hide section" : "Show section"}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                    isVisible
                      ? "text-green-300 bg-green-500/10 border-green-500/30 hover:bg-green-500/15"
                      : "text-zinc-300 bg-zinc-700/40 border-zinc-600/50 hover:bg-zinc-700/60"
                  } ${isUpdating ? "opacity-60 cursor-not-allowed" : ""}`}
                >
                  {isUpdating ? "Saving..." : isVisible ? "Visible" : "Hidden"}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-2xl p-6">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <a
            href="/admin/dashboard/profile"
            className="flex items-center gap-3 p-4 rounded-xl bg-zinc-700/30 hover:bg-zinc-700/50 border border-zinc-600/30 transition-all"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-600/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <div className="font-medium text-white">Edit Profile</div>
              <div className="text-xs text-zinc-400">Update your info</div>
            </div>
          </a>
          <a
            href="/admin/dashboard/projects"
            className="flex items-center gap-3 p-4 rounded-xl bg-zinc-700/30 hover:bg-zinc-700/50 border border-zinc-600/30 transition-all"
          >
            <div className="w-10 h-10 rounded-lg bg-green-600/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div>
              <div className="font-medium text-white">Add Project</div>
              <div className="text-xs text-zinc-400">Showcase your work</div>
            </div>
          </a>
          <a
            href="/admin/dashboard/blog"
            className="flex items-center gap-3 p-4 rounded-xl bg-zinc-700/30 hover:bg-zinc-700/50 border border-zinc-600/30 transition-all"
          >
            <div className="w-10 h-10 rounded-lg bg-purple-600/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div>
              <div className="font-medium text-white">Write Blog Post</div>
              <div className="text-xs text-zinc-400">Share your thoughts</div>
            </div>
          </a>
          <a
            href="/admin/dashboard/experiences"
            className="flex items-center gap-3 p-4 rounded-xl bg-zinc-700/30 hover:bg-zinc-700/50 border border-zinc-600/30 transition-all"
          >
            <div className="w-10 h-10 rounded-lg bg-teal-600/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <div className="font-medium text-white">Manage Experience</div>
              <div className="text-xs text-zinc-400">Work history</div>
            </div>
          </a>
          <a
            href="/admin/dashboard/social-links"
            className="flex items-center gap-3 p-4 rounded-xl bg-zinc-700/30 hover:bg-zinc-700/50 border border-zinc-600/30 transition-all"
          >
            <div className="w-10 h-10 rounded-lg bg-orange-600/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <div>
              <div className="font-medium text-white">Social Links</div>
              <div className="text-xs text-zinc-400">Your online presence</div>
            </div>
          </a>
          <a
            href="/admin/dashboard/awards"
            className="flex items-center gap-3 p-4 rounded-xl bg-zinc-700/30 hover:bg-zinc-700/50 border border-zinc-600/30 transition-all"
          >
            <div className="w-10 h-10 rounded-lg bg-yellow-600/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <div>
              <div className="font-medium text-white">Honors &amp; Awards</div>
              <div className="text-xs text-zinc-400">Manage awards</div>
            </div>
          </a>
          <a
            href="/admin/dashboard/certifications"
            className="flex items-center gap-3 p-4 rounded-xl bg-zinc-700/30 hover:bg-zinc-700/50 border border-zinc-600/30 transition-all"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-600/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <div className="font-medium text-white">Certifications</div>
              <div className="text-xs text-zinc-400">Manage certifications</div>
            </div>
          </a>
          <a
            href="/admin/dashboard/uploads"
            className="flex items-center gap-3 p-4 rounded-xl bg-zinc-700/30 hover:bg-zinc-700/50 border border-zinc-600/30 transition-all"
          >
            <div className="w-10 h-10 rounded-lg bg-pink-600/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <div className="font-medium text-white">Upload Files</div>
              <div className="text-xs text-zinc-400">Images & documents</div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}

