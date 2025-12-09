import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_PATH = path.join(__dirname, "..", "..", "data.json");

// In-memory cache to avoid repeated file I/O operations
let cache = null;

function load() {
  if (cache !== null) {
    return cache;
  }
  
  try {
    const raw = fs.readFileSync(DATA_PATH, "utf-8");
    cache = JSON.parse(raw);
    return cache;
  } catch (e) {
    cache = { jobs: [] };
    return cache;
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
