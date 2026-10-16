import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import fs from "node:fs";
import http from "node:http";
import net from "node:net";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { VERSION } from "./config.js";
import { getAgentIdentityError } from "./open-canvas.js";

test("open-canvas explains when an unidentified legacy Agent is already running", () => {
    const error = getAgentIdentityError({
        ok: true,
        service: "supdance-canvas-agent",
        protocolVersion: 6,
        url: "http://127.0.0.1:17372",
    }, "http://127.0.0.1:17372");

    assert.match(error || "", /older|legacy/i);
    assert.match(error || "", new RegExp(VERSION.replaceAll(".", "\\.")));
});

test("open-canvas accepts the installed 0.1.0 Agent for live-site compatibility", () => {
    const error = getAgentIdentityError({
        ok: true,
        service: "supdance-canvas-agent",
        agentVersion: "0.1.0",
        protocolVersion: 6,
        url: "http://127.0.0.1:17372",
    }, "http://127.0.0.1:17372");

    assert.equal(error, null);
});

test("open-canvas reports a protocol mismatch even when the Agent package version matches", () => {
    const error = getAgentIdentityError({
        ok: true,
        service: "supdance-canvas-agent",
        agentVersion: VERSION,
        protocolVersion: 5,
        url: "http://127.0.0.1:17372",
    }, "http://127.0.0.1:17372");

    assert.match(error || "", /protocol mismatch.*running 5, expected 6/i);
});

test("open-canvas accepts the expected Agent identity", () => {
    assert.equal(getAgentIdentityError({
        ok: true,
        service: "supdance-canvas-agent",
        agentVersion: VERSION,
        protocolVersion: 6,
        url: "http://127.0.0.1:17372",
    }, "http://127.0.0.1:17372"), null);
});

test("open reuses the installed 0.1.0 Agent instead of starting a duplicate", { timeout: 10_000 }, async () => {
    await withIdentityServer({
        ok: true,
        service: "supdance-canvas-agent",
        agentVersion: "0.1.0",
        protocolVersion: 6,
    }, async (url) => {
        const result = await runOpen(url);
        assert.equal(result.code, 0);
        assert.match(result.stdout, /SupDance Canvas Agent ready/);
    });
});

test("open explains when an unrelated service occupies the Agent port", { timeout: 10_000 }, async () => {
    await withIdentityServer(null, async (url) => {
        const result = await runOpen(url);
        assert.equal(result.code, 1);
        assert.match(result.stderr, /port is occupied by another process/i);
    });
});

async function withIdentityServer(identity: Record<string, unknown> | null, run: (url: string) => Promise<void>) {
    const server = http.createServer((request, response) => {
        if (request.method === "POST" && request.url === "/launch") {
            response.setHeader("content-type", "application/json");
            response.end(JSON.stringify({ ok: true, url: `http://127.0.0.1:${port}/launch/test` }));
            return;
        }
        if (request.url !== "/identity" || !identity) {
            response.writeHead(404).end();
            return;
        }
        response.setHeader("content-type", "application/json");
        response.end(JSON.stringify({ ...identity, url: `http://127.0.0.1:${port}` }));
    });
    const port = await unusedPort();
    await new Promise<void>((resolve, reject) => {
        server.once("error", reject);
        server.listen(port, "127.0.0.1", resolve);
    });
    try {
        await run(`http://127.0.0.1:${port}`);
    } finally {
        await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
    }
}

async function unusedPort() {
    const probe = net.createServer();
    await new Promise<void>((resolve, reject) => {
        probe.once("error", reject);
        probe.listen(0, "127.0.0.1", resolve);
    });
    const address = probe.address();
    assert.ok(address && typeof address !== "string");
    const port = address.port;
    await new Promise<void>((resolve, reject) => probe.close((error) => error ? reject(error) : resolve()));
    return port;
}

async function runOpen(url: string) {
    const home = fs.mkdtempSync(path.join(os.tmpdir(), "supdance-open-agent-test-"));
    const configDir = path.join(home, ".supdance-canvas");
    fs.mkdirSync(configDir, { recursive: true, mode: 0o700 });
    fs.writeFileSync(path.join(configDir, "canvas-agent.json"), JSON.stringify({ url, token: "open-test-token" }), { mode: 0o600 });
    const packageRoot = process.cwd();
    try {
        return await new Promise<{ code: number | null; stdout: string; stderr: string }>((resolve, reject) => {
            const child = spawn(process.execPath, [
                path.join(packageRoot, "node_modules/tsx/dist/cli.mjs"),
                path.join(packageRoot, "src/index.ts"),
                "open",
                "--no-browser",
            ], {
                cwd: packageRoot,
                env: { ...process.env, HOME: home, USERPROFILE: home },
                stdio: ["ignore", "pipe", "pipe"],
            });
            let stdout = "";
            let stderr = "";
            child.stdout?.setEncoding("utf8").on("data", (chunk: string) => { stdout += chunk; });
            child.stderr?.setEncoding("utf8").on("data", (chunk: string) => { stderr += chunk; });
            child.once("error", reject);
            child.once("close", (code) => resolve({ code, stdout, stderr }));
        });
    } finally {
        fs.rmSync(home, { recursive: true, force: true });
    }
}
