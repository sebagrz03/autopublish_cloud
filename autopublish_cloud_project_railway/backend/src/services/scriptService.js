// Simple script generator – in real project call LLM here (OpenAI, etc.)
export function buildScript({ trendTitle, niche, lengthMode = "auto" }) {
  const targetSeconds =
    lengthMode === "short" ? 8 :
    lengthMode === "long" ? 20 :
    12; // auto

  const hook = `Stop scrolling – this ${niche} secret will change how you think about AI!`;
  const body = `Today we follow a real example: "${trendTitle}". I will show you, step by step, how AI does the heavy lifting while you just make decisions.`;
  const outro = `If you want more AI-powered content like this, follow for the next episode – it is already generating.`;

  return {
    lengthMode,
    targetSeconds,
    paragraphs: [hook, body, outro],
    fullText: [hook, body, outro].join(" "),
  };
}
