import { v4 as uuidv4 } from "uuid";
import { config } from "../config.js";

async function generateWithSora({ script }) {
  if (!config.videoModels.sora.enabled) {
    throw new Error("Sora model not configured – set SORA_API_KEY in .env");
  }
  // TODO: Replace with real Sora API call once available.
  // For now we simulate a generated video URL.
  return {
    provider: "sora",
    url: `https://cdn.example.com/videos/${uuidv4()}.mp4`,
  };
}

async function generateWithRunway({ script }) {
  if (!config.videoModels.runway.enabled) {
    throw new Error("Runway model not configured – set RUNWAY_API_KEY in .env");
  }
  // TODO: Implement Runway Gen-2 API call here.
  return {
    provider: "runway",
    url: `https://cdn.example.com/videos/${uuidv4()}.mp4`,
  };
}

async function generateMockVideo({ script }) {
  return {
    provider: "mock",
    url: `https://example.com/mock-videos/${uuidv4()}.mp4`,
  };
}

export async function generateVideo({ script, provider = "mock" }) {
  switch (provider) {
    case "sora":
      return generateWithSora({ script });
    case "runway":
      return generateWithRunway({ script });
    default:
      return generateMockVideo({ script });
  }
}
