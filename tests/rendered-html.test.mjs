import assert from "node:assert/strict";
import test from "node:test";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }), {
    ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
  }, { waitUntil() {}, passThroughOnException() {} });
}

test("server-renders the finished landing page", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /<title>Python Future Lab<\/title>/i);
  assert.match(html, /블록으로 이해하고/);
  assert.match(html, /첫 번째 임무/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/);
});

test("server-renders the trial mission route", async () => {
  const response = await render("/mission");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /에너지 셀을 회수하라/);
  assert.match(html, /Python 코드/);
});
