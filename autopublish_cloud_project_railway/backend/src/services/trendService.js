import fetch from "node-fetch";
import { config } from "../config.js";

export async function getTrendingIdeas(niche = "general") {
  // If you have a real trends API, implement it here.
  if (!config.trends.url || !config.trends.apiKey) {
    // Fallback mock trends for development
    return [
      { id: "mock-1", title: "AI transforms my daily routine", niche },
      { id: "mock-2", title: "Before vs After using AI tools", niche },
      { id: "mock-3", title: "This AI video changed my mind", niche },
    ];
  }

  try {
    const res = await fetch(config.trends.url, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${config.trends.apiKey}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Trends API error: ${res.status}`);
    }
    const data = await res.json();
    // Normalize to simple array of {id, title}
    return (data.trends || []).map((t, index) => ({
      id: t.id || `api-${index}`,
      title: t.title || t.name || "Trend",
      niche,
    }));
  } catch (err) {
    console.error("getTrendingIdeas error:", err.message);
    // Fallback mock if API fails
    return [
      { id: "fallback-1", title: "AI vs Human challenge", niche },
      { id: "fallback-2", title: "I let AI control my day", niche },
    ];
  }
}
