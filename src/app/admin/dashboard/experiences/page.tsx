"use client";

import { useEffect, useState } from "react";

interface Experience {
  id: string;
  companyName: string;
  position: string;
  employmentType: string;
  period: string;
  description: string;
  skills: string;
  companyLogo: string;
  isCurrentEmployer: boolean;
  showInPortfolio: boolean;
  createdAt?: string;
}

export default function AdminExperiencesPage() {
  const [items, setItems] = useState<Experience[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Experience | null>(null);
  const [form, setForm] = useState({
    companyName: "",
    position: "",
    employmentType: "Full-time",
    period: "",
    description: "",
    skills: "",
    companyLogo: "",
    isCurrentEmployer: false,
    showInPortfolio: true,
  });
  const [message, setMessage] = useState("");

  const loadItems = async () => {
    try {
      const res = await fetch("/api/admin/content/experiences", { cache: "no-store" });
      const data = await res.json();
      if (Array.isArray(data)) setItems(data);
    } catch {}
  };

  useEffect(() => { loadItems(); }, []);

  const resetForm = () => {
    setForm({ companyName: "", position: "", employmentType: "Full-time", period: "", description: "", skills: "", companyLogo: "", isCurrentEmployer: false, showInPortfolio: true });
    setEditing(null);
    setShowForm(false);
  };

  const handleSubmit = async () => {
    try {
      if (editing) {
        await fetch("/api/admin/content/experiences", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, id: editing.id }),
        });
        setMessage("Experience updated!");
      } else {
        await fetch("/api/admin/content/experiences", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        setMessage("Experience added!");
      }
      resetForm();
      loadItems();
    } catch {
      setMessage("Error saving experience");
    }
    setTimeout(() => setMessage(""), 3000);
  };

  const handleEdit = (item: Experience) => {
    setForm({
      companyName: item.companyName || "",
      position: item.position || "",
      employmentType: item.employmentType || "Full-time",
      period: item.period || "",
      description: item.description || "",
      skills: item.skills || "",
      companyLogo: item.companyLogo || "",
      isCurrentEmployer: item.isCurrentEmployer || false,
      showInPortfolio: item.showInPortfolio ?? true,
    });
    setEditing(item);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    setItems((prev) => prev.filter((item) => String(item.id) !== String(id)));
    setMessage("Experience deleted");
    setTimeout(() => setMessage(""), 3000);

    try {
      const res = await fetch(`/api/admin/content/experiences?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) {
        loadItems();
      }
    } catch {
      loadItems();
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Work Experience</h1>
          <p className="text-zinc-400 mt-1">Manage your work history</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(!showForm); }}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-all"
        >
          {showForm ? "Cancel" : "+ Add Experience"}
        </button>
      </div>

      {message && (
        <div className="mb-6 p-4 rounded-xl text-sm bg-green-500/10 border border-green-500/20 text-green-400">
          {message}
        </div>
      )}

      {showForm && (
        <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-2xl p-6 mb-6 space-y-4">
          <h2 className="text-lg font-semibold text-white">{editing ? "Edit Experience" : "Add Experience"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Company Name</label>
              <input type="text" value={form.companyName} onChange={(e) => setForm((p) => ({ ...p, companyName: e.target.value }))} className="w-full px-4 py-3 rounded-xl bg-zinc-900/50 border border-zinc-600/50 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all" placeholder="Company Inc." />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Position</label>
              <input type="text" value={form.position} onChange={(e) => setForm((p) => ({ ...p, position: e.target.value }))} className="w-full px-4 py-3 rounded-xl bg-zinc-900/50 border border-zinc-600/50 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all" placeholder="Software Engineer" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Employment Type</label>
              <select value={form.employmentType} onChange={(e) => setForm((p) => ({ ...p, employmentType: e.target.value }))} className="w-full px-4 py-3 rounded-xl bg-zinc-900/50 border border-zinc-600/50 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all">
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Freelance">Freelance</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Period</label>
              <input type="text" value={form.period} onChange={(e) => setForm((p) => ({ ...p, period: e.target.value }))} className="w-full px-4 py-3 rounded-xl bg-zinc-900/50 border border-zinc-600/50 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all" placeholder="01.2023 - Present" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Description</label>
            <textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} rows={4} className="w-full px-4 py-3 rounded-xl bg-zinc-900/50 border border-zinc-600/50 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-y" placeholder="Describe your role and responsibilities..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Skills (comma-separated)</label>
            <input type="text" value={form.skills} onChange={(e) => setForm((p) => ({ ...p, skills: e.target.value }))} className="w-full px-4 py-3 rounded-xl bg-zinc-900/50 border border-zinc-600/50 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all" placeholder="React, TypeScript, Node.js" />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Company Logo URL</label>
            <input type="text" value={form.companyLogo} onChange={(e) => setForm((p) => ({ ...p, companyLogo: e.target.value }))} className="w-full px-4 py-3 rounded-xl bg-zinc-900/50 border border-zinc-600/50 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all" placeholder="https://..." />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="currentEmployer" checked={form.isCurrentEmployer} onChange={(e) => setForm((p) => ({ ...p, isCurrentEmployer: e.target.checked }))} className="rounded border-zinc-600" />
            <label htmlFor="currentEmployer" className="text-sm text-zinc-300">Current Employer</label>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="showInPortfolio" checked={form.showInPortfolio} onChange={(e) => setForm((p) => ({ ...p, showInPortfolio: e.target.checked }))} className="rounded border-zinc-600" />
            <label htmlFor="showInPortfolio" className="text-sm text-zinc-300">Show in Portfolio Page</label>
          </div>
          <button onClick={handleSubmit} className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all">
            {editing ? "Update Experience" : "Add Experience"}
          </button>
        </div>
      )}

      <div className="space-y-3">
        {items.length === 0 ? (
          <div className="text-center py-16 text-zinc-500">
            <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            No work experience added yet. Click &quot;Add Experience&quot; to start.
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="bg-zinc-800/50 border border-zinc-700/50 rounded-2xl p-5 flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 flex-1 min-w-0">
                {item.companyLogo && (
                  <img src={item.companyLogo} alt={item.companyName} className="w-12 h-12 rounded-xl object-cover border border-zinc-600/50 shrink-0" />
                )}
                <div className="min-w-0">
                  <h3 className="font-semibold text-white">{item.position}</h3>
                  <div className="text-sm text-zinc-400">{item.companyName} &middot; {item.employmentType}</div>
                  <div className="text-xs text-zinc-500 mt-0.5">{item.period}</div>
                  <p className="text-sm text-zinc-400 mt-1 line-clamp-2">{item.description}</p>
                  {item.isCurrentEmployer && (
                    <span className="inline-block mt-2 px-2 py-0.5 rounded-md bg-green-500/10 text-xs text-green-400 border border-green-500/20">
                      Current
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <button
                  type="button"
                  title={item.showInPortfolio !== false ? "Visible on portfolio — click to hide" : "Hidden from portfolio — click to show"}
                  onClick={async () => {
                    const nextVal = !(item.showInPortfolio !== false);
                    setItems((prev) => prev.map((e) => e.id === item.id ? { ...e, showInPortfolio: nextVal } : e));
                    try {
                      await fetch("/api/admin/content/experiences", {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ id: item.id, showInPortfolio: nextVal }),
                      });
                    } catch {
                      loadItems();
                    }
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                    item.showInPortfolio !== false
                      ? "text-green-400 bg-green-500/10 border-green-500/30 hover:bg-green-500/20"
                      : "text-zinc-400 bg-zinc-700/40 border-zinc-600/50 hover:bg-zinc-700/60"
                  }`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {item.showInPortfolio !== false ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878l4.242 4.242M21 21l-4.35-4.35" />
                    )}
                  </svg>
                  <span>{item.showInPortfolio !== false ? "Visible" : "Hidden"}</span>
                </button>
              <div className="flex gap-2">
                <button title="Edit experience" onClick={() => handleEdit(item)} className="p-2 rounded-lg hover:bg-zinc-700/50 text-zinc-400 hover:text-white transition-all">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                </button>
                <button title="Delete experience" onClick={() => handleDelete(item.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-zinc-400 hover:text-red-400 transition-all">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

