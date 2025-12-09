import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "..", "..", ".env") });

export const config = {
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || "development",
  corsOrigin: process.env.CORS_ORIGIN || "*",
  publishAssetsDir: process.env.PUBLISH_ASSETS_DIR || "../frontend/dist",

  trends: {
    url: process.env.TRENDS_PROVIDER_URL,
    apiKey: process.env.TRENDS_PROVIDER_API_KEY,
  },

  videoModels: {
    sora: {
      enabled: !!process.env.SORA_API_KEY,
      apiKey: process.env.SORA_API_KEY,
    },
    runway: {
      enabled: !!process.env.RUNWAY_API_KEY,
      apiKey: process.env.RUNWAY_API_KEY,
    },
    mock: {
      enabled: true,
    },
  },

  narrator: {
    apiKey: process.env.NARRATOR_API_KEY,
  },

  tiktok: {
    accessToken: process.env.TIKTOK_ACCESS_TOKEN,
    clientKey: process.env.TIKTOK_CLIENT_KEY,
    clientSecret: process.env.TIKTOK_CLIENT_SECRET,
    redirectUri: process.env.TIKTOK_REDIRECT_URI,
  },
};
