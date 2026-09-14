"use client";

import { useEffect, useState, useRef } from "react";
import {
  Flame,
  Snowflake,
  Trees,
  Droplets,
  Sun,
  Sparkles,
  Code,
  Terminal,
  Zap,
  Star,
  Upload,
  X,
} from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: string;
  coverImage: string;
  icon?: string;
  tags: string;
  published: boolean;
  showInPortfolio: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const PRESET_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  flame: Flame,
  snowflake: Snowflake,
  trees: Trees,
  droplets: Droplets,
  sun: Sun,
  sparkles: Sparkles,
  code: Code,
  terminal: Terminal,
  zap: Zap,
  star: Star,
};

function isImageUrl(val: string): boolean {
  if (!val) return false;
  return (
    val.startsWith("/") ||
    val.startsWith("http://") ||
    val.startsWith("https://") ||
    val.startsWith("data:") ||
    /\.(png|jpg|jpeg|svg|webp|gif|ico)$/i.test(val)
  );
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [form, setForm] = useState({
    title: "",
    content: "",
    excerpt: "",
    category: "",
    coverImage: "",
    icon: "",
    tags: "",
    published: true,
    showInPortfolio: true,
  });
  const [message, setMessage] = useState("");
  const formRef = useRef<HTMLDivElement>(null);

  const loadPosts = async () => {
    try {
      const res = await fetch("/api/admin/content/blog", { cache: "no-store" });
      const data = await res.json();
      if (Array.isArray(data)) setPosts(data);
    } catch {}
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const resetForm = () => {
    setForm({
      title: "",
      content: "",
      excerpt: "",
      category: "",
      coverImage: "",
      icon: "",
      tags: "",
      published: true,
      showInPortfolio: true,
    });
    setEditing(null);
    setShowForm(false);
  };

  const handleSubmit = async () => {
    try {
      if (editing) {
        await fetch("/api/admin/content/blog", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, id: editing.id }),
        });
        setMessage("Blog post updated!");
      } else {
        await fetch("/api/admin/content/blog", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        setMessage("Blog post created!");
      }
      resetForm();
      loadPosts();
    } catch {
      setMessage("Error saving blog post");
    }
    setTimeout(() => setMessage(""), 3000);
  };

  const handleEdit = (post: BlogPost) => {
    setForm({
      title: post.title || "",
      content: post.content || "",
      excerpt: post.excerpt || "",
      category: post.category || "",
      coverImage: post.coverImage || "",
      icon: post.icon || "",
      tags: post.tags || "",
      published: post.published ?? true,
      showInPortfolio: post.showInPortfolio ?? true,
    });
    setEditing(post);
    setShowForm(true);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleDelete = async (id: string) => {
    setPosts((prev) => prev.filter((p) => String(p.id) !== String(id)));
    setMessage("Blog post deleted");
    setTimeout(() => setMessage(""), 3000);

    try {
      const res = await fetch(
        `/api/admin/content/blog?id=${encodeURIComponent(id)}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        }
      );
      if (!res.ok) {
        loadPosts();
      }
    } catch {
      loadPosts();
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) setForm((p) => ({ ...p, coverImage: data.url }));
    } catch {}
  };

  const handleIconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) setForm((p) => ({ ...p, icon: data.url }));
    } catch {}
  };

  const renderIconBadge = (iconVal?: string, size = "md") => {
    const isLg = size === "lg";
    const containerClasses = isLg
      ? "w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center shrink-0 border border-zinc-200 dark:border-zinc-700"
      : "w-9 h-9 rounded-full bg-white shadow flex items-center justify-center shrink-0 border border-zinc-200 dark:border-zinc-700";

    const imgClasses = isLg
      ? "w-6 h-6 object-contain rounded-full"
      : "w-5 h-5 object-contain rounded-full";

    const iconClasses = isLg ? "w-6 h-6 text-red-500" : "w-4 h-4 text-red-500";

    if (!iconVal) {
      return (
        <div className={containerClasses}>
          <Flame className={iconClasses} />
        </div>
      );
    }

    if (isImageUrl(iconVal)) {
      return (
        <div className={containerClasses}>
          <img src={iconVal} alt="Icon" className={imgClasses} />
        </div>
      );
    }

    const IconComp = PRESET_ICONS[iconVal.toLowerCase()] || Flame;
    return (
      <div className={containerClasses}>
        <IconComp className={iconClasses} />
      </div>
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Blog Posts</h1>
          <p className="text-zinc-400 mt-1">
            Write, edit images, titles, and customize icons/logos
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
          }}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-all"
        >
          {showForm ? "Cancel" : "+ New Post"}
        </button>
      </div>

      {message && (
        <div className="mb-6 p-4 rounded-xl text-sm bg-green-500/10 border border-green-500/20 text-green-400">
          {message}
        </div>
      )}

      {showForm && (
        <div
          ref={formRef}
          className="bg-zinc-800/50 border border-zinc-700/50 rounded-2xl p-6 mb-6 space-y-5"
        >
          <h2 className="text-lg font-semibold text-white">
            {editing ? "Edit Post" : "New Blog Post"}
          </h2>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Title
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl bg-zinc-900/50 border border-zinc-600/50 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium text-base"
              placeholder="Post title"
            />
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Excerpt (short summary)
            </label>
            <input
              type="text"
              value={form.excerpt}
              onChange={(e) =>
                setForm((p) => ({ ...p, excerpt: e.target.value }))
              }
              className="w-full px-4 py-3 rounded-xl bg-zinc-900/50 border border-zinc-600/50 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm"
              placeholder="A brief summary of the post..."
            />
          </div>

          {/* Media Section: Cover Image & Card Icon / Logo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-4 rounded-xl bg-zinc-900/30 border border-zinc-700/40">
            {/* Cover Image */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Cover Image
              </label>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  {form.coverImage ? (
                    <img
                      src={form.coverImage}
                      alt="Cover preview"
                      className="w-20 h-14 rounded-lg object-cover border border-zinc-600/50 shrink-0"
                    />
                  ) : (
                    <div className="w-20 h-14 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-500 text-xs shrink-0">
                      No cover
                    </div>
                  )}
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-700/50 hover:bg-zinc-700 border border-zinc-600/50 text-xs font-semibold text-zinc-200 transition-all">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Cover</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <input
                  type="text"
                  value={form.coverImage}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, coverImage: e.target.value }))
                  }
                  className="w-full px-3 py-2 rounded-lg bg-zinc-900/50 border border-zinc-600/50 text-white text-xs placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  placeholder="Paste image URL or upload above"
                />
              </div>
            </div>

            {/* Card Icon / Logo */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-zinc-300">
                  Card Icon / Logo
                </label>
                <span className="text-[11px] text-zinc-500">
                  Circle badge on blog card
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  {renderIconBadge(form.icon, "lg")}
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-xs font-semibold text-blue-300 transition-all">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Icon / Logo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleIconUpload}
                      className="hidden"
                    />
                  </label>
                  {form.icon && (
                    <button
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, icon: "" }))}
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                      title="Clear custom icon"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <input
                  type="text"
                  value={form.icon}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, icon: e.target.value }))
                  }
                  className="w-full px-3 py-2 rounded-lg bg-zinc-900/50 border border-zinc-600/50 text-white text-xs placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  placeholder="Upload logo/icon, paste URL, or pick a preset below"
                />

                {/* Quick preset icons */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[11px] text-zinc-500 mr-1">Presets:</span>
                  {[
                    "flame",
                    "snowflake",
                    "trees",
                    "droplets",
                    "sun",
                    "sparkles",
                    "code",
                    "terminal",
                    "zap",
                    "star",
                  ].map((name) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, icon: name }))}
                      className={`px-2 py-0.5 rounded-md text-[11px] font-medium border transition-all ${
                        form.icon === name
                          ? "bg-blue-600 text-white border-blue-500"
                          : "bg-zinc-800 text-zinc-400 border-zinc-700 hover:bg-zinc-700 hover:text-white"
                      }`}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Content (Markdown supported)
            </label>
            <textarea
              value={form.content}
              onChange={(e) =>
                setForm((p) => ({ ...p, content: e.target.value }))
              }
              rows={12}
              className="w-full px-4 py-3 rounded-xl bg-zinc-900/50 border border-zinc-600/50 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-y font-mono text-sm"
              placeholder="Write your blog post in Markdown..."
            />
          </div>

          {/* Category & Tags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Category
              </label>
              <input
                type="text"
                value={form.category}
                onChange={(e) =>
                  setForm((p) => ({ ...p, category: e.target.value }))
                }
                className="w-full px-4 py-3 rounded-xl bg-zinc-900/50 border border-zinc-600/50 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                placeholder="Technology"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={form.tags}
                onChange={(e) =>
                  setForm((p) => ({ ...p, tags: e.target.value }))
                }
                className="w-full px-4 py-3 rounded-xl bg-zinc-900/50 border border-zinc-600/50 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                placeholder="react, web, tutorial"
              />
            </div>
          </div>

          {/* Published & Portfolio checkboxes */}
          <div className="flex items-center gap-5 pt-1">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="published"
                checked={form.published}
                onChange={(e) =>
                  setForm((p) => ({ ...p, published: e.target.checked }))
                }
                className="w-4 h-4 rounded border-zinc-600 accent-blue-600"
              />
              <label htmlFor="published" className="text-sm text-zinc-300">
                Published
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="showInPortfolio"
                checked={form.showInPortfolio}
                onChange={(e) =>
                  setForm((p) => ({ ...p, showInPortfolio: e.target.checked }))
                }
                className="w-4 h-4 rounded border-zinc-600 accent-blue-600"
              />
              <label htmlFor="showInPortfolio" className="text-sm text-zinc-300">
                Show in Portfolio Page
              </label>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <button
              onClick={handleSubmit}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all shadow-lg"
            >
              {editing ? "Update Post" : "Publish Post"}
            </button>
          </div>
        </div>
      )}

      {/* Posts list */}
      <div className="space-y-3">
        {posts.length === 0 ? (
          <div className="text-center py-16 text-zinc-500">
            <svg
              className="w-12 h-12 mx-auto mb-3 opacity-50"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            No blog posts yet. Click &quot;New Post&quot; to write one.
          </div>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              className="bg-zinc-800/50 border border-zinc-700/50 rounded-2xl p-5 flex items-start justify-between gap-4"
            >
              <div className="flex items-start gap-4 flex-1 min-w-0">
                {/* Cover image & Icon badge */}
                <div className="relative shrink-0">
                  {post.coverImage ? (
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-20 h-14 rounded-lg object-cover border border-zinc-600/50"
                    />
                  ) : (
                    <div className="w-20 h-14 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-500 text-xs">
                      No cover
                    </div>
                  )}
                  {/* Miniature badge preview */}
                  <div className="absolute -bottom-2 -right-2">
                    {renderIconBadge(post.icon, "sm")}
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-white truncate text-base">
                      {post.title}
                    </h3>
                    <span
                      className={`px-2 py-0.5 rounded-md text-xs font-medium ${
                        post.published
                          ? "bg-green-500/10 text-green-400 border border-green-500/20"
                          : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                      }`}
                    >
                      {post.published ? "Published" : "Draft"}
                    </span>
                  </div>
                  {post.excerpt && (
                    <p className="text-sm text-zinc-400 mt-1 line-clamp-1">
                      {post.excerpt}
                    </p>
                  )}
                  <div className="flex items-center gap-3 mt-1.5">
                    {post.category && (
                      <span className="text-xs text-zinc-500 font-medium">
                        {post.category}
                      </span>
                    )}
                    {post.createdAt && (
                      <span className="text-xs text-zinc-600">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-3 shrink-0">
                <button
                  type="button"
                  title={
                    post.showInPortfolio !== false
                      ? "Visible on portfolio — click to hide"
                      : "Hidden from portfolio — click to show"
                  }
                  onClick={async () => {
                    const nextVal = !(post.showInPortfolio !== false);
                    setPosts((prev) =>
                      prev.map((p) =>
                        p.id === post.id
                          ? { ...p, showInPortfolio: nextVal }
                          : p
                      )
                    );
                    try {
                      await fetch("/api/admin/content/blog", {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          id: post.id,
                          showInPortfolio: nextVal,
                        }),
                      });
                    } catch {
                      loadPosts();
                    }
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                    post.showInPortfolio !== false
                      ? "text-green-400 bg-green-500/10 border-green-500/30 hover:bg-green-500/20"
                      : "text-zinc-400 bg-zinc-700/40 border-zinc-600/50 hover:bg-zinc-700/60"
                  }`}
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    {post.showInPortfolio !== false ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878l4.242 4.242M21 21l-4.35-4.35"
                      />
                    )}
                  </svg>
                  <span>
                    {post.showInPortfolio !== false ? "Visible" : "Hidden"}
                  </span>
                </button>
                <button
                  type="button"
                  title="Edit post"
                  onClick={() => handleEdit(post)}
                  className="p-2 rounded-lg hover:bg-zinc-700/50 text-zinc-400 hover:text-white transition-all"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>
                <button
                  type="button"
                  title="Delete post"
                  onClick={() => handleDelete(post.id)}
                  className="p-2 rounded-lg hover:bg-red-500/10 text-zinc-400 hover:text-red-400 transition-all"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
