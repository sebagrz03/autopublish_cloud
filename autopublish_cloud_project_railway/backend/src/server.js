import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { config } from "./config.js";
import { videosRouter } from "./routes/videos.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({ origin: config.corsOrigin }));
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    env: config.nodeEnv,
    time: new Date().toISOString(),
  });
});

app.use("/api", videosRouter);

// Serve built frontend if available
const staticDir = path.resolve(__dirname, config.publishAssetsDir);
app.use(express.static(staticDir));
app.get("*", (req, res) => {
  res.sendFile(path.join(staticDir, "index.html"));
});

app.listen(config.port, () => {
  console.log(`Backend listening on port ${config.port}`);
});
