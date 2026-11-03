import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

const app = express();
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
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(503).json({ error: "AI service is not configured yet." });

    const message = typeof req.body?.message === "string" ? req.body.message.trim() : "";
    if (!message || message.length > 4000) {
      return res.status(400).json({ error: "Please enter a message under 4,000 characters." });
    }

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: "You are RR AI, the helpful assistant for RR GLOBAL. Be clear, respectful, age-appropriate, and honest. Do not claim capabilities you do not have." }]
          },
          contents: [{ role: "user", parts: [{ text: message }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 700 }
        })
      }
    );

    const data = await response.json();
    if (!response.ok) {
      console.error("Gemini API error:", response.status, data?.error?.status || "unknown");
      return res.status(response.status === 429 ? 429 : 502).json({
        error: response.status === 429 ? "Free usage limit reached. Please try again later." : "The AI service could not answer right now."
      });
    }

    const answer = data?.candidates?.[0]?.content?.parts
      ?.map(part => part.text || "")
      .join("")
      .trim();

    if (!answer) return res.status(502).json({ error: "The AI returned an empty response. Please try again." });
    return res.json({ answer });
  } catch (error) {
    console.error("RR AI server error:", error?.message || "unknown");
    return res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

const port = Number(process.env.PORT || 3000);
app.listen(port, () => console.log(`RR AI API listening on port ${port}`));
