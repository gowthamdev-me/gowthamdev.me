"use client";

import { useEffect, useState } from "react";

interface Award {
  id: string;
  prize: string;
  title: string;
  date: string;
  grade: string;
  description: string;
  referenceLink: string;
}

const emptyForm = {
  prize: "",
  title: "",
  date: "",
  grade: "",
  description: "",
  referenceLink: "",
};

export default function AdminAwardsPage() {
  const [items, setItems] = useState<Award[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Award | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const loadItems = async () => {
    try {
      const res = await fetch("/api/admin/content/awards");
      const data = await res.json();
      if (Array.isArray(data)) setItems(data);
    } catch {}
  };

  useEffect(() => { loadItems(); }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditing(null);
    setShowForm(false);
  };

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.prize.trim()) {
      setMessage("Title and Prize are required.");
      setTimeout(() => setMessage(""), 3000);
      return;
    }
    setLoading(true);
    try {
      if (editing) {
        await fetch("/api/admin/content/awards", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, id: editing.id }),
        });
        setMessage("Award updated!");
      } else {
        await fetch("/api/admin/content/awards", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        setMessage("Award added!");
      }
      resetForm();
      loadItems();
    } catch {
      setMessage("Error saving award");
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleEdit = (item: Award) => {
    setForm({
      prize: item.prize || "",
      title: item.title || "",
      date: item.date || "",
      grade: item.grade || "",
      description: item.description || "",
      referenceLink: item.referenceLink || "",
    });
    setEditing(item);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this award?")) return;
    try {
      await fetch(`/api/admin/content/awards?id=${id}`, { method: "DELETE" });
      loadItems();
      setMessage("Award deleted.");
      setTimeout(() => setMessage(""), 3000);
    } catch {
      setMessage("Error deleting award");
    }
  };

  const field = (label: string, key: keyof typeof emptyForm, placeholder = "", textarea = false) => (
    <div>
      <label className="block text-sm text-zinc-400 mb-1">{label}</label>
      {textarea ? (
        <textarea
          className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-zinc-500 min-h-[90px] resize-y"
          value={form[key]}
          placeholder={placeholder}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        />
      ) : (
        <input
          className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-zinc-500"
          value={form[key]}
          placeholder={placeholder}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        />
      )}
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Honors &amp; Awards</h1>
          <p className="text-zinc-400 mt-1">{items.length} award{items.length !== 1 ? "s" : ""}</p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-5 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold rounded-xl transition-all"
          >
            + Add Award
          </button>
        )}
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-xl text-sm border ${message.startsWith("Error") ? "bg-red-500/10 border-red-500/30 text-red-400" : "bg-green-500/10 border-green-500/30 text-green-400"}`}>
          {message}
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="mb-8 bg-zinc-800/50 border border-zinc-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-5">{editing ? "Edit Award" : "Add Award"}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {field("Prize / Award Type *", "prize", "e.g. 1st Prize, Gold Medal")}
            {field("Title *", "title", "e.g. National Informatics Contest 2024")}
            {field("Date (YYYY-MM)", "date", "e.g. 2024-05")}
            {field("Grade / Level", "grade", "e.g. Grade 12, University")}
            {field("Reference Link", "referenceLink", "https://...")}
          </div>
          <div className="mt-4">{field("Description", "description", "Details about this award...", true)}</div>
          <div className="flex gap-3 mt-5">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-2.5 bg-yellow-500 hover:bg-yellow-400 disabled:opacity-50 text-black font-semibold rounded-xl transition-all"
            >
              {loading ? "Saving..." : editing ? "Update Award" : "Add Award"}
            </button>
            <button onClick={resetForm} className="px-6 py-2.5 bg-zinc-700 hover:bg-zinc-600 text-white font-medium rounded-xl transition-all">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* List */}
      <div className="space-y-3">
        {items.length === 0 && (
          <div className="text-center py-16 text-zinc-500">
            <div className="text-4xl mb-3">🏆</div>
            <p>No awards yet. Click &quot;Add Award&quot; to get started.</p>
          </div>
        )}
        {items.map((item) => (
          <div key={item.id} className="bg-zinc-800/50 border border-zinc-700/50 rounded-2xl p-5 flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-yellow-500/15 text-yellow-400 border border-yellow-500/25">
                  {item.prize}
                </span>
                {item.grade && <span className="text-xs text-zinc-500">{item.grade}</span>}
                {item.date && <span className="text-xs text-zinc-500">{item.date}</span>}
              </div>
              <div className="font-semibold text-white text-sm">{item.title}</div>
              {item.description && (
                <div className="text-xs text-zinc-400 mt-1 line-clamp-2 whitespace-pre-line">{item.description}</div>
              )}
              {item.referenceLink && (
                <a href={item.referenceLink} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:underline mt-1 inline-block">
                  View Reference ↗
                </a>
              )}
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => handleEdit(item)}
                className="px-3 py-1.5 text-xs bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg transition-all"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="px-3 py-1.5 text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
