"use client";

import { useEffect, useState } from "react";

interface UploadedFile {
  filename: string;
  url: string;
  size: number;
  uploadedAt: string;
}

function formatBytes(bytes: number) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export default function AdminUploadsPage() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const loadFiles = async () => {
    try {
      const res = await fetch("/api/admin/upload");
      const data = await res.json();
      if (Array.isArray(data)) setFiles(data);
    } catch {}
  };

  useEffect(() => { loadFiles(); }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList?.length) return;

    setUploading(true);
    try {
      for (let i = 0; i < fileList.length; i++) {
        const formData = new FormData();
        formData.append("file", fileList[i]);
        await fetch("/api/admin/upload", { method: "POST", body: formData });
      }
      setMessage(`${fileList.length} file(s) uploaded successfully!`);
      loadFiles();
    } catch {
      setMessage("Upload failed");
    }
    setUploading(false);
    e.target.value = "";
    setTimeout(() => setMessage(""), 3000);
  };

  const handleDelete = async (filename: string) => {
    if (!confirm("Delete this file?")) return;
    await fetch(`/api/admin/upload?filename=${encodeURIComponent(filename)}`, { method: "DELETE" });
    loadFiles();
    setMessage("File deleted");
    setTimeout(() => setMessage(""), 3000);
  };

  const copyUrl = (url: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url);
      setMessage("URL copied to clipboard!");
    } else {
      setMessage("Please copy: " + url);
    }
    setTimeout(() => setMessage(""), 3000);
  };

  const isImage = (filename: string) => /\.(jpg|jpeg|png|gif|webp|svg|ico)$/i.test(filename);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">File Uploads</h1>
          <p className="text-zinc-400 mt-1">Upload and manage images and files</p>
        </div>
        <label className={`px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-all cursor-pointer ${uploading ? "opacity-50 pointer-events-none" : ""}`}>
          {uploading ? "Uploading..." : "+ Upload Files"}
          <input type="file" multiple onChange={handleUpload} className="hidden" />
        </label>
      </div>

      {message && (
        <div className="mb-6 p-4 rounded-xl text-sm bg-green-500/10 border border-green-500/20 text-green-400">{message}</div>
      )}

      {/* Drag & Drop area */}
      <div className="border-2 border-dashed border-zinc-700/50 rounded-2xl p-8 text-center mb-6 hover:border-blue-500/30 transition-all">
        <svg className="w-10 h-10 mx-auto text-zinc-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
        <p className="text-zinc-400 text-sm">
          Use the upload button above to add files.
        </p>
        <p className="text-zinc-500 text-xs mt-1">
          Supports images, documents, and other files
        </p>
      </div>

      {/* Files Grid */}
      {files.length === 0 ? (
        <div className="text-center py-12 text-zinc-500">
          No files uploaded yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {files.map((file) => (
            <div key={file.filename} className="bg-zinc-800/50 border border-zinc-700/50 rounded-2xl overflow-hidden group">
              {isImage(file.filename) ? (
                <div className="aspect-video bg-zinc-900 flex items-center justify-center">
                  <img src={file.url} alt={file.filename} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="aspect-video bg-zinc-900 flex items-center justify-center">
                  <svg className="w-12 h-12 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              )}
              <div className="p-3">
                <p className="text-sm text-white truncate" title={file.filename}>{file.filename}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-zinc-500">{formatBytes(file.size)}</span>
                  <div className="flex gap-1">
                    <button onClick={() => copyUrl(file.url)} className="p-1.5 rounded-lg hover:bg-zinc-700/50 text-zinc-400 hover:text-white transition-all" title="Copy URL">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                    </button>
                    <button onClick={() => handleDelete(file.filename)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-zinc-400 hover:text-red-400 transition-all" title="Delete">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

