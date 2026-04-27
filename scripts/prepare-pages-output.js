import fs from "node:fs";
import path from "node:path";

const projectRoot = process.cwd();
const openNextDir = path.join(projectRoot, ".open-next");
const assetsDir = path.join(openNextDir, "assets");
const workerFile = path.join(openNextDir, "worker.js");
const pagesWorkerFile = path.join(assetsDir, "_worker.js");
const runtimeEntries = [
  ".build",
  "cloudflare",
  "middleware",
  "server-functions",
];

if (!fs.existsSync(workerFile)) {
  throw new Error(`OpenNext worker not found: ${workerFile}`);
}

if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

fs.copyFileSync(workerFile, pagesWorkerFile);
console.log(`Copied OpenNext worker to ${pagesWorkerFile}`);

for (const entry of runtimeEntries) {
  const source = path.join(openNextDir, entry);
  const destination = path.join(assetsDir, entry);

  if (!fs.existsSync(source)) {
    throw new Error(`OpenNext runtime dependency not found: ${source}`);
  }

  fs.rmSync(destination, { recursive: true, force: true });
  fs.cpSync(source, destination, { recursive: true });
  console.log(`Copied OpenNext runtime dependency to ${destination}`);
}
