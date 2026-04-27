import fs from "node:fs";
import path from "node:path";

const projectRoot = process.cwd();
const outputDir = path.join(projectRoot, "out");
const redirectsFile = path.join(outputDir, "_redirects");

if (!fs.existsSync(outputDir)) {
  throw new Error(`Next static export output not found: ${outputDir}`);
}

const redirects = [
  "/posts/en/:slug/ /en/posts/:slug/ 301",
  "/posts/:slug/ /zh/posts/:slug/ 301",
  "/posts/en/:slug /en/posts/:slug/ 301",
  "/posts/:slug /zh/posts/:slug/ 301",
].join("\n");

fs.writeFileSync(redirectsFile, `${redirects}\n`, "utf8");
console.log(`Wrote Cloudflare Pages redirects to ${redirectsFile}`);
