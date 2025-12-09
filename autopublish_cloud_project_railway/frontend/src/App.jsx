import React, { useEffect, useState, useMemo } from "react";

function StatusPill({ status }) {
  const cls =
    status === "completed"
      ? "status-pill status-completed"
      : status === "processing"
      ? "status-pill status-processing"
      : status === "failed"
      ? "status-pill status-failed"
      : "status-pill status-created";

  return <span className={cls}>{status}</span>;
}

async function api(path, options = {}) {
  const res = await fetch(`/api${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed: ${res.status}`);
  }
  return res.json();
}

export default function App() {
  const [nav, setNav] = useState("dashboard");
  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [creating, setCreating] = useState(false);
  const [runningJobId, setRunningJobId] = useState(null);
  const [form, setForm] = useState({
    niche: "ai-lifestyle",
    lengthMode: "auto",
    provider: "mock",
    autoTrend: true,
    manualTitle: "",
    channel: "main",
  });
  const [selectedJob, setSelectedJob] = useState(null);
  const [health, setHealth] = useState(null);

  // Memoize sorted jobs to avoid re-sorting on every render
  const sortedJobs = useMemo(() => {
    return [...jobs].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  }, [jobs]);

  // Memoize last completed job
  const lastCompleted = useMemo(() => {
    return jobs.find((j) => j.status === "completed");
  }, [jobs]);

  async function loadHealth() {
    try {
      const data = await api("/health");
      setHealth(data);
    } catch (e) {
      console.error(e);
    }
  }

  async function loadJobs() {
    setLoadingJobs(true);
    try {
      const data = await api("/jobs");
      setJobs(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingJobs(false);
    }
  }

  useEffect(() => {
    loadHealth();
    loadJobs();
    
    // Polling interval that checks if polling should be active
    const interval = setInterval(() => {
      const shouldPoll = nav === "dashboard" || nav === "jobs";
      if (shouldPoll) {
        loadJobs();
      }
    }, 10000); // Increased from 8s to 10s
    
    return () => clearInterval(interval);
  }, [nav]);

  function updateForm(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleCreateJob(e) {
    e.preventDefault();
    setCreating(true);
    try {
      const body = JSON.stringify(form);
      const job = await api("/jobs", { method: "POST", body });
      setForm((prev) => ({ ...prev, manualTitle: "" }));
      // Add the new job to the list immediately instead of reloading all jobs
      setJobs((prev) => [job, ...prev]);
      setSelectedJob(job);
      setNav("jobs");
    } catch (e) {
      alert("Failed to create job: " + e.message);
    } finally {
      setCreating(false);
    }
  }

  async function handleRunJob(jobId) {
    setRunningJobId(jobId);
    try {
      const body = JSON.stringify({});
      const job = await api(`/jobs/${jobId}/run`, { method: "POST", body });
      setSelectedJob(job);
      await loadJobs();
    } catch (e) {
      alert("Failed to run pipeline: " + e.message);
    } finally {
      setRunningJobId(null);
    }
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div>
          <h1>AI Autopublish</h1>
          <div className="muted" style={{ fontSize: 11, marginBottom: 16 }}>
            Cloud dashboard for your TikTok AI factory – works from phone or desktop.
          </div>
        </div>
        <div>
          <div
            className={`nav-item ${nav === "dashboard" ? "active" : ""}`}
            onClick={() => setNav("dashboard")}
          >
            <span className="icon">📊</span>
            Overview
          </div>
          <div
            className={`nav-item ${nav === "jobs" ? "active" : ""}`}
            onClick={() => setNav("jobs")}
          >
            <span className="icon">🎬</span>
            Jobs & Pipeline
          </div>
          <div
            className={`nav-item ${nav === "new" ? "active" : ""}`}
            onClick={() => setNav("new")}
          >
            <span className="icon">➕</span>
            New Job
          </div>
          <div
            className={`nav-item ${nav === "settings" ? "active" : ""}`}
            onClick={() => setNav("settings")}
          >
            <span className="icon">⚙️</span>
            Settings & Docs
          </div>
        </div>
      </aside>

      <main className="content">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
              <div>
                <div style={{fontSize:11,color:"#9ca3af",textTransform:"uppercase",letterSpacing:0.08}}>Cluster status</div>
                <div style={{fontSize:13}} className="mono">
                  {health ? `OK · ${jobs.length} jobs · ${jobs.filter(j => j.status === "completed").length} done` : "Checking..."}
                </div>
              </div>
              <div style={{display:"flex",gap:8}}>
                <button className="btn btn-ghost btn-small" onClick={loadJobs}>Sync</button>
                <button className="btn btn-primary btn-small" onClick={() => setNav("new")}>
                  <span>⚡</span>Launch new pipeline
                </button>
              </div>
            </div>
        {nav === "dashboard" && (
          <>
            <div className="section-header">
              <div>
                <h2 style={{ margin: 0, fontSize: 20 }}>Control Center</h2>
                <div className="muted">
                  Status of your AI agents and latest autopublish runs.
                </div>
              </div>
              <button className="btn btn-primary btn-small" onClick={() => setNav("new")}>
                <span>➕</span> New job
              </button>
            </div>

            <div className="cards-grid">
              <div className="card">
                <h2>Backend status</h2>
                <div className="muted" style={{ marginBottom: 8 }}>
                  Render / Railway service heartbeat
                </div>
                {health ? (
                  <>
                    <div className="pill mono" style={{ marginBottom: 8 }}>
                      <span>●</span> {health.status.toUpperCase()} – {health.env}
                    </div>
                    <div className="muted mono">
                      Last ping: {new Date(health.time).toLocaleString()}
                    </div>
                  </>
                ) : (
                  <div className="muted">Loading health...</div>
                )}
              </div>

              <div className="card">
                <h2>Pipeline summary</h2>
                <div className="muted" style={{ marginBottom: 8 }}>
                  Quick overview of how many videos you generated.
                </div>
                <div style={{ display: "flex", gap: 16 }}>
                  <div>
                    <div className="muted">Total jobs</div>
                    <div style={{ fontSize: 20, fontWeight: 600 }}>{jobs.length}</div>
                  </div>
                  <div>
                    <div className="muted">Completed</div>
                    <div style={{ fontSize: 20, fontWeight: 600 }}>
                      {jobs.filter((j) => j.status === "completed").length}
                    </div>
                  </div>
                </div>
              </div>

              <div className="card">
                <h2>Last completed video</h2>
                {lastCompleted ? (
                  <>
                    <div className="muted" style={{ marginBottom: 4 }}>
                      {lastCompleted.trendTitle}
                    </div>
                    <div className="muted" style={{ marginBottom: 8 }}>
                      Provider: <span className="mono">{lastCompleted.video?.provider}</span>
                    </div>
                    <a
                      href={lastCompleted.video?.url}
                      className="btn btn-ghost btn-small mono"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Open video URL
                    </a>
                  </>
                ) : (
                  <div className="muted">No completed jobs yet.</div>
                )}
              </div>
            </div>

            <div className="card">
              <div className="section-header">
                <h2>Recent jobs</h2>
                <button className="btn btn-ghost btn-small" onClick={loadJobs}>
                  Refresh
                </button>
              </div>
              {loadingJobs ? (
                <div className="muted">Loading jobs...</div>
              ) : jobs.length === 0 ? (
                <div className="muted">No jobs yet – create your first one.</div>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Niche</th>
                      <th>Provider</th>
                      <th>Status</th>
                      <th>Created</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedJobs.slice(0, 6).map((job) => (
                      <tr key={job.id}>
                        <td style={{ maxWidth: 180 }}>
                          <div style={{ fontSize: 12 }}>{job.trendTitle}</div>
                        </td>
                        <td>{job.niche}</td>
                        <td className="mono">{job.provider}</td>
                        <td>
                          <StatusPill status={job.status} />
                        </td>
                        <td>
                          {new Date(job.createdAt).toLocaleString(undefined, {
                            hour: "2-digit",
                            minute: "2-digit",
                            day: "2-digit",
                            month: "2-digit",
                          })}
                        </td>
                        <td>
                          <button
                            className="btn btn-ghost btn-small"
                            onClick={() => {
                              setSelectedJob(job);
                              setNav("jobs");
                            }}
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}

        {nav === "new" && (
          <div className="card">
            <div className="section-header">
              <h2>New video job</h2>
              <div className="muted">
                Define how agents should pick a trend, write script and generate video.
              </div>
            </div>

            <form onSubmit={handleCreateJob}>
              <div className="field-row">
                <div className="field">
                  <label>Niche</label>
                  <input
                    value={form.niche}
                    onChange={(e) => updateForm("niche", e.target.value)}
                    placeholder="ai-lifestyle / boxing / motivation..."
                  />
                </div>
                <div className="field">
                  <label>Channel</label>
                  <input
                    value={form.channel}
                    onChange={(e) => updateForm("channel", e.target.value)}
                    placeholder="main / backup / test"
                  />
                </div>
              </div>

              <div className="field-row">
                <div className="field">
                  <label>Length mode</label>
                  <select
                    value={form.lengthMode}
                    onChange={(e) => updateForm("lengthMode", e.target.value)}
                  >
                    <option value="auto">Auto (agent decides)</option>
                    <option value="short">Short hook (6–9s)</option>
                    <option value="long">Story (15–25s)</option>
                  </select>
                </div>
                <div className="field">
                  <label>Video provider</label>
                  <select
                    value={form.provider}
                    onChange={(e) => updateForm("provider", e.target.value)}
                  >
                    <option value="mock">Mock only (dev mode)</option>
                    <option value="sora">Sora (API placeholder)</option>
                    <option value="runway">Runway Gen-2</option>
                  </select>
                </div>
              </div>

              <div className="field-row">
                <div className="field">
                  <label>Trend source</label>
                  <select
                    value={form.autoTrend ? "auto" : "manual"}
                    onChange={(e) => updateForm("autoTrend", e.target.value === "auto")}
                  >
                    <option value="auto">Auto – let agent choose trending idea</option>
                    <option value="manual">Manual – I type title</option>
                  </select>
                </div>
                {!form.autoTrend && (
                  <div className="field">
                    <label>Manual title</label>
                    <input
                      value={form.manualTitle}
                      onChange={(e) => updateForm("manualTitle", e.target.value)}
                      placeholder="Exact hook / title for video"
                    />
                  </div>
                )}
              </div>

              <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
                <button className="btn btn-primary" type="submit" disabled={creating}>
                  {creating ? "Creating..." : "Create job"}
                </button>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setNav("dashboard")}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {nav === "jobs" && (
          <div className="cards-grid">
            <div className="card">
              <div className="section-header">
                <h2>Jobs</h2>
                <button className="btn btn-ghost btn-small" onClick={loadJobs}>
                  Refresh
                </button>
              </div>
              {jobs.length === 0 ? (
                <div className="muted">No jobs yet.</div>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Status</th>
                      <th>Provider</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedJobs.map((job) => (
                      <tr key={job.id}>
                        <td style={{ maxWidth: 180 }}>
                          <div style={{ fontSize: 12 }}>{job.trendTitle}</div>
                        </td>
                        <td>
                          <StatusPill status={job.status} />
                        </td>
                        <td className="mono">{job.provider}</td>
                        <td>
                          <button
                            className="btn btn-ghost btn-small"
                            onClick={() => setSelectedJob(job)}
                          >
                            Inspect
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="card">
              <div className="section-header">
                <h2>Pipeline details</h2>
                {selectedJob && (
                  <button
                    className="btn btn-primary btn-small"
                    onClick={() => handleRunJob(selectedJob.id)}
                    disabled={runningJobId === selectedJob.id}
                  >
                    {runningJobId === selectedJob.id ? "Running..." : "Run pipeline"}
                  </button>
                )}
              </div>

              {!selectedJob ? (
                <div className="muted">Select a job on the left to inspect its pipeline.</div>
              ) : (
                <>
                  <div style={{ marginBottom: 8 }}>
                    <div className="muted">Job ID</div>
                    <div className="mono" style={{ fontSize: 11 }}>
                      {selectedJob.id}
                    </div>
                  </div>
                  <div className="field-row">
                    <div className="field">
                      <label>Niche</label>
                      <div>{selectedJob.niche}</div>
                    </div>
                    <div className="field">
                      <label>Length mode</label>
                      <div>{selectedJob.lengthMode}</div>
                    </div>
                    <div className="field">
                      <label>Channel</label>
                      <div>{selectedJob.channel}</div>
                    </div>
                  </div>

                  <div style={{ marginTop: 8, marginBottom: 8 }}>
                    <div className="muted">Script (LLM output)</div>
                    <div className="logs-box mono" style={{ maxHeight: 120 }}>
                      {selectedJob.script?.paragraphs?.map((p, i) => (
                        <div key={i}>{p}</div>
                      ))}
                    </div>
                  </div>

                  <div className="field-row">
                    <div className="field">
                      <label>Video</label>
                      {selectedJob.video ? (
                        <>
                          <div className="muted">
                            Provider:{" "}
                            <span className="mono">{selectedJob.video.provider}</span>
                          </div>
                          <a
                            href={selectedJob.video.url}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-ghost btn-small mono"
                          >
                            Open video URL
                          </a>
                        </>
                      ) : (
                        <div className="muted">Not generated yet.</div>
                      )}
                    </div>
                    <div className="field">
                      <label>Narration</label>
                      {selectedJob.narration ? (
                        <>
                          <div className="muted">
                            Provider:{" "}
                            <span className="mono">{selectedJob.narration.provider}</span>
                          </div>
                          <a
                            href={selectedJob.narration.url}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-ghost btn-small mono"
                          >
                            Open audio URL
                          </a>
                        </>
                      ) : (
                        <div className="muted">Not generated yet.</div>
                      )}
                    </div>
                  </div>

                  <div style={{ marginTop: 8 }}>
                    <div className="muted">Logs</div>
                    <div className="logs-box mono">
                      {(selectedJob.logs || []).map((log, idx) => (
                        <div key={idx}>• {log}</div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {nav === "settings" && (
          <div className="card">
            <h2>Settings & deployment notes</h2>
            <div className="muted" style={{ marginBottom: 12 }}>
              Minimal checklist to deploy this stack on Render/Railway/Vercel and keep it
              extendable.
            </div>

            <ul style={{ fontSize: 13, paddingLeft: 18 }}>
              <li>Backend: Node.js + Express (folder: backend)</li>
              <li>Frontend: Vite + React (folder: frontend)</li>
              <li>
                Environment variables: copy <span className="mono">.env.example</span> to{" "}
                <span className="mono">.env</span> in backend and fill Sora / Runway / TikTok
                keys.
              </li>
              <li>
                Build frontend on CI/CD and point{" "}
                <span className="mono">PUBLISH_ASSETS_DIR</span> to{" "}
                <span className="mono">../frontend/dist</span>.
              </li>
              <li>
                For phone control: deploy backend + frontend to a cloud host and open URL from
                mobile browser.
              </li>
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}
