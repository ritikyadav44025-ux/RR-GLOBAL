import test from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";

const port = 31000 + Math.floor(Math.random() * 20000);
const origin = `http://127.0.0.1:${port}`;
let server;

async function waitForServer(child) {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    if (child.exitCode !== null) throw new Error("RR AI API exited before becoming ready.");
    try {
      const response = await fetch(`${origin}/health`);
      if (response.ok) return;
    } catch {}
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  throw new Error("RR AI API did not become ready within 5 seconds.");
}

test("RR AI API smoke tests", async t => {
  server = spawn(process.execPath, ["server.js"], {
    cwd: new URL("../", import.meta.url),
    env: {
      ...process.env,
      PORT: String(port),
      GROQ_API_KEY: "test-key-not-used",
      ALLOWED_ORIGIN: "https://allowed.example"
    },
    stdio: "ignore"
  });

  try {
    await waitForServer(server);

    await t.test("health endpoint reports service status", async () => {
      const response = await fetch(`${origin}/health`);
      assert.equal(response.status, 200);
      assert.deepEqual(await response.json(), { ok: true, service: "RR AI API" });
    });

    await t.test("chat rejects an empty message before contacting the provider", async () => {
      const response = await fetch(`${origin}/api/chat`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message: "   " })
      });
      assert.equal(response.status, 400);
      assert.match((await response.json()).error, /enter a message/i);
    });

    await t.test("chat rejects messages over the documented limit", async () => {
      const response = await fetch(`${origin}/api/chat`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message: "x".repeat(4001) })
      });
      assert.equal(response.status, 400);
    });

    await t.test("file analysis requires an attachment", async () => {
      const body = new FormData();
      body.set("message", "Please analyze this");
      const response = await fetch(`${origin}/api/analyze`, { method: "POST", body });
      assert.equal(response.status, 400);
      assert.match((await response.json()).error, /attach an image or PDF/i);
    });

    await t.test("disallowed browser origins are rejected", async () => {
      const response = await fetch(`${origin}/health`, {
        headers: { origin: "https://untrusted.example" }
      });
      assert.equal(response.status, 403);
    });
  } finally {
    server?.kill("SIGTERM");
  }
});
