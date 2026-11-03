import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

const app = express();
// Render runs behind a trusted reverse proxy; use its forwarded client IP safely.
app.set("trust proxy", 1);
app.use(helmet());
app.use(express.json({ limit: "20kb" }));

const allowedOrigin = process.env.ALLOWED_ORIGIN;
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (!origin || !allowedOrigin || origin === allowedOrigin) {
    if (origin && allowedOrigin) {
      res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
      res.setHeader("Vary", "Origin");
    }
    if (req.method === "OPTIONS") {
      res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type");
      return res.sendStatus(204);
    }
    return next();
  }
  return res.sendStatus(403);
});

app.use("/api/", rateLimit({ windowMs: 60_000, limit: 15, standardHeaders: true, legacyHeaders: false }));

app.get("/health", (_req, res) => res.json({ ok: true, service: "RR AI API" }));

app.post("/api/chat", async (req, res) => {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) return res.status(503).json({ error: "RR AI is waiting for its secure API configuration." });

    const message = typeof req.body?.message === "string" ? req.body.message.trim() : "";
    if (!message || message.length > 4000) {
      return res.status(400).json({ error: "Please enter a message under 4,000 characters." });
    }

    // Retry temporary Groq HTTP errors and network failures.
    let response;
    let lastNetworkError;
    for (let attempt = 0; attempt < 3; attempt += 1) {
      try {
        response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: "openai/gpt-oss-20b",
            messages: [
              {
                role: "system",
                content: "You are RR AI, the helpful assistant for RR GLOBAL. Be clear, respectful, age-appropriate, and honest. Do not claim capabilities you do not have. If a request is unsafe or unsuitable for a young person, respond with safe, age-appropriate guidance."
              },
              { role: "user", content: message }
            ],
            max_completion_tokens: 700
          }),
          signal: AbortSignal.timeout(25000)
        });
        lastNetworkError = undefined;
        if (![500, 502, 503, 504].includes(response.status) || attempt === 2) break;
      } catch (error) {
        lastNetworkError = error;
        console.error("Groq connection attempt failed:", error?.cause?.code || error?.name || "unknown");
        if (attempt === 2) {
          return res.status(502).json({ error: "RR AI could not reach its AI service. Please try again shortly." });
        }
      }
      await new Promise(resolve => setTimeout(resolve, 1200 * (attempt + 1)));
    }

    if (lastNetworkError && !response) {
      return res.status(502).json({ error: "RR AI could not reach its AI service. Please try again shortly." });
    }

    const data = await response.json();
    if (!response.ok) {
      console.error("Groq API error:", response.status, data?.error?.type || data?.error?.code || "unknown");
      if (response.status === 429) {
        return res.status(429).json({ error: "RR AI is temporarily at its free usage limit. Please try again later." });
      }
      if (response.status === 401 || response.status === 403) {
        return res.status(503).json({ error: "RR AI's secure API configuration needs attention." });
      }
      return res.status(502).json({ error: "The AI service could not answer right now. Please try again shortly." });
    }

    const answer = data?.choices?.[0]?.message?.content?.trim();
    if (!answer) return res.status(502).json({ error: "The AI returned an empty response. Please try again." });
    return res.json({ answer });
  } catch (error) {
    console.error("RR AI server error:", error?.message || "unknown");
    return res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

const port = Number(process.env.PORT || 3000);
app.listen(port, () => console.log(`RR AI API listening on port ${port}`));
