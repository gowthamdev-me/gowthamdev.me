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
  const tmpPath = path.join(TMP_DIR, filename);
  const filePath = path.join(DATA_DIR, filename);

  const hasTmp = fs.existsSync(tmpPath);
  const hasFile = fs.existsSync(filePath);

  if (hasTmp && hasFile) {
    try {
      const tmpMtime = fs.statSync(tmpPath).mtimeMs;
      const fileMtime = fs.statSync(filePath).mtimeMs;
      // If the file in source code was modified after or at the same time as temp, use source code
      if (fileMtime >= tmpMtime) {
        return JSON.parse(fs.readFileSync(filePath, "utf-8"));
      }
      return JSON.parse(fs.readFileSync(tmpPath, "utf-8"));
    } catch {}
  }

  if (hasFile) {
    try {
      return JSON.parse(fs.readFileSync(filePath, "utf-8"));
    } catch {}
  }

  if (hasTmp) {
    try {
      return JSON.parse(fs.readFileSync(tmpPath, "utf-8"));
    } catch {}
  }

  return defaultValue;
}

export async function syncToGitHub(filename: string, content: string): Promise<boolean> {
  const token = process.env.GITHUB_TOKEN || process.env.GITHUB_PAT;
  const repo = process.env.GITHUB_REPOSITORY || "gowthamdev-me/gowthamdev.me";
  const branch = process.env.GITHUB_BRANCH || "main";

  if (!token) {
    return false;
  }

  const url = `https://api.github.com/repos/${repo}/contents/src/admin-data/${filename}`;

  try {
    let sha: string | undefined;
    const getRes = await fetch(`${url}?ref=${branch}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
      cache: "no-store",
    });

    if (getRes.ok) {
      const data = await getRes.json();
      sha = data.sha;
    }

    const putRes = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: `Admin update: ${filename}`,
        content: Buffer.from(content).toString("base64"),
        branch,
        ...(sha ? { sha } : {}),
      }),
    });

    return putRes.ok;
  } catch (err) {
    console.error("[syncToGitHub] Error syncing to GitHub:", err);
    return false;
  }
}

export async function writeJsonFileAsync<T>(
  filename: string,
  data: T
): Promise<{ success: boolean; syncedToGitHub: boolean }> {
  const jsonStr = JSON.stringify(data, null, 2);

  // Write to tmp
  try {
    ensureDir(TMP_DIR);
    fs.writeFileSync(path.join(TMP_DIR, filename), jsonStr, "utf-8");
  } catch (err) {
    console.error("[writeJsonFileAsync] Error writing to tmp:", err);
  }

  // Write to DATA_DIR
  try {
    ensureDir(DATA_DIR);
    fs.writeFileSync(path.join(DATA_DIR, filename), jsonStr, "utf-8");
  } catch {}

  let synced = false;
  if (process.env.GITHUB_TOKEN || process.env.GITHUB_PAT) {
    synced = await syncToGitHub(filename, jsonStr);
  }

  return { success: true, syncedToGitHub: synced };
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

  // Sync to GitHub if GITHUB_TOKEN is configured in environment variables
  if (process.env.GITHUB_TOKEN || process.env.GITHUB_PAT) {
    syncToGitHub(filename, jsonStr).catch((err) =>
      console.error("[writeJsonFile] Background sync to GitHub failed:", err)
    );
  }
}

