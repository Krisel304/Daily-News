import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const projectRoot = new URL("../", import.meta.url);

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("production worker renders the Pulse application", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /Pulse\./);
  assert.match(html, /每日 AI 情报/);
});

test("keeps the three product areas and local persistence contracts", async () => {
  const [page, layout, styles, packageJson] = await Promise.all([
    readFile(new URL("app/page.tsx", projectRoot), "utf8"),
    readFile(new URL("app/layout.tsx", projectRoot), "utf8"),
    readFile(new URL("app/globals.css", projectRoot), "utf8"),
    readFile(new URL("package.json", projectRoot), "utf8"),
  ]);

  assert.match(page, /今日简报/);
  assert.match(page, /收藏/);
  assert.match(page, /笔记/);
  assert.match(page, /pulse-saved/);
  assert.match(page, /pulse-folders/);
  assert.match(page, /pulse-notes/);
  assert.match(page, /30 秒看懂/);
  assert.match(page, /为什么值得关注/);
  assert.match(layout, /Pulse\. — 每日 AI 情报/);
  assert.match(styles, /prefers-reduced-motion/);
  assert.match(packageJson, /"name": "pulse-daily-ai-news"/);
});
