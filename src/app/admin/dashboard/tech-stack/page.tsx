"use client";

import { useEffect, useState, useRef } from "react";

interface TechStackItem {
  id: string;
  key: string;
  title: string;
  href: string;
  categories: string;
  theme: boolean;
  showInPortfolio: boolean;
  createdAt?: string;
}

const EMPTY_FORM: Omit<TechStackItem, "id" | "createdAt"> = {
  key: "",
  title: "",
  href: "",
  categories: "",
  theme: false,
  showInPortfolio: true,
};

export default function AdminTechStackPage() {
  const [items, setItems] = useState<TechStackItem[]>([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const loadItems = async () => {
    try {
      const res = await fetch("/api/admin/content/tech-stack", { cache: "no-store" });
      const data = await res.json();
      if (Array.isArray(data)) setItems(data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.key || !form.title) {
      showMessage("error", "Key and Title are required");
      return;
    }
    setSaving(true);
    try {
      const method = editingId ? "PUT" : "POST";
      const body = editingId ? { ...form, id: editingId } : form;
      const res = await fetch("/api/admin/content/tech-stack", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        showMessage("success", editingId ? "Tech stack item updated!" : "Tech stack item added!");
        setForm(EMPTY_FORM);
        setEditingId(null);
        await loadItems();
      } else {
        showMessage("error", data.error || "Failed to save");
      }
    } catch {
      showMessage("error", "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item: TechStackItem) => {
    setForm({
      key: item.key,
      title: item.title,
      href: item.href,
      categories: item.categories || "",
      theme: item.theme || false,
      showInPortfolio: item.showInPortfolio !== false,
    });
    setEditingId(item.id);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleDelete = async (id: string) => {
    setItems((prev) => prev.filter((t) => String(t.id) !== String(id)));
    showMessage("success", "Deleted successfully");

    try {
      const res = await fetch(`/api/admin/content/tech-stack?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (!data.success) {
        await loadItems();
      }
    } catch {
      showMessage("error", "Failed to delete");
      await loadItems();
    }
  };

  const togglePortfolioVisibility = async (item: TechStackItem) => {
    const nextVal = !item.showInPortfolio;
    setItems((prev) => prev.map((t) => t.id === item.id ? { ...t, showInPortfolio: nextVal } : t));
    try {
      const res = await fetch("/api/admin/content/tech-stack", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: item.id,
          showInPortfolio: nextVal,
        }),
      });
      const data = await res.json();
      if (!data.success) {
        await loadItems();
      }
    } catch {
      showMessage("error", "Failed to update visibility");
      loadItems();
    }
  };

  const cancelEdit = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Tech Stack</h1>
        <p className="text-zinc-400 mt-1">
          Manage the technologies displayed in your portfolio&apos;s Stack section.
        </p>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`mb-6 p-4 rounded-xl border text-sm ${
            message.type === "success"
              ? "bg-green-500/10 border-green-500/30 text-green-400"
              : "bg-red-500/10 border-red-500/30 text-red-400"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Form */}
      <div ref={formRef} className="bg-zinc-800/50 border border-zinc-700/50 rounded-2xl p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">
          {editingId ? "Edit Tech Stack Item" : "Add New Tech Stack Item"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">
                Key <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={form.key}
                onChange={(e) => setForm({ ...form, key: e.target.value })}
                placeholder="e.g., react, nextjs2, typescript"
                className="w-full px-4 py-2.5 bg-zinc-700/50 border border-zinc-600/50 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
              />
              <p className="text-xs text-zinc-500 mt-1">Used for icon filename. Icon loads from CDN: tech-stack-icons/[key].svg</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">
                Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g., React, Next.js, TypeScript"
                className="w-full px-4 py-2.5 bg-zinc-700/50 border border-zinc-600/50 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">
                URL
              </label>
              <input
                type="text"
                value={form.href}
                onChange={(e) => setForm({ ...form, href: e.target.value })}
                placeholder="https://react.dev/"
                className="w-full px-4 py-2.5 bg-zinc-700/50 border border-zinc-600/50 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">
                Categories
              </label>
              <input
                type="text"
                value={form.categories}
                onChange={(e) => setForm({ ...form, categories: e.target.value })}
                placeholder="e.g., Language, Framework, Library"
                className="w-full px-4 py-2.5 bg-zinc-700/50 border border-zinc-600/50 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
              />
              <p className="text-xs text-zinc-500 mt-1">Comma-separated categories</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.theme}
                onChange={(e) => setForm({ ...form, theme: e.target.checked })}
                className="w-4 h-4 rounded bg-zinc-700 border-zinc-600 text-blue-500 focus:ring-blue-500/50"
              />
              <span className="text-sm text-zinc-300">Has theme variants (light/dark icons)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.showInPortfolio}
                onChange={(e) => setForm({ ...form, showInPortfolio: e.target.checked })}
                className="w-4 h-4 rounded bg-zinc-700 border-zinc-600 text-blue-500 focus:ring-blue-500/50"
              />
              <span className="text-sm text-zinc-300">Show in Portfolio</span>
            </label>
          </div>

          {/* Icon Preview */}
          {form.key && (
            <div className="flex items-center gap-3 p-3 bg-zinc-700/30 rounded-xl border border-zinc-600/30">
              <span className="text-xs text-zinc-400">Icon Preview:</span>
              {form.theme ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://assets.chanhdai.com/images/tech-stack-icons/${form.key}-light.svg`}
                    alt="Light icon"
                    width={32}
                    height={32}
                    className="bg-white rounded p-0.5"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://assets.chanhdai.com/images/tech-stack-icons/${form.key}-dark.svg`}
                    alt="Dark icon"
                    width={32}
                    height={32}
                    className="bg-zinc-900 rounded p-0.5"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                </>
              ) : (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://assets.chanhdai.com/images/tech-stack-icons/${form.key}.svg`}
                    alt="Icon"
                    width={32}
                    height={32}
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                </>
              )}
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium rounded-xl transition-all"
            >
              {saving ? "Saving..." : editingId ? "Update Item" : "Add Item"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="px-6 py-2.5 bg-zinc-700 hover:bg-zinc-600 text-white font-medium rounded-xl transition-all"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Items List */}
      <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-zinc-700/50">
          <h2 className="text-lg font-semibold">
            All Tech Stack Items ({items.length})
          </h2>
        </div>

        {items.length === 0 ? (
          <div className="p-12 text-center text-zinc-500">
            <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
            <p>No tech stack items yet.</p>
            <p className="text-sm mt-1">Add items above or import existing data from the dashboard.</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-700/50">
            {items.map((item) => (
              <div
                key={item.id}
                className="p-4 flex items-center gap-4 hover:bg-zinc-700/20 transition-colors"
              >
                {/* Icon */}
                <div className="w-10 h-10 rounded-lg bg-zinc-700/50 flex items-center justify-center shrink-0 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://assets.chanhdai.com/images/tech-stack-icons/${item.key}.svg`}
                    alt={item.title}
                    width={28}
                    height={28}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                      (e.target as HTMLImageElement).parentElement!.innerHTML = `<span class="text-xs text-zinc-500 font-mono">${item.key.slice(0, 3)}</span>`;
                    }}
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white">{item.title}</span>
                    <span className="text-xs text-zinc-500 font-mono bg-zinc-700/50 px-1.5 py-0.5 rounded">
                      {item.key}
                    </span>
                    {item.theme && (
                      <span className="text-xs bg-purple-500/20 text-purple-400 px-1.5 py-0.5 rounded border border-purple-500/30">
                        theme
                      </span>
                    )}
                    {!item.showInPortfolio && (
                      <span className="text-xs bg-yellow-500/20 text-yellow-400 px-1.5 py-0.5 rounded border border-yellow-500/30">
                        hidden
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-zinc-500 mt-0.5 truncate">
                    {item.categories && (
                      <span className="mr-3">{item.categories}</span>
                    )}
                    {item.href && (
                      <a href={item.href} target="_blank" rel="noopener noreferrer" className="text-blue-400/70 hover:text-blue-400">
                        {item.href}
                      </a>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => togglePortfolioVisibility(item)}
                    title={item.showInPortfolio ? "Hide from portfolio" : "Show in portfolio"}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                      item.showInPortfolio
                        ? "text-green-400 bg-green-500/10 border-green-500/30 hover:bg-green-500/20"
                        : "text-zinc-400 bg-zinc-700/40 border-zinc-600/50 hover:bg-zinc-700/60"
                    }`}
                  >
                    {item.showInPortfolio ? (
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ) : (
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    )}
                    <span>{item.showInPortfolio ? "Visible" : "Hidden"}</span>
                  </button>
                  <button
                    onClick={() => handleEdit(item)}
                    title="Edit"
                    className="p-2 rounded-lg text-blue-400 hover:bg-blue-500/20 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    title="Delete"
                    className="p-2 rounded-lg text-red-400 hover:bg-red-500/20 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

