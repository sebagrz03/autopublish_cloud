import { buildScript } from "../src/services/scriptService.js";
import { generateVideo } from "../src/services/videoService.js";

async function run() {
  console.log("Running basic tests...");

  const script = buildScript({
    trendTitle: "Test trend",
    niche: "ai",
    lengthMode: "auto",
  });

  if (!script.fullText || !script.paragraphs || script.paragraphs.length < 2) {
    throw new Error("ScriptService failed basic structure test");
  }
  console.log("✔ ScriptService ok");

  const video = await generateVideo({ script, provider: "mock" });
  if (!video.url || !video.url.startsWith("https://")) {
    throw new Error("VideoService mock provider did not return valid URL");
  }
  console.log("✔ VideoService mock ok");

  console.log("All tests passed.");
}

run().catch(err => {
  console.error("Tests failed:", err);
  process.exit(1);
});
