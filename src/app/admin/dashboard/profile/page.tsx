"use client";

import { useEffect, useState } from "react";

const DEFAULT_TYPING_WORDS = ["Web Developer", "Vibe Coder"];

const defaultSectionVisibility = {
  aboutMe: true,
  socialLinks: true,
  techStack: true,
  experiences: true,
  blog: true,
  projects: true,
  awards: true,
  certifications: true,
};

export default function AdminProfilePage() {
  const [profile, setProfile] = useState({
    displayName: "",
    jobTitle: "",
    bio: "",
    about: "",
    email: "",
    avatar: "",
    cvUrl: "",
    typingWords: DEFAULT_TYPING_WORDS as string[],
    sectionVisibility: defaultSectionVisibility,
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [newWord, setNewWord] = useState("");

  useEffect(() => {
    fetch("/api/admin/content/profile")
      .then((r) => r.json())
      .then((data) => {
        if (!data.error) {
          setProfile((prev) => ({
            ...prev,
            ...data,
            typingWords: Array.isArray(data.typingWords) && data.typingWords.length > 0
              ? data.typingWords
              : DEFAULT_TYPING_WORDS,
            sectionVisibility: { ...defaultSectionVisibility, ...(data.sectionVisibility ?? {}) },
          }));
        }
      })
      .catch(() => {});
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/content/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      setMessage(res.ok ? "Profile saved successfully!" : "Failed to save profile");
    } catch {
      setMessage("Error saving profile");
    }
    setSaving(false);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMessage("Uploading photo...");
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.success) {
        const updated = { ...profile, avatar: data.url };
        setProfile(updated);
        await fetch("/api/admin/content/profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updated),
        });
        setMessage("Photo uploaded!");
      } else {
        setMessage("Upload failed: " + (data.error || "Unknown error"));
      }
    } catch {
      setMessage("Error uploading photo.");
    }
    setTimeout(() => setMessage(""), 3000);
  };

  const handleCvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMessage("Uploading CV...");
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.success) {
        const updated = { ...profile, cvUrl: data.url };
        setProfile(updated);
        await fetch("/api/admin/content/profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updated),
        });
        setMessage("CV uploaded!");
      } else {
        setMessage("CV upload failed: " + (data.error || "Unknown error"));
      }
    } catch {
      setMessage("Error uploading CV.");
    }
    setTimeout(() => setMessage(""), 3000);
  };

  const handleDeleteCv = async () => {
    if (!profile.cvUrl) return;
    setMessage("Deleting CV...");
    try {
      const filename = profile.cvUrl.split("/").pop();
      if (!filename) return;
      const res = await fetch(`/api/admin/upload?filename=${filename}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        const updated = { ...profile, cvUrl: "" };
        setProfile(updated);
        await fetch("/api/admin/content/profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updated),
        });
        setMessage("CV deleted!");
      } else {
        setMessage("Delete failed: " + (data.error || "Unknown error"));
      }
    } catch {
      setMessage("Error deleting CV.");
    }
    setTimeout(() => setMessage(""), 3000);
  };

  // --- Typing words helpers ---
  const addWord = () => {
    const trimmed = newWord.trim();
    if (!trimmed || profile.typingWords.includes(trimmed)) return;
    setProfile((p) => ({ ...p, typingWords: [...p.typingWords, trimmed] }));
    setNewWord("");
  };

  const removeWord = (idx: number) => {
    setProfile((p) => ({ ...p, typingWords: p.typingWords.filter((_, i) => i !== idx) }));
  };

  const field = (
    label: string,
    value: string,
    onChange: (v: string) => void,
    opts: { placeholder?: string; type?: string; textarea?: boolean; hint?: string } = {}
  ) => (
    <div>
      <label className="block text-sm font-medium text-zinc-300 mb-1.5">{label}</label>
      {opts.textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={6}
          placeholder={opts.placeholder}
          className="w-full px-4 py-3 rounded-xl bg-zinc-900/50 border border-zinc-600/50 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-y text-sm"
        />
      ) : (
        <input
          type={opts.type || "text"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={opts.placeholder}
          className="w-full px-4 py-3 rounded-xl bg-zinc-900/50 border border-zinc-600/50 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm"
        />
      )}
      {opts.hint && <p className="text-xs text-zinc-500 mt-1">{opts.hint}</p>}
    </div>
  );

  const msgColor = message.includes("success") || message.includes("uploaded") || message.includes("deleted")
    ? "bg-green-500/10 border-green-500/20 text-green-400"
    : message.includes("fail") || message.includes("Error") || message.includes("error")
    ? "bg-red-500/10 border-red-500/20 text-red-400"
    : "bg-blue-500/10 border-blue-500/20 text-blue-400";

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Edit Profile</h1>
        <p className="text-zinc-400 mt-1">Update your personal information displayed on the portfolio</p>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-xl text-sm border ${msgColor}`}>{message}</div>
      )}

      <div className="space-y-6">

        {/* ── Profile Photo ── */}
        <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-2xl p-6">
          <h2 className="text-base font-semibold text-white mb-4">Profile Photo</h2>
          <div className="flex items-center gap-4">
            {profile.avatar ? (
              <img src={profile.avatar} alt="Avatar" className="w-20 h-20 rounded-2xl object-cover border border-zinc-600/50" />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-zinc-700/50 border border-zinc-600/50 flex items-center justify-center text-zinc-500 text-2xl">👤</div>
            )}
            <label className="cursor-pointer px-4 py-2.5 rounded-xl bg-zinc-700/50 hover:bg-zinc-700 border border-zinc-600/50 text-sm text-zinc-300 transition-all">
              {profile.avatar ? "Change Photo" : "Upload Photo"}
              <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
            </label>
          </div>
        </div>

        {/* ── CV ── */}
        <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-2xl p-6">
          <h2 className="text-base font-semibold text-white mb-4">Curriculum Vitae (CV)</h2>
          <div className="flex items-center gap-3 flex-wrap">
            <label className="cursor-pointer px-4 py-2.5 rounded-xl bg-zinc-700/50 hover:bg-zinc-700 border border-zinc-600/50 text-sm text-zinc-300 transition-all">
              {profile.cvUrl ? "Change CV" : "Upload CV"}
              <input type="file" accept=".pdf,.doc,.docx" onChange={handleCvUpload} className="hidden" />
            </label>
            {profile.cvUrl && (
              <button onClick={handleDeleteCv} className="px-4 py-2.5 rounded-xl bg-red-600/10 border border-red-500/20 text-sm text-red-400 hover:bg-red-600/20 transition-all">
                Delete CV
              </button>
            )}
          </div>
          {profile.cvUrl && (
            <p className="text-xs text-zinc-500 mt-2 truncate max-w-md">Current: {profile.cvUrl}</p>
          )}
        </div>

        {/* ── Basic Info ── */}
        <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-2xl p-6 space-y-4">
          <h2 className="text-base font-semibold text-white">Basic Info</h2>
          {field("Display Name", profile.displayName, (v) => setProfile((p) => ({ ...p, displayName: v })), { placeholder: "Gowtham" })}
          {field("Job Title", profile.jobTitle, (v) => setProfile((p) => ({ ...p, jobTitle: v })), { placeholder: "e.g. Web Developer & Vibe Coder", hint: "Shown in the bio card header" })}
          {field("Email", profile.email, (v) => setProfile((p) => ({ ...p, email: v })), { type: "email", placeholder: "you@email.com" })}
        </div>

        {/* ── Bio & About ── */}
        <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-2xl p-6 space-y-4">
          <h2 className="text-base font-semibold text-white">Bio &amp; About</h2>
          {field("Short Bio", profile.bio, (v) => setProfile((p) => ({ ...p, bio: v })), { placeholder: "A short tagline — shown under your name", hint: "One line, shown in the bio section header" })}
          {field("About (detailed)", profile.about, (v) => setProfile((p) => ({ ...p, about: v })), { textarea: true, placeholder: "Tell visitors about yourself..." })}
        </div>

        {/* ── Typing Animation Words ── */}
        <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-2xl p-6">
          <h2 className="text-base font-semibold text-white mb-1">Typing Animation Words</h2>
          <p className="text-xs text-zinc-400 mb-4">
            These words cycle in the <span className="font-mono bg-zinc-700 px-1 py-0.5 rounded text-zinc-300">I&apos;m ____</span> animation on the profile card. Add, reorder or delete them freely.
          </p>

          {/* Current words */}
          <div className="flex flex-col gap-2 mb-4">
            {profile.typingWords.map((word, idx) => (
              <div key={idx} className="flex items-center gap-2 bg-zinc-900/50 border border-zinc-700/50 rounded-xl px-4 py-2.5">
                <span className="flex-1 text-sm text-white font-medium">{word}</span>
                <button
                  onClick={() => removeWord(idx)}
                  disabled={profile.typingWords.length <= 1}
                  title="Remove this word"
                  className="text-xs text-red-400 hover:text-red-300 disabled:text-zinc-600 disabled:cursor-not-allowed transition-colors px-2 py-1 rounded-lg hover:bg-red-500/10"
                >
                  ✕ Remove
                </button>
              </div>
            ))}
          </div>

          {/* Add new word */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newWord}
              onChange={(e) => setNewWord(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addWord()}
              placeholder="Type a new word and press Add..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-zinc-900/50 border border-zinc-600/50 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm"
            />
            <button
              onClick={addWord}
              disabled={!newWord.trim()}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-sm font-semibold rounded-xl transition-all"
            >
              + Add
            </button>
          </div>
        </div>

        {/* ── Save ── */}
        <div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-semibold transition-all"
          >
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </div>

      </div>
    </div>
  );
}
