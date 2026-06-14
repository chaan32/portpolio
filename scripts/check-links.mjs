import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const htmlFiles = [];
const skipDirs = new Set([".git", ".vercel", "node_modules"]);

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (skipDirs.has(entry.name)) continue;

    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
      continue;
    }

    if (entry.isFile() && fullPath.endsWith(".html")) {
      htmlFiles.push(fullPath);
    }
  }
}

function normalizeRef(rawRef) {
  const [pathname, hash] = rawRef.split("#");
  return { pathname, hash: hash || "" };
}

function hasAnchor(html, id) {
  const escaped = id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`\\bid=["']${escaped}["']`).test(html);
}

function shouldSkip(rawRef) {
  return (
    rawRef.startsWith("http://") ||
    rawRef.startsWith("https://") ||
    rawRef.startsWith("mailto:") ||
    rawRef.startsWith("tel:") ||
    rawRef.startsWith("data:") ||
    rawRef.startsWith("javascript:")
  );
}

walk(root);

const missing = [];

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, "utf8");
  const matches = html.matchAll(/\b(?:href|src)=["']([^"']+)["']/g);

  for (const match of matches) {
    const rawRef = match[1].trim();
    if (!rawRef || shouldSkip(rawRef)) continue;

    const { pathname, hash } = normalizeRef(rawRef);
    const sourceLabel = path.relative(root, file);
    const baseDir = path.dirname(file);
    const localTarget = pathname || path.basename(file);
    const resolved = path.resolve(baseDir, decodeURI(localTarget));

    if (!resolved.startsWith(root)) {
      missing.push(`${sourceLabel}: ${rawRef} points outside the project`);
      continue;
    }

    if (!fs.existsSync(resolved)) {
      missing.push(`${sourceLabel}: missing ${rawRef}`);
      continue;
    }

    if (hash && resolved.endsWith(".html")) {
      const targetHtml = fs.readFileSync(resolved, "utf8");
      if (!hasAnchor(targetHtml, hash)) {
        missing.push(`${sourceLabel}: missing anchor #${hash} in ${path.relative(root, resolved)}`);
      }
    }
  }
}

if (missing.length > 0) {
  console.error("Broken local references found:");
  for (const issue of missing) {
    console.error(`- ${issue}`);
  }
  process.exit(1);
}

console.log(`OK: checked ${htmlFiles.length} HTML files.`);
