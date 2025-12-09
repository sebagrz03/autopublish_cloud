import { config } from "../config.js";

export async function generateNarration({ script }) {
  if (!config.narrator.apiKey) {
    // Development mode: return a mock narration track
    return {
      provider: "mock-voice",
      url: "https://example.com/mock-audio/narration.mp3",
    };
  }

  // TODO: Implement real narration provider (e.g. ElevenLabs, other TTS API)
  return {
    provider: "external-voice",
    url: "https://example.com/external-voice/narration.mp3",
  };
}
