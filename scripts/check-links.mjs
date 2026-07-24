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
  const cleanPathname = pathname.split("?")[0];
  return { pathname: cleanPathname, hash: hash || "" };
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

function validateSfepContent() {
  const sfepPath = path.join(root, "projects", "sfep.html");
  const html = fs.readFileSync(sfepPath, "utf8");
  const normalizedHtml = html.replace(/\s+/g, " ");
  const required = [
    "Project Summary",
    "대규모 제조 설비 이벤트를 실시간 처리하는 Smart Factory Backend 시스템입니다.",
    "이벤트 수집부터 저장, 이상 예측, 운영 모니터링까지 연결",
    "Storage Consumer Group의 Partition 기반 병렬 소비 구조 구성, Alert Consumer Group의 실시간 위험 알림 전용 흐름 분리",
    "53,611ms → 1,849ms 처리 시간 단축",
    "Storage / Alert 독립 처리",
    "Consumer 병렬 처리 Benchmark 최대 처리량",
    "Storage Consumer Group 기준으로 Kafka Partition 6개를 Consumer 3개가 병렬 처리하도록 구성",
    "Benchmark Result",
    "대량 설비 이벤트 버퍼링",
    "Producer / Consumer 비동기 분리",
    "Consumer Lag 완화 및 처리량 확장",
    "DB 저장 병목이 위험 알림 처리에 직접 전파되지 않도록",
    "일부 Consumer는 할당받을 Partition이 없어 유휴 상태가 됩니다.",
    "AI 기반 실시간 설비 고장 위험 알림",
    "Partition 기반 병렬 처리",
    "Consumer Lag 완화",
    "tech-reason-list",
  ];
  const forbidden = [
    "Storage Consumer Group 내부에서 Partition 기반 병렬 소비 구조를 구성했습니다.",
    "로컬 Benchmark 최대 처리량",
    "tech-reason-eyebrow",
    "Event Pipeline",
    "Parallel Consume",
    "Bulk Write",
    "Model Serving",
    "Event Storage",
    "Local Infra",
    "Swing Event Bus",
    "DB 저장 병목이 발생해도 실시간 위험 알림이 영향을 받지 않도록",
    "Consumer 수는 Partition 수를 초과할 수 없음",
    "AI 기반 고장 위험 예측 기반 실시간 위험 설비 알림",
  ];

  for (const text of required) {
    if (!normalizedHtml.includes(text)) {
      missing.push(`projects/sfep.html: missing required copy "${text}"`);
    }
  }

  for (const text of forbidden) {
    if (normalizedHtml.includes(text)) {
      missing.push(`projects/sfep.html: obsolete copy remains "${text}"`);
    }
  }

  const problemIndex = html.indexOf("<strong>Manufacturing Problem</strong>");
  const summaryIndex = html.indexOf("Project Summary");
  const solutionIndex = html.indexOf("<strong>Solution</strong>");

  if (
    summaryIndex === -1 ||
    problemIndex === -1 ||
    solutionIndex === -1 ||
    !(summaryIndex < problemIndex && problemIndex < solutionIndex)
  ) {
    missing.push(
      "projects/sfep.html: Overview order must be Project Summary, Manufacturing Problem, Solution",
    );
  }
}

validateSfepContent();

function validateImprovementNumberingStyles() {
  const stylesPath = path.join(root, "assets", "styles.css");
  const styles = fs.readFileSync(stylesPath, "utf8");
  const required = [
    "counter-reset: improvement;",
    "counter-increment: improvement;",
    "counter(improvement, decimal-leading-zero)",
  ];

  for (const text of required) {
    if (!styles.includes(text)) {
      missing.push(`assets/styles.css: missing improvement numbering style "${text}"`);
    }
  }
}

validateImprovementNumberingStyles();

function validateRpsContent() {
  const rpsPath = path.join(root, "projects", "rps.html");

  if (!fs.existsSync(rpsPath)) {
    missing.push("projects/rps.html: missing RPS page");
    return;
  }

  const html = fs.readFileSync(rpsPath, "utf8");
  const normalizedHtml = html.replace(/\s+/g, " ");
  const required = [
    "Project Summary",
    "End-to-End 스마트팩토리 안전 시스템",
    "Vision Pipeline Engineering",
    "Multi View Coordinate System",
    "AI Risk Prediction",
    "Real-Time Optimization",
    "Backend Integration",
    "Project Highlights",
    "RTSP Multi View",
    "BEV Coordinate System",
    "GRU Fusion Model",
    "MQTT Alert",
    "LLM Report Generation",
    "Qwen 기반 LLM 사고 리포트 생성",
    "Backend Flow",
    "Spring Backend",
    "PostgreSQL Accident Log",
  ];

  for (const text of required) {
    if (!normalizedHtml.includes(text)) {
      missing.push(`projects/rps.html: missing required copy "${text}"`);
    }
  }

  const summaryIndex = normalizedHtml.indexOf("Project Summary");
  const problemIndex = normalizedHtml.indexOf("Manufacturing Problem");
  const solutionIndex = normalizedHtml.indexOf("Solution");

  if (
    summaryIndex === -1 ||
    problemIndex === -1 ||
    solutionIndex === -1 ||
    !(summaryIndex < problemIndex && problemIndex < solutionIndex)
  ) {
    missing.push(
      "projects/rps.html: Overview order must be Project Summary, Manufacturing Problem, Solution",
    );
  }
}

validateRpsContent();

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
