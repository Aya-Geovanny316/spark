import { cp, mkdir, rename, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";

const root = process.cwd();
const temp = path.join(os.tmpdir(), `spark-pages-${process.pid}-${Date.now()}`);
await mkdir(temp, { recursive: true });
const swaps = [
  [path.join(root, "src/app/page.tsx"), path.join(temp, "page.tsx")],
  [path.join(root, "src/app/admin"), path.join(temp, "admin")],
  [path.join(root, "src/app/api"), path.join(temp, "api")],
  [path.join(root, "src/middleware.ts"), path.join(temp, "middleware.ts")],
];

async function moveIfPresent(source, destination) {
  if (existsSync(source)) { await mkdir(path.dirname(destination), { recursive: true }); await rename(source, destination); return true; }
  return false;
}

let moved = [];
try {
  for (const [source, destination] of swaps) if (await moveIfPresent(source, destination)) moved.push([source, destination]);
  await cp(path.join(root, "src/app/page.github.tsx"), path.join(root, "src/app/page.tsx"));
  const command = process.platform === "win32" ? "npm.cmd" : "npm";
  const result = await new Promise(resolve => { const child = spawn(command, ["run", "build"], { cwd: root, env: { ...process.env, GITHUB_PAGES: "true" }, stdio: "inherit", shell: process.platform === "win32" }); child.on("close", code => resolve(code ?? 1)); });
  if (result !== 0) process.exitCode = result;
} finally {
  await rm(path.join(root, "src/app/page.tsx"), { force: true });
  for (const [source, destination] of moved.reverse()) { await rm(source, { recursive: true, force: true }); await rename(destination, source); }
  await rm(temp, { recursive: true, force: true });
}
