import fs from "node:fs/promises";
import path from "node:path";

const BLOG_ROOT = path.resolve("src/content/blog");
const BACKUP_ROOT = "/tmp/chat-note-backup-2026-02-12";
const MANIFEST_PATH = path.resolve("docs/migration/2026-02-12-blog-reorg-manifest.md");

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function moveGitWorktreeIfNeeded() {
  const from = path.join(BLOG_ROOT, "ai", "git-worktree-隔离工作空间详解.md");
  const to = path.join(BLOG_ROOT, "git", "git-worktree-隔离工作空间详解.md");
  if (!(await exists(from))) return;

  await fs.mkdir(path.dirname(to), { recursive: true });
  if (await exists(to)) {
    await fs.unlink(from);
    return;
  }
  await fs.rename(from, to);
}

function stripQuotes(input = "") {
  return input.replace(/^['"]|['"]$/g, "").trim();
}

function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return null;
  const head = match[1];
  const body = match[2];
  const obj = {};
  for (const line of head.split("\n")) {
    const idx = line.indexOf(":");
    if (idx <= 0) continue;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();
    obj[key] = value;
  }
  return { obj, body };
}

function parseUSDate(input) {
  if (!input) return "";
  const m = input.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (!m) return "";
  const month = m[1].padStart(2, "0");
  const day = m[2].padStart(2, "0");
  const year = m[3];
  return `${year}-${month}-${day}`;
}

function sanitizeDescription(description, title) {
  let out = stripQuotes(description)
    .replace(/^[:：,，.。;；\-\s]+/, "")
    .replace(/\s+/g, " ")
    .trim();

  if (out.length < 12) {
    out = `${stripQuotes(title)} 的整理笔记。`;
  }

  if (out.length > 155) {
    out = `${out.slice(0, 152).trimEnd()}...`;
  }

  if (!/[。！？.!?]$/.test(out)) {
    out += "。";
  }

  return out;
}

async function* walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(full);
      continue;
    }
    if (/\.(md|mdx)$/i.test(entry.name)) {
      yield full;
    }
  }
}

async function loadBackupMeta(sourcePath) {
  const baseName = path.basename(sourcePath);
  const backupPath = path.join(BACKUP_ROOT, baseName);
  if (!(await exists(backupPath))) {
    return { pubDate: "", updatedDate: "" };
  }

  const raw = await fs.readFile(backupPath, "utf8");
  const created = parseUSDate((raw.match(/\*\*Created:\*\*\s*([^\n]+)/i) || [])[1] || "");
  const updated = parseUSDate((raw.match(/\*\*Updated:\*\*\s*([^\n]+)/i) || [])[1] || "");
  const exported = parseUSDate((raw.match(/\*\*Exported:\*\*\s*([^\n]+)/i) || [])[1] || "");

  const pubDate = created || exported;
  const updatedDate = updated || pubDate || exported;
  return { pubDate, updatedDate };
}

function formatFrontmatter(obj, body) {
  const lines = [
    "---",
    `title: ${JSON.stringify(stripQuotes(obj.title || "Untitled"))}`,
    `description: ${JSON.stringify(stripQuotes(obj.description || ""))}`,
    `pubDate: ${JSON.stringify(stripQuotes(obj.pubDate || ""))}`,
    `updatedDate: ${JSON.stringify(stripQuotes(obj.updatedDate || ""))}`,
    `category: ${JSON.stringify(stripQuotes(obj.category || "infra"))}`,
    `tags: [${JSON.stringify(stripQuotes(obj.category || "infra"))}]`,
    `sourcePath: ${JSON.stringify(stripQuotes(obj.sourcePath || ""))}`,
    `sourceVault: ${JSON.stringify(stripQuotes(obj.sourceVault || "chat-export"))}`,
    "---",
    "",
  ];
  return `${lines.join("\n")}${body.trimEnd()}\n`;
}

function extractMainNoteForIndex(body) {
  const m = body.match(/\]\(\/blog\/([^\)]+)\/\)/);
  if (!m) return "";
  return m[1].replace(/\/$/, "");
}

async function main() {
  await moveGitWorktreeIfNeeded();

  const rows = [];
  const byCategory = new Map();
  let processed = 0;

  for await (const filePath of walk(BLOG_ROOT)) {
    const raw = await fs.readFile(filePath, "utf8");
    const parsed = parseFrontmatter(raw);
    if (!parsed) continue;

    const { obj, body } = parsed;
    if (stripQuotes(obj.sourceVault || "") !== "chat-export") continue;

    const rel = path.relative(BLOG_ROOT, filePath).replace(/\\/g, "/");
    const categoryFromPath = rel.split("/")[0];
    const sourcePath = stripQuotes(obj.sourcePath || "");
    const title = stripQuotes(obj.title || "Untitled");

    const backupMeta = await loadBackupMeta(sourcePath);

    obj.title = title;
    obj.category = categoryFromPath;
    obj.description = sanitizeDescription(obj.description || "", title);

    if (backupMeta.pubDate) {
      obj.pubDate = backupMeta.pubDate;
    }
    if (backupMeta.updatedDate) {
      obj.updatedDate = backupMeta.updatedDate;
    } else if (!stripQuotes(obj.updatedDate || "")) {
      obj.updatedDate = stripQuotes(obj.pubDate || "");
    }

    const next = formatFrontmatter(obj, body);
    if (next !== raw) {
      await fs.writeFile(filePath, next, "utf8");
    }

    const type = /（索引）$/.test(title) || /-index\.md$/i.test(rel) ? "index" : "main";
    const note =
      type === "index"
        ? (() => {
            const mainRel = extractMainNoteForIndex(body);
            return mainRel ? `主文: ${mainRel}.md` : "";
          })()
        : "";

    rows.push({
      source: sourcePath,
      target: `src/content/blog/${rel}`,
      category: categoryFromPath,
      type,
      note,
    });
    byCategory.set(categoryFromPath, (byCategory.get(categoryFromPath) || 0) + 1);
    processed += 1;
  }

  rows.sort((a, b) => a.source.localeCompare(b.source, "zh-CN"));

  const indexCount = rows.filter((r) => r.type === "index").length;

  const manifestLines = [
    "# 2026-02-12 Blog Reorganization Manifest",
    "",
    "- Dry run: no",
    `- Source files: ${rows.length}`,
    `- Output files: ${rows.length}`,
    `- Duplicate index files: ${indexCount}`,
    "",
    "## Category Summary",
    "",
    "| Category | Count |",
    "| --- | ---: |",
    ...[...byCategory.entries()]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([category, count]) => `| ${category} | ${count} |`),
    "",
    "## File Mapping",
    "",
    "| Source | Target | Category | Type | Note |",
    "| --- | --- | --- | --- | --- |",
    ...rows.map(
      (row) =>
        `| ${row.source} | ${row.target} | ${row.category} | ${row.type} | ${row.note} |`,
    ),
    "",
  ];

  await fs.mkdir(path.dirname(MANIFEST_PATH), { recursive: true });
  await fs.writeFile(MANIFEST_PATH, `${manifestLines.join("\n")}\n`, "utf8");

  console.log(
    JSON.stringify(
      {
        processed,
        categories: Object.fromEntries([...byCategory.entries()].sort()),
        manifest: MANIFEST_PATH,
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
