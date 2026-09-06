"use client";

import { useEffect, useState } from "react";

interface Certification {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  credentialID: string;
  credentialURL: string;
  issuerLogoURL: string;
  issuerIconName: string;
}

const emptyForm = {
  title: "",
  issuer: "",
  issueDate: "",
  credentialID: "",
  credentialURL: "",
  issuerLogoURL: "",
  issuerIconName: "",
};

export default function AdminCertificationsPage() {
  const [items, setItems] = useState<Certification[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Certification | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const loadItems = async () => {
    try {
      const res = await fetch("/api/admin/content/certifications");
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
    if (!form.title.trim() || !form.issuer.trim()) {
      setMessage("Title and Issuer are required.");
      setTimeout(() => setMessage(""), 3000);
      return;
    }
    setLoading(true);
    try {
      if (editing) {
        await fetch("/api/admin/content/certifications", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, id: editing.id }),
        });
        setMessage("Certification updated!");
      } else {
        await fetch("/api/admin/content/certifications", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        setMessage("Certification added!");
      }
      resetForm();
      loadItems();
    } catch {
      setMessage("Error saving certification");
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleEdit = (item: Certification) => {
    setForm({
      title: item.title || "",
      issuer: item.issuer || "",
      issueDate: item.issueDate || "",
      credentialID: item.credentialID || "",
      credentialURL: item.credentialURL || "",
      issuerLogoURL: item.issuerLogoURL || "",
      issuerIconName: item.issuerIconName || "",
    });
    setEditing(item);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    setItems((prev) => prev.filter((item) => String(item.id) !== String(id)));
    setMessage("Certification deleted.");
    setTimeout(() => setMessage(""), 3000);

    try {
      const res = await fetch(`/api/admin/content/certifications?id=${encodeURIComponent(id)}`, {
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

  const field = (label: string, key: keyof typeof emptyForm, placeholder = "") => (
    <div>
      <label className="block text-sm text-zinc-400 mb-1">{label}</label>
      <input
        className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-zinc-500"
        value={form[key]}
        placeholder={placeholder}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
      />
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Certifications</h1>
          <p className="text-zinc-400 mt-1">{items.length} certification{items.length !== 1 ? "s" : ""}</p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-5 py-2.5 bg-blue-500 hover:bg-blue-400 text-white font-semibold rounded-xl transition-all"
          >
            + Add Certification
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
          <h2 className="text-lg font-semibold text-white mb-5">{editing ? "Edit Certification" : "Add Certification"}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {field("Title *", "title", "e.g. Next.js App Router Fundamentals")}
            {field("Issuer *", "issuer", "e.g. Vercel, Google, Meta")}
            {field("Issue Date (YYYY-MM-DD)", "issueDate", "e.g. 2024-04-26")}
            {field("Credential ID", "credentialID", "e.g. ABC-123")}
            {field("Credential URL", "credentialURL", "https://...")}
            {field("Issuer Logo URL", "issuerLogoURL", "https://... (optional)")}
            {field("Issuer Icon Name", "issuerIconName", "e.g. google, vercel, meta (optional)")}
          </div>
          <div className="flex gap-3 mt-5">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-2.5 bg-blue-500 hover:bg-blue-400 disabled:opacity-50 text-white font-semibold rounded-xl transition-all"
            >
              {loading ? "Saving..." : editing ? "Update Certification" : "Add Certification"}
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
            <div className="text-4xl mb-3">📜</div>
            <p>No certifications yet. Click &quot;Add Certification&quot; to get started.</p>
          </div>
        )}
        {items.map((item) => (
          <div key={item.id} className="bg-zinc-800/50 border border-zinc-700/50 rounded-2xl p-5 flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-white text-sm">{item.title}</div>
              <div className="flex items-center gap-2 flex-wrap mt-1">
                <span className="text-xs font-medium text-blue-400">{item.issuer}</span>
                {item.issueDate && <span className="text-xs text-zinc-500">{item.issueDate}</span>}
                {item.credentialID && <span className="text-xs text-zinc-500">ID: {item.credentialID}</span>}
              </div>
              {item.credentialURL && (
                <a href={item.credentialURL} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:underline mt-1 inline-block">
                  View Credential ↗
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
