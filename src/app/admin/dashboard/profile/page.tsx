"use client";

import { useEffect, useState } from "react";

const defaultSectionVisibility = {
  aboutMe: true,
  socialLinks: true,
  techStack: true,
  experiences: true,
  blog: true,
  projects: true,
};

export default function AdminProfilePage() {
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    displayName: "",
    bio: "",
    about: "",
    jobTitle: "",
    email: "",
    address: "",
    website: "",
    avatar: "",
    cvUrl: "",
    phoneNumber: "",
    sectionVisibility: defaultSectionVisibility,
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/admin/content/profile")
      .then((r) => r.json())
      .then((data) => {
        if (!data.error) {
          setProfile((prev) => ({
            ...prev,
            ...data,
            sectionVisibility: {
              ...defaultSectionVisibility,
              ...(data.sectionVisibility ?? {}),
            },
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
      if (res.ok) {
        setMessage("Profile saved successfully!");
      } else {
        setMessage("Failed to save profile");
      }
    } catch {
      setMessage("Error saving profile");
    }
    setSaving(false);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMessage("Uploading avatar...");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        const newProfile = { ...profile, avatar: data.url };
        setProfile(newProfile);
        
        // Auto-save profile
        await fetch("/api/admin/content/profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newProfile),
        });
        
        setMessage("Avatar uploaded and profile saved!");
      } else {
        setMessage(`Avatar upload failed: ${data.error || "Unknown error"}`);
      }
    } catch {
      setMessage("Error uploading avatar. Please try again.");
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
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        const newProfile = { ...profile, cvUrl: data.url };
        setProfile(newProfile);

        // Auto-save profile
        await fetch("/api/admin/content/profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newProfile),
        });

        setMessage("CV uploaded and profile saved!");
      } else {
        setMessage(`CV upload failed: ${data.error || "Unknown error"}`);
      }
    } catch {
      setMessage("Error uploading CV. Please try again.");
    }
    setTimeout(() => setMessage(""), 3000);
  };

  const handleDeleteCv = async () => {
    if (!profile.cvUrl) return;
    setMessage("Deleting CV...");
    try {
      const filename = profile.cvUrl.split('/').pop();
      if (!filename) return;
      const res = await fetch(`/api/admin/upload?filename=${filename}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        const newProfile = { ...profile, cvUrl: "" };
        setProfile(newProfile);

        // Auto-save profile
        await fetch("/api/admin/content/profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newProfile),
        });

        setMessage("CV deleted and profile updated!");
      } else {
        setMessage(`Delete failed: ${data.error || "Unknown error"}`);
      }
    } catch {
      setMessage("Error deleting CV.");
    }
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Edit Profile</h1>
        <p className="text-zinc-400 mt-1">
          Update your personal information displayed on the portfolio
        </p>
      </div>

      {message && (
        <div
          className={`mb-6 p-4 rounded-xl text-sm border ${
            message.toLowerCase().includes("success")
              ? "bg-green-500/10 border-green-500/20 text-green-400"
              : message.toLowerCase().includes("fail") || message.toLowerCase().includes("error")
              ? "bg-red-500/10 border-red-500/20 text-red-400"
              : "bg-blue-500/10 border-blue-500/20 text-blue-400"
          }`}
        >
          {message}
        </div>
      )}

      <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-2xl p-6 space-y-6">
        {/* Avatar */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Profile Photo
          </label>
          <div className="flex items-center gap-4">
            {profile.avatar && (
              <img
                src={profile.avatar}
                alt="Avatar"
                className="w-20 h-20 rounded-2xl object-cover border border-zinc-600/50"
              />
            )}
            <label className="cursor-pointer px-4 py-2 rounded-xl bg-zinc-700/50 hover:bg-zinc-700 border border-zinc-600/50 text-sm text-zinc-300 transition-all">
              Upload Photo
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* CV Upload */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Curriculum Vitae (CV)
          </label>
          <div className="flex items-center gap-4">
            <label className="cursor-pointer px-4 py-2 rounded-xl bg-zinc-700/50 hover:bg-zinc-700 border border-zinc-600/50 text-sm text-zinc-300 transition-all">
              {profile.cvUrl ? "Change CV" : "Upload CV"}
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleCvUpload}
                className="hidden"
              />
            </label>
            {profile.cvUrl && (
              <button
                onClick={handleDeleteCv}
                className="px-4 py-2 rounded-xl bg-red-600/10 border border-red-500/20 text-sm text-red-400 hover:bg-red-600/20 transition-all font-medium"
              >
                Delete CV
              </button>
            )}
          </div>
          {profile.cvUrl && (
            <p className="text-xs text-zinc-500 mt-2 truncate max-w-md">
              Current CV: {profile.cvUrl}
            </p>
          )}
        </div>

        {/* Name Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              First Name
            </label>
            <input
              type="text"
              value={profile.firstName}
              onChange={(e) =>
                setProfile((p) => ({ ...p, firstName: e.target.value }))
              }
              className="w-full px-4 py-3 rounded-xl bg-zinc-900/50 border border-zinc-600/50 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              placeholder="John"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Last Name
            </label>
            <input
              type="text"
              value={profile.lastName}
              onChange={(e) =>
                setProfile((p) => ({ ...p, lastName: e.target.value }))
              }
              className="w-full px-4 py-3 rounded-xl bg-zinc-900/50 border border-zinc-600/50 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              placeholder="Doe"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Display Name
          </label>
          <input
            type="text"
            value={profile.displayName}
            onChange={(e) =>
              setProfile((p) => ({ ...p, displayName: e.target.value }))
            }
            className="w-full px-4 py-3 rounded-xl bg-zinc-900/50 border border-zinc-600/50 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            placeholder="Display name on your portfolio"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Job Title
          </label>
          <input
            type="text"
            value={profile.jobTitle}
            onChange={(e) =>
              setProfile((p) => ({ ...p, jobTitle: e.target.value }))
            }
            className="w-full px-4 py-3 rounded-xl bg-zinc-900/50 border border-zinc-600/50 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            placeholder="Software Engineer"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Short Bio
          </label>
          <input
            type="text"
            value={profile.bio}
            onChange={(e) =>
              setProfile((p) => ({ ...p, bio: e.target.value }))
            }
            className="w-full px-4 py-3 rounded-xl bg-zinc-900/50 border border-zinc-600/50 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            placeholder="A short tagline about you"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            About (detailed)
          </label>
          <textarea
            value={profile.about}
            onChange={(e) =>
              setProfile((p) => ({ ...p, about: e.target.value }))
            }
            rows={6}
            className="w-full px-4 py-3 rounded-xl bg-zinc-900/50 border border-zinc-600/50 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-y"
            placeholder="Tell visitors about yourself..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Email
            </label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) =>
                setProfile((p) => ({ ...p, email: e.target.value }))
              }
              className="w-full px-4 py-3 rounded-xl bg-zinc-900/50 border border-zinc-600/50 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              placeholder="your@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Phone Number
            </label>
            <input
              type="text"
              value={profile.phoneNumber}
              onChange={(e) =>
                setProfile((p) => ({ ...p, phoneNumber: e.target.value }))
              }
              className="w-full px-4 py-3 rounded-xl bg-zinc-900/50 border border-zinc-600/50 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              placeholder="+1 234 567 890"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Address
            </label>
            <input
              type="text"
              value={profile.address}
              onChange={(e) =>
                setProfile((p) => ({ ...p, address: e.target.value }))
              }
              className="w-full px-4 py-3 rounded-xl bg-zinc-900/50 border border-zinc-600/50 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              placeholder="City, Country"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Website
            </label>
            <input
              type="url"
              value={profile.website}
              onChange={(e) =>
                setProfile((p) => ({ ...p, website: e.target.value }))
              }
              className="w-full px-4 py-3 rounded-xl bg-zinc-900/50 border border-zinc-600/50 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              placeholder="https://yoursite.com"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-zinc-700/50">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-medium transition-all"
          >
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </div>
    </div>
  );
}

