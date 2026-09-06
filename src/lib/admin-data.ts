// Admin data directory - JSON files for content managed by admin
// This file initializes the admin data storage

import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "src/admin-data");

export function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export function getDataPath(filename: string) {
  return path.join(DATA_DIR, filename);
}

// NOTE: Not wrapped in React.cache() — cache() only works inside React Server
// Components, not in API route handlers. Plain function works everywhere.
export function readJsonFile<T>(filename: string, defaultValue: T): T {
  ensureDataDir();
  const filePath = getDataPath(filename);
  if (fs.existsSync(filePath)) {
    try {
      return JSON.parse(fs.readFileSync(filePath, "utf-8"));
    } catch {
      return defaultValue;
    }
  }
  return defaultValue;
}

export function writeJsonFile<T>(filename: string, data: T): void {
  ensureDataDir();
  const filePath = getDataPath(filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}
