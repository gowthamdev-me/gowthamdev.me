"use client";

import { useEffect, useState } from "react";
import { SocialIcon } from "@/components/social-icon";

interface SocialLink {
  id: string;
  title?: string;
  platform?: string;
  description?: string;
  username?: string;
  href?: string;
  url?: string;
  icon: string;
  showInPortfolio: boolean;
}

export default function AdminSocialLinksPage() {
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<SocialLink | null>(null);
  const [form, setForm] = useState({ title: "", description: "", href: "", icon: "", showInPortfolio: true });
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  const loadLinks = async () => {
    try {
      const res = await fetch("/api/admin/content/social-links", { cache: "no-store" });
      const data = await res.json();
      if (Array.isArray(data)) setLinks(data);
    } catch {}
  };

  useEffect(() => { loadLinks(); }, []);

  const resetForm = () => {
    setForm({ title: "", description: "", href: "", icon: "", showInPortfolio: true });
    setEditing(null);
    setShowForm(false);
  };

  const handleSubmit = async () => {
    try {
      if (editing) {
        await fetch("/api/admin/content/social-links", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, platform: form.title, url: form.href, username: form.description, id: editing.id }),
        });
        setMessage("Social link updated!");
      } else {
        await fetch("/api/admin/content/social-links", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, platform: form.title, url: form.href, username: form.description }),
        });
        setMessage("Social link added!");
      }
      resetForm();
      loadLinks();
    } catch {
      setMessage("Error saving link");
    }
    setTimeout(() => setMessage(""), 3000);
  };

  const handleEdit = (link: SocialLink) => {
    setForm({
      title: link.title || link.platform || "",
      description: link.description || link.username || "",
      href: link.href || link.url || "",
      icon: link.icon || "",
      showInPortfolio: link.showInPortfolio ?? true,
    });
    setEditing(link);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this link?")) return;
    await fetch(`/api/admin/content/social-links?id=${id}`, { method: "DELETE" });
    loadLinks();
    setMessage("Link deleted");
    setTimeout(() => setMessage(""), 3000);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        setForm((prev) => ({ ...prev, icon: data.url }));
        setMessage("Icon uploaded successfully!");
      } else {
        alert(data.error || "Upload failed");
      }
    } catch {
      alert("Failed to upload icon");
    } finally {
      setUploading(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Social Links</h1>
          <p className="text-zinc-400 mt-1">Manage your social media profiles</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(!showForm); }} className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-all">
          {showForm ? "Cancel" : "+ Add Link"}
        </button>
      </div>

      {message && (
        <div className="mb-6 p-4 rounded-xl text-sm bg-green-500/10 border border-green-500/20 text-green-400">{message}</div>
      )}

      {showForm && (
        <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-2xl p-6 mb-6 space-y-4">
          <h2 className="text-lg font-semibold text-white">{editing ? "Edit Social Link" : "Add Social Link"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Platform / Title</label>
              <input type="text" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} className="w-full px-4 py-3 rounded-xl bg-zinc-900/50 border border-zinc-600/50 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all" placeholder="GitHub, LinkedIn, X..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Username / Subtitle</label>
              <input type="text" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} className="w-full px-4 py-3 rounded-xl bg-zinc-900/50 border border-zinc-600/50 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all" placeholder="@username" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">URL</label>
            <input type="url" value={form.href} onChange={(e) => setForm((p) => ({ ...p, href: e.target.value }))} className="w-full px-4 py-3 rounded-xl bg-zinc-900/50 border border-zinc-600/50 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all" placeholder="https://github.com/username" />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Icon (Upload image or paste URL)</label>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-zinc-900 border border-zinc-700 flex items-center justify-center text-white shrink-0">
                <SocialIcon title={form.title || "Icon"} iconUrl={form.icon} size={24} className="w-6 h-6" />
              </div>
              <input type="text" value={form.icon} onChange={(e) => setForm((p) => ({ ...p, icon: e.target.value }))} className="flex-1 px-4 py-3 rounded-xl bg-zinc-900/50 border border-zinc-600/50 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm" placeholder="https://... or upload file" />
              <label className="px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium cursor-pointer transition-all shrink-0 flex items-center gap-2">
                {uploading ? "Uploading..." : "Upload File"}
                <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} disabled={uploading} />
              </label>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="showInPortfolio" checked={form.showInPortfolio} onChange={(e) => setForm((p) => ({ ...p, showInPortfolio: e.target.checked }))} className="rounded border-zinc-600" />
            <label htmlFor="showInPortfolio" className="text-sm text-zinc-300">Show in Portfolio Page</label>
          </div>
          <button onClick={handleSubmit} className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all">
            {editing ? "Update Link" : "Add Link"}
          </button>
        </div>
      )}

      <div className="space-y-3">
        {links.length === 0 ? (
          <div className="text-center py-16 text-zinc-500">
            <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            No social links yet. Click &quot;Add Link&quot; to start.
          </div>
        ) : (
          links.map((link) => {
            const displayTitle = link.title || link.platform || "";
            const displayHref = link.href || link.url || "";
            const displayDesc = link.description || link.username || "";
            return (
              <div key={link.id} className="bg-zinc-800/50 border border-zinc-700/50 rounded-2xl p-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-700/50 flex items-center justify-center text-white shrink-0">
                    <SocialIcon title={displayTitle} iconUrl={link.icon} size={20} className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-white">{displayTitle}</h3>
                    <p className="text-sm text-zinc-400 truncate">{displayDesc} &middot; <a href={displayHref} target="_blank" rel="noopener" className="text-blue-400 hover:underline">{displayHref}</a></p>
                  </div>
                </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleEdit(link)}
                  title="Edit link"
                  className="p-2 rounded-lg hover:bg-blue-500/10 text-zinc-400 hover:text-blue-400 transition-all"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  type="button"
                  title={link.showInPortfolio !== false ? "Visible on portfolio — click to hide" : "Hidden from portfolio — click to show"}
                  onClick={async () => {
                    const nextVal = !(link.showInPortfolio !== false);
                    setLinks((prev) => prev.map((l) => l.id === link.id ? { ...l, showInPortfolio: nextVal } : l));
                    try {
                      await fetch("/api/admin/content/social-links", {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ ...link, showInPortfolio: nextVal }),
                      });
                    } catch {
                      loadLinks();
                    }
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                    link.showInPortfolio !== false
                      ? "text-green-400 bg-green-500/10 border-green-500/30 hover:bg-green-500/20"
                      : "text-zinc-400 bg-zinc-700/40 border-zinc-600/50 hover:bg-zinc-700/60"
                  }`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {link.showInPortfolio !== false ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878l4.242 4.242M21 21l-4.35-4.35" />
                    )}
                  </svg>
                  <span>{link.showInPortfolio !== false ? "Visible" : "Hidden"}</span>
                </button>
                <button onClick={() => handleDelete(link.id)} title="Delete link" className="p-2 rounded-lg hover:bg-red-500/10 text-zinc-400 hover:text-red-400 transition-all">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            </div>
            );
          })
        )}
      </div>
    </div>
  );
}
