import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_PATH = path.join(__dirname, "..", "..", "data.json");

/**
 * Simple in-memory cache to avoid repeated file I/O operations.
 * This significantly improves performance for read-heavy workloads.
 * Note: This cache is per-process. In a distributed setup, consider Redis or similar.
 */
let cache = null;
let isLoading = false;

function load() {
  if (cache !== null) {
    return cache;
  }
  
  // Simple loading flag to minimize concurrent file reads
  if (isLoading) {
    // Wait a bit and try again if another load is in progress
    return cache || { jobs: [] };
  }
  
  isLoading = true;
  try {
    const raw = fs.readFileSync(DATA_PATH, "utf-8");
    cache = JSON.parse(raw);
    return cache;
  } catch (e) {
    cache = { jobs: [] };
    return cache;
  } finally {
    isLoading = false;
  }
}

function save(data) {
  cache = data;
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), "utf-8");
}

export const db = {
  getJobs() {
    return load().jobs;
  },
  getJob(id) {
    return this.getJobs().find(j => j.id === id) || null;
  },
  addJob(job) {
    const data = load();
    data.jobs.push(job);
    save(data);
    return job;
  },
  updateJob(id, patch) {
    const data = load();
    const idx = data.jobs.findIndex(j => j.id === id);
    if (idx === -1) return null;
    data.jobs[idx] = { ...data.jobs[idx], ...patch };
    save(data);
    return data.jobs[idx];
  },
  // Method to invalidate cache if needed (e.g., for testing)
  clearCache() {
    cache = null;
  }
};
