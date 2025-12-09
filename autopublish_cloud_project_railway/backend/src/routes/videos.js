import express from "express";
import { v4 as uuidv4 } from "uuid";
import { db } from "../db.js";
import { getTrendingIdeas } from "../services/trendService.js";
import { buildScript } from "../services/scriptService.js";
import { generateVideo } from "../services/videoService.js";
import { generateNarration } from "../services/narrationService.js";
import { publishToTikTok } from "../services/publishService.js";

export const videosRouter = express.Router();

// GET /api/jobs
videosRouter.get("/jobs", (req, res) => {
  res.json(db.getJobs());
});

// POST /api/jobs – create new job definition
videosRouter.post("/jobs", async (req, res) => {
  const {
    niche = "ai-lifestyle",
    lengthMode = "auto",
    provider = "mock",
    autoTrend = true,
    manualTitle,
    channel = "main",
  } = req.body || {};

  try {
    let trendTitle = manualTitle;
    if (autoTrend) {
      const trends = await getTrendingIdeas(niche);
      trendTitle = trends[0]?.title || "AI changed my day";
    }

    const script = buildScript({ trendTitle, niche, lengthMode });

    const job = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      niche,
      lengthMode,
      provider,
      channel,
      trendTitle,
      script,
      status: "created",
      logs: ["Job created"],
    };

    db.addJob(job);
    res.status(201).json(job);
  } catch (err) {
    console.error("Create job error:", err);
    res.status(500).json({ error: "Failed to create job" });
  }
});

// POST /api/jobs/:id/run – run full pipeline: script -> video -> narration -> publish
videosRouter.post("/jobs/:id/run", async (req, res) => {
  const jobId = req.params.id;
  const job = db.getJob(jobId);
  if (!job) {
    return res.status(404).json({ error: "Job not found" });
  }

  try {
    db.updateJob(jobId, {
      status: "processing",
      logs: [...job.logs, "Pipeline started"],
    });

    const video = await generateVideo({ script: job.script, provider: job.provider });
    const narration = await generateNarration({ script: job.script });
    const publishResult = await publishToTikTok({
      videoUrl: video.url,
      caption: job.script.fullText,
      channel: job.channel,
    });

    const updated = db.updateJob(jobId, {
      status: "completed",
      video,
      narration,
      publishResult,
      completedAt: new Date().toISOString(),
      logs: [
        ...job.logs,
        `Video generated with provider ${video.provider}`,
        `Narration provider: ${narration.provider}`,
        `Publish status: ${publishResult.status}`,
      ],
    });

    res.json(updated);
  } catch (err) {
    console.error("Run job error:", err);
    const failed = db.updateJob(jobId, {
      status: "failed",
      logs: [...job.logs, `Pipeline failed: ${err.message}`],
    });
    res.status(500).json({ error: "Pipeline failed", job: failed });
  }
});
