"use client";

import { useEffect, useState } from "react";

interface AdminContent {
  profile: any;
  projects: any[];
  experiences: any[];
  blogPosts: any[];
  socialLinks: any[];
}

export function AdminContent() {
  const [content, setContent] = useState<AdminContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/content")
      .then((r) => r.json())
      .then((data) => {
        // Only set if there's actual admin content
        const hasContent =
          data.profile ||
          data.projects?.length > 0 ||
          data.experiences?.length > 0 ||
          data.blogPosts?.length > 0 ||
          data.socialLinks?.length > 0;
        if (hasContent) setContent(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading || !content) return null;

  const hasProjects = content.projects?.length > 0;
  const hasExperiences = content.experiences?.length > 0;
  const hasBlogPosts = content.blogPosts?.length > 0;
  const hasSocialLinks = content.socialLinks?.length > 0;
  const hasProfile = content.profile?.displayName;

  if (!hasProjects && !hasExperiences && !hasBlogPosts && !hasSocialLinks && !hasProfile) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Admin-managed Profile Summary */}
      {hasProfile && (
        <div className="rounded-2xl border border-border/50 bg-card p-6">
          <div className="flex items-start gap-4">
            {content.profile.avatar && (
              <img
                src={content.profile.avatar}
                alt={content.profile.displayName}
                className="w-16 h-16 rounded-2xl object-cover"
              />
            )}
            <div>
              <h3 className="text-lg font-bold">{content.profile.displayName}</h3>
              {content.profile.jobTitle && (
                <p className="text-sm text-muted-foreground">{content.profile.jobTitle}</p>
              )}
              {content.profile.bio && (
                <p className="text-sm text-muted-foreground mt-1">{content.profile.bio}</p>
              )}
            </div>
          </div>
          {content.profile.about && (
            <p className="mt-4 text-sm text-muted-foreground whitespace-pre-wrap">
              {content.profile.about}
            </p>
          )}
        </div>
      )}

      {/* Admin Blog Posts */}
      {hasBlogPosts && (
        <div className="rounded-2xl border border-border/50 bg-card p-6">
          <h2 className="text-xl font-bold mb-4">Latest Posts</h2>
          <div className="space-y-4">
            {content.blogPosts.map((post: any) => (
              <article key={post.id} className="group">
                <div className="flex items-start gap-4">
                  {post.coverImage && (
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-24 h-16 rounded-xl object-cover shrink-0"
                    />
                  )}
                  <div className="min-w-0">
                    <h3 className="font-semibold group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      {post.category && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                          {post.category}
                        </span>
                      )}
                      {post.createdAt && (
                        <span className="text-xs text-muted-foreground">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {post.content && (
                  <div className="mt-3 text-sm text-muted-foreground whitespace-pre-wrap">
                    {post.content.length > 300
                      ? post.content.substring(0, 300) + "..."
                      : post.content}
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>
      )}

      {/* Admin Projects */}
      {hasProjects && (
        <div className="rounded-2xl border border-border/50 bg-card p-6">
          <h2 className="text-xl font-bold mb-4">Projects</h2>
          <div className="space-y-4">
            {content.projects.map((project: any) => (
              <div key={project.id} className="flex items-start gap-4">
                {project.logo && (
                  <img
                    src={project.logo}
                    alt={project.title}
                    className="w-12 h-12 rounded-xl object-cover shrink-0"
                  />
                )}
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{project.title}</h3>
                    {project.period && (
                      <span className="text-xs text-muted-foreground">
                        {project.period}
                      </span>
                    )}
                  </div>
                  {project.description && (
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {project.description}
                    </p>
                  )}
                  {project.skills && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {String(project.skills)
                        .split(",")
                        .map((s: string, i: number) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-md bg-secondary text-xs text-secondary-foreground"
                          >
                            {s.trim()}
                          </span>
                        ))}
                    </div>
                  )}
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-2"
                    >
                      View Project →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Admin Experiences */}
      {hasExperiences && (
        <div className="rounded-2xl border border-border/50 bg-card p-6">
          <h2 className="text-xl font-bold mb-4">Work Experience</h2>
          <div className="space-y-4">
            {content.experiences.map((exp: any) => (
              <div key={exp.id} className="flex items-start gap-4">
                {exp.companyLogo && (
                  <img
                    src={exp.companyLogo}
                    alt={exp.companyName}
                    className="w-12 h-12 rounded-xl object-cover shrink-0"
                  />
                )}
                <div className="min-w-0">
                  <h3 className="font-semibold">{exp.position}</h3>
                  <div className="text-sm text-muted-foreground">
                    {exp.companyName}
                    {exp.employmentType && ` · ${exp.employmentType}`}
                  </div>
                  {exp.period && (
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {exp.period}
                    </div>
                  )}
                  {exp.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {exp.description}
                    </p>
                  )}
                  {exp.isCurrentEmployer && (
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-green-500/10 text-xs text-green-600 dark:text-green-400">
                      Current
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Admin Social Links */}
      {hasSocialLinks && (
        <div className="rounded-2xl border border-border/50 bg-card p-6">
          <h2 className="text-xl font-bold mb-4">Connect</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {content.socialLinks.map((link: any) => (
              <a
                key={link.id}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
              >
                {link.icon && (
                  <img
                    src={link.icon}
                    alt={link.title}
                    className="w-8 h-8 rounded-lg object-cover"
                  />
                )}
                <div className="min-w-0">
                  <div className="font-medium text-sm">{link.title}</div>
                  {link.description && (
                    <div className="text-xs text-muted-foreground truncate">
                      {link.description}
                    </div>
                  )}
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

