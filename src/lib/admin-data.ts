// Admin data directory - JSON files for content managed by admin
// Supports local filesystem and serverless /tmp fallback (e.g. Vercel)

import fs from "fs";
import path from "path";
import os from "os";

const DATA_DIR = path.join(process.cwd(), "src/admin-data");
const TMP_DIR = path.join(os.tmpdir(), "gowtham-admin-data");

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    try {
      fs.mkdirSync(dir, { recursive: true });
    } catch {}
  }
}

export function ensureDataDir() {
  ensureDir(DATA_DIR);
  ensureDir(TMP_DIR);
}

export function getDataPath(filename: string) {
  return path.join(DATA_DIR, filename);
}

export function readJsonFile<T>(filename: string, defaultValue: T): T {
  // 1. Check /tmp first (holds runtime updates on serverless platforms)
  const tmpPath = path.join(TMP_DIR, filename);
  if (fs.existsSync(tmpPath)) {
    try {
      return JSON.parse(fs.readFileSync(tmpPath, "utf-8"));
    } catch {}
  }

  // 2. Check source data directory
  const filePath = path.join(DATA_DIR, filename);
  if (fs.existsSync(filePath)) {
    try {
      return JSON.parse(fs.readFileSync(filePath, "utf-8"));
    } catch {}
  }

  return defaultValue;
}

export function writeJsonFile<T>(filename: string, data: T): void {
  const jsonStr = JSON.stringify(data, null, 2);

  // Always write to /tmp first (always writable even on serverless read-only platforms)
  try {
    ensureDir(TMP_DIR);
    fs.writeFileSync(path.join(TMP_DIR, filename), jsonStr, "utf-8");
  } catch (err) {
    console.error("[writeJsonFile] Error writing to tmp:", err);
  }

  // Also write to DATA_DIR (for local development and git persistence)
  try {
    ensureDir(DATA_DIR);
    fs.writeFileSync(path.join(DATA_DIR, filename), jsonStr, "utf-8");
  } catch {
    // Will fail on read-only environments like Vercel Lambda — tmp write already succeeded
  }
}
