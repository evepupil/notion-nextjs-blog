import fs from "node:fs";
import path from "node:path";

const projectRoot = process.cwd();
const openNextDir = path.join(projectRoot, ".open-next");
const assetsDir = path.join(openNextDir, "assets");
const workerFile = path.join(openNextDir, "worker.js");
const pagesWorkerFile = path.join(assetsDir, "_worker.js");

if (!fs.existsSync(workerFile)) {
  throw new Error(`OpenNext worker not found: ${workerFile}`);
}

if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

fs.copyFileSync(workerFile, pagesWorkerFile);
console.log(`Copied OpenNext worker to ${pagesWorkerFile}`);
