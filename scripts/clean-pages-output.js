import fs from "node:fs";
import path from "node:path";

const projectRoot = process.cwd();

for (const directory of ["out", ".open-next"]) {
  const target = path.join(projectRoot, directory);
  fs.rmSync(target, { recursive: true, force: true });
  console.log(`Removed stale Pages output: ${target}`);
}
