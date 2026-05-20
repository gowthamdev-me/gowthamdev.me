"use client";

import { useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Project {
  id: string;
  title: string;
  description: string;
  link: string;
  skills: string;
  logo: string;
  period: string;
  showInPortfolio: boolean;
  createdAt?: string;
}
function SortableProjectItem({
  project,
  handleEdit,
  handleDelete,
  toggleVisibility,
}: {
  project: Project;
  handleEdit: (project: Project) => void;
  handleDelete: (id: string) => void;
  toggleVisibility: (project: Project) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: project.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: transform ? 1 : 0,
    position: transform ? "relative" : "static",
  } as React.CSSProperties;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-zinc-800/50 border border-zinc-700/50 rounded-2xl p-5 flex items-start justify-between gap-4 bg-zinc-800 relative"
    >
      <div className="flex items-start gap-4 flex-1 min-w-0">
        <div
          {...attributes}
          {...listeners}
          style={{ touchAction: "none" }}
          className="cursor-grab active:cursor-grabbing text-zinc-500 hover:text-white mt-1 shrink-0 p-1 rounded-md hover:bg-zinc-700/50 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
          </svg>
        </div>
        {project.logo && (
          <img
            src={project.logo}
            alt={project.title}
            className="w-12 h-12 rounded-xl object-cover border border-zinc-600/50 shrink-0"
          />
        )}
        <div className="min-w-0">
          <h3 className="font-semibold text-white truncate">{project.title}</h3>
          {project.period && (
            <div className="text-xs text-zinc-500 mt-0.5">{project.period}</div>
          )}
          <p className="text-sm text-zinc-400 mt-1 line-clamp-2">
            {project.description}
          </p>
          {project.skills && (
            <div className="flex flex-wrap gap-1 mt-2">
              {String(project.skills)
                .split(",")
                .map((s, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-md bg-zinc-700/50 text-xs text-zinc-400"
                  >
                    {s.trim()}
                  </span>
                ))}
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <button
          type="button"
          title={project.showInPortfolio !== false ? "Visible on portfolio — click to hide" : "Hidden from portfolio — click to show"}
          onClick={() => toggleVisibility(project)}
          className={`p-2 rounded-lg transition-all ${project.showInPortfolio !== false ? "text-green-400 hover:bg-green-500/10" : "text-zinc-600 hover:bg-zinc-700/50"}`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {project.showInPortfolio !== false ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878l4.242 4.242M21 21l-4.35-4.35" />
            )}
          </svg>
        </button>
        <div className="flex gap-2">
          <button
            title="Edit project"
            onClick={() => handleEdit(project)}
            className="p-2 rounded-lg hover:bg-zinc-700/50 text-zinc-400 hover:text-white transition-all"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            title="Delete project"
            onClick={() => handleDelete(project.id)}
            className="p-2 rounded-lg hover:bg-red-500/10 text-zinc-400 hover:text-red-400 transition-all"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    link: "",
    skills: "",
    logo: "",
    period: "",
    showInPortfolio: true,
  });
  const [message, setMessage] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setProjects((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);
        
        fetch("/api/admin/content/projects", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newItems),
        });
        
        return newItems;
      });
    }
  };

  const toggleVisibility = async (project: Project) => {
    await fetch("/api/admin/content/projects", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: project.id, showInPortfolio: !(project.showInPortfolio !== false) }),
    });
    loadProjects();
  };

  const loadProjects = async () => {
    try {
      const res = await fetch("/api/admin/content/projects");
      const data = await res.json();
      if (Array.isArray(data)) setProjects(data);
    } catch {}
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const resetForm = () => {
    setForm({ title: "", description: "", link: "", skills: "", logo: "", period: "", showInPortfolio: true });
    setEditing(null);
    setShowForm(false);
  };

  const handleSubmit = async () => {
    try {
      if (editing) {
        await fetch("/api/admin/content/projects", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, id: editing.id }),
        });
        setMessage("Project updated!");
      } else {
        await fetch("/api/admin/content/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        setMessage("Project added!");
      }
      resetForm();
      loadProjects();
    } catch {
      setMessage("Error saving project");
    }
    setTimeout(() => setMessage(""), 3000);
  };

  const handleEdit = (project: Project) => {
    setForm({
      title: project.title || "",
      description: project.description || "",
      link: project.link || "",
      skills: project.skills || "",
      logo: project.logo || "",
      period: project.period || "",
      showInPortfolio: project.showInPortfolio ?? true,
    });
    setEditing(project);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    await fetch(`/api/admin/content/projects?id=${id}`, { method: "DELETE" });
    loadProjects();
    setMessage("Project deleted");
    setTimeout(() => setMessage(""), 3000);
  };

  const validateImageSize = (file: File, width: number, height: number): Promise<boolean> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        const img = new Image();
        img.onload = () => {
          resolve(img.width === width && img.height === height);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: "logo" | "coverImage") => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size 500x500
    const isValid = await validateImageSize(file, 500, 500);
    if (!isValid) {
      alert("Please upload an image with exact dimensions: 500x500 pixels.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.success) setForm((p) => ({ ...p, [field]: data.url }));
    } catch {}
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Projects</h1>
          <p className="text-zinc-400 mt-1">Manage your portfolio projects</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
          }}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-all"
        >
          {showForm ? "Cancel" : "+ Add Project"}
        </button>
      </div>

      {message && (
        <div className="mb-6 p-4 rounded-xl text-sm bg-green-500/10 border border-green-500/20 text-green-400">
          {message}
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-2xl p-6 mb-6 space-y-4">
          <h2 className="text-lg font-semibold text-white">
            {editing ? "Edit Project" : "Add New Project"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl bg-zinc-900/50 border border-zinc-600/50 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                placeholder="Project name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Link</label>
              <input
                type="url"
                value={form.link}
                onChange={(e) => setForm((p) => ({ ...p, link: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl bg-zinc-900/50 border border-zinc-600/50 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                placeholder="https://..."
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              rows={4}
              className="w-full px-4 py-3 rounded-xl bg-zinc-900/50 border border-zinc-600/50 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-y"
              placeholder="Describe the project..."
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Skills (comma-separated)
              </label>
              <input
                type="text"
                value={form.skills}
                onChange={(e) => setForm((p) => ({ ...p, skills: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl bg-zinc-900/50 border border-zinc-600/50 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                placeholder="React, TypeScript, Node.js"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Period</label>
              <input
                type="text"
                value={form.period}
                onChange={(e) => setForm((p) => ({ ...p, period: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl bg-zinc-900/50 border border-zinc-600/50 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                placeholder="01.2024 - Present"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Icon (500x500)</label>
            <div className="flex items-center gap-3">
              {form.logo && (
                <img src={form.logo} alt="Logo" className="w-12 h-12 rounded-lg object-cover border border-zinc-600/50" />
              )}
              <label className="cursor-pointer px-4 py-2 rounded-xl bg-zinc-700/50 hover:bg-zinc-700 border border-zinc-600/50 text-sm text-zinc-300 transition-all">
                Upload Icon
                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "logo")} className="hidden" />
              </label>
              <input
                type="text"
                value={form.logo}
                onChange={(e) => setForm((p) => ({ ...p, logo: e.target.value }))}
                className="flex-1 px-3 py-2 rounded-lg bg-zinc-900/50 border border-zinc-600/50 text-white text-sm placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                placeholder="Image URL"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="showInPortfolio" checked={form.showInPortfolio} onChange={(e) => setForm((p) => ({ ...p, showInPortfolio: e.target.checked }))} className="rounded border-zinc-600" />
            <label htmlFor="showInPortfolio" className="text-sm text-zinc-300">Show in Portfolio Page</label>
          </div>
          <button
            onClick={handleSubmit}
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all"
          >
            {editing ? "Update Project" : "Add Project"}
          </button>
        </div>
      )}

      {/* Projects List */}
      <div className="space-y-3">
        {projects.length === 0 ? (
          <div className="text-center py-16 text-zinc-500">
            <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            No projects yet. Click &quot;Add Project&quot; to get started.
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={projects.map((p) => p.id)}
              strategy={verticalListSortingStrategy}
            >
              {projects.map((project) => (
                <SortableProjectItem
                  key={project.id}
                  project={project}
                  handleEdit={handleEdit}
                  handleDelete={handleDelete}
                  toggleVisibility={toggleVisibility}
                />
              ))}
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  );
}

