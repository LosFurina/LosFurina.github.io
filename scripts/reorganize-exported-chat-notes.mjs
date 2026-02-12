import fs from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve("src/content/blog");
const DRY_RUN = process.argv.includes("--dry-run");
const SOURCE_PATTERN = /^(ChatGPT|Gemini)-.*\.md$/i;
const CATEGORY_DIRS = [
  "linux",
  "git",
  "docker",
  "infra",
  "windows",
  "english",
  "network",
  "security",
  "ai",
  "career",
];

const EXPLICIT_CATEGORY = new Map([
  ["apache与mit协议对比", "career"],
  ["arch davinci 快捷键失效", "linux"],
  ["arch obs 音频问题", "linux"],
  ["arch微信发送文件问题", "linux"],
  ["arch系统迁移教程", "linux"],
  ["baloo_file_extractor 介绍", "linux"],
  ["btop cpu占用显示0%", "linux"],
  ["git保存大文件方法", "git"],
  ["gpg 配置与使用", "security"],
  ["hashmap 快速查找原理", "infra"],
  ["let's encrypt 泛域名证书", "security"],
  ["linux 权限控制原理", "security"],
  ["markdown转pdf工具推荐", "infra"],
  ["nat穿透与p2p连接", "network"],
  ["nvme读写速度标准", "infra"],
  ["pcie设备种类总结", "infra"],
  ["rust 智能指针区别", "infra"],
  ["set desktop icon archlinux", "linux"],
  ["wsl磁盘开销分析", "linux"],
  ["yaml dash语法解释", "infra"],
  ["主机开机问题排查", "linux"],
  ["什么是clip模型", "ai"],
  ["内卷形成原因探讨", "career"],
  ["分卷压缩与解压", "linux"],
  ["操作sharelatex docker容器", "docker"],
  ["查剧平台方法", "career"],
  ["查看linux用户组", "linux"],
  ["符号读法解析", "career"],
  ["网卡限速方法", "network"],
  ["蓝牙名称由来", "career"],
  ["arch linux f12 键功能切换指南", "linux"],
  ["arch linux 安装最新版 neovim", "linux"],
  ["arch 输入法窗口切换问题", "linux"],
  ["bg3 mod manager 快捷键问题排查", "linux"],
  ["github 协作规范执行指南", "git"],
  ["git merge vs. rebase: 核心区别", "git"],
  ["git worktree:隔离工作空间详解", "git"],
  ["git worktree：隔离工作空间详解", "git"],
  ["http 错误码比喻与速记", "network"],
  ["k3s 双节点集群部署指南", "infra"],
  ["k8s vs k3s: ingress 体验对比", "infra"],
  ["kubectl rollout 命令详解", "infra"],
  ["linux 2> 错误重定向用法", "linux"],
  ["neovim 核心技巧与现代配置", "linux"],
  ["rclone vs. google drive desktop", "infra"],
  ["uri 与 url 的区别", "network"],
  ["web 页面嵌入 python 代码玩法", "infra"],
  ["wireguard windows linux macos 安装", "network"],
  ["博客框架推荐与比较", "infra"],
  ["大厂规范日志格式与实践", "infra"],
  ["日语动漫称谓含义解析", "career"],
  ["日麻场风与游戏进程区别", "career"],
  ["有没有能做pdf ocr的工具", "infra"],
]);

function normalizeTitleKey(input) {
  return input
    .toLowerCase()
    .normalize("NFKC")
    .replace(/^(chatgpt|gemini)-/i, "")
    .replace(/\s*\(\d+\)\s*$/g, "")
    .replace(/[：:]/g, ":")
    .replace(/\s+/g, " ")
    .trim();
}

function slugify(input) {
  const cleaned = input
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[’'"`]/g, "")
    .replace(/[：:]/g, "-")
    .replace(/%3f/gi, "")
    .replace(/[\u3000\s]+/g, "-")
    .replace(/[()（）【】\[\]{}<>]/g, "-")
    .replace(/[!,.?！？，。；;、/\\|]+/g, "-")
    .replace(/&/g, "-and-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return cleaned || "untitled-note";
}

function stripMarkdown(input) {
  return input
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/^\s{0,3}#{1,6}\s+/gm, "")
    .replace(/^\s*[-*+]\s+/gm, "")
    .replace(/^\s*\d+\.\s+/gm, "")
    .replace(/[*_~>#]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function splitSentences(input) {
  return input
    .split(/(?<=[。！？.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function firstUsefulSentence(input, fallback) {
  const sentences = splitSentences(stripMarkdown(input));
  const candidate = sentences.find((s) => s.length >= 20) || sentences[0];
  return candidate || fallback;
}

function parseTitle(raw, fallbackBaseName) {
  const heading = raw.match(/^#\s+(.+)$/m);
  if (heading) return heading[1].trim();
  return fallbackBaseName;
}

function parseMeta(raw) {
  const linkMatch = raw.match(/\*\*Link:\*\*\s*\[[^\]]+\]\((https?:\/\/[^)]+)\)/i);
  const createdMatch = raw.match(/\*\*Created:\*\*\s*([^\n]+)/i);
  const updatedMatch = raw.match(/\*\*Updated:\*\*\s*([^\n]+)/i);
  return {
    link: linkMatch ? linkMatch[1].trim() : "",
    created: createdMatch ? createdMatch[1].trim() : "",
    updated: updatedMatch ? updatedMatch[1].trim() : "",
  };
}

function parsePairs(raw) {
  const lines = raw.replace(/\r\n/g, "\n").split("\n");
  const pairs = [];
  let mode = "none";
  let current = { prompt: "", response: "" };

  function pushCurrent() {
    const p = current.prompt.trim();
    const r = current.response.trim();
    if (p || r) {
      pairs.push({ prompt: p, response: r });
    }
    current = { prompt: "", response: "" };
  }

  for (const line of lines) {
    if (/^##\s*Prompt\s*[:：]?\s*$/i.test(line.trim())) {
      if (mode === "response") {
        pushCurrent();
      }
      mode = "prompt";
      continue;
    }
    if (/^##\s*Response\s*[:：]?\s*$/i.test(line.trim())) {
      mode = "response";
      continue;
    }

    if (mode === "prompt") {
      current.prompt += `${line}\n`;
    } else if (mode === "response") {
      current.response += `${line}\n`;
    }
  }

  pushCurrent();

  return pairs.map((pair) => ({
    prompt: pair.prompt.trim(),
    response: pair.response.replace(/^#{3,6}\s*Gemini said\s*$/gim, "").trim(),
  }));
}

function extractParagraphs(text) {
  return text
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^[-*]\s+$/gm, "")
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter((p) => p.length >= 30);
}

function extractBulletsFromText(text) {
  const bullets = [];
  const seen = new Set();
  const regex = /^\s*(?:[-*]|\d+\.)\s+(.+)$/gm;
  for (const match of text.matchAll(regex)) {
    const line = stripMarkdown(match[1]).replace(/^\*+|\*+$/g, "").trim();
    if (!line || line.length < 8) continue;
    if (seen.has(line)) continue;
    seen.add(line);
    bullets.push(line);
    if (bullets.length >= 6) break;
  }
  return bullets;
}

function extractCodeBlocks(text) {
  const blocks = [];
  const seen = new Set();
  const regex = /```[a-zA-Z0-9_-]*\n[\s\S]*?```/g;
  for (const match of text.matchAll(regex)) {
    const block = match[0].trim();
    if (block.length < 16) continue;
    if (seen.has(block)) continue;
    seen.add(block);
    blocks.push(block);
  }
  return blocks;
}

function trimForExcerpt(text, maxChars = 220) {
  const compact = stripMarkdown(text).replace(/\s+/g, " ").trim();
  if (compact.length <= maxChars) return compact;
  return `${compact.slice(0, maxChars - 3).trimEnd()}...`;
}

function makeDescription(title, background, bullets) {
  const first = bullets[0] || background || `${title} 的结构化整理笔记。`;
  let value = first.replace(/\s+/g, " ").trim();
  if (value.length > 145) {
    value = `${value.slice(0, 142).trimEnd()}...`;
  }
  if (!/[。！？.!?]$/.test(value)) {
    value += "。";
  }
  return value;
}

function chooseCategory(title, bodyText) {
  const normalizedTitle = normalizeTitleKey(title);
  if (EXPLICIT_CATEGORY.has(normalizedTitle)) {
    return EXPLICIT_CATEGORY.get(normalizedTitle);
  }

  const hay = `${title}\n${bodyText}`.toLowerCase();

  if (/(clip|人工智能|机器学习|模型|\\bai\\b|\\bllm\\b)/i.test(hay)) return "ai";
  if (/(gpg|证书|ssl|tls|encrypt|加密|权限控制)/i.test(hay)) return "security";
  if (/(nat|p2p|wireguard|url|uri|http|网卡|转发|端口|ingress)/i.test(hay)) return "network";
  if (/(内卷|动漫|日麻|查剧|称谓)/i.test(hay)) return "career";
  if (/(git|github|rebase|merge|commit|worktree)/i.test(hay)) return "git";
  if (/(docker|容器|compose)/i.test(hay)) return "docker";
  if (/(arch|linux|wsl|neovim|bash|用户组|输入法|obs|davinci|desktop icon)/i.test(hay)) return "linux";

  return "infra";
}

function getBestPracticeBullets(category) {
  const generic = [
    "在生产或关键环境执行前，先在测试环境完整演练一遍。",
    "把可复用命令和配置沉淀为脚本，避免手工重复操作。",
    "记录变更前后状态与回滚方案，降低故障恢复成本。",
  ];

  if (category === "security") {
    return [
      "任何密钥或证书相关操作都先做备份，再执行替换。",
      "优先使用最小权限原则，不要默认给账号高权限。",
      generic[2],
    ];
  }

  if (category === "network") {
    return [
      "先验证连通性和端口占用，再修改网络策略或隧道配置。",
      "为关键网络参数保留一份可回滚的基线配置。",
      generic[2],
    ];
  }

  return generic;
}

function buildArticleBody(note, primaryLink = "") {
  const promptTexts = note.pairs.map((p) => p.prompt).filter(Boolean);
  const responseTexts = note.pairs.map((p) => p.response).filter(Boolean);

  const corpus = responseTexts.join("\n\n").trim() || note.raw;
  const background = firstUsefulSentence(
    promptTexts[0] || responseTexts[0] || corpus,
    `${note.title} 的核心问题是如何快速形成可执行结论并落地。`,
  );

  let bullets = extractBulletsFromText(responseTexts[0] || corpus).slice(0, 5);
  if (bullets.length < 3) {
    const sentenceFallback = splitSentences(stripMarkdown(corpus))
      .filter((s) => s.length >= 18 && s.length <= 80)
      .slice(0, 5);
    for (const sentence of sentenceFallback) {
      if (!bullets.includes(sentence)) {
        bullets.push(sentence);
      }
      if (bullets.length >= 5) break;
    }
  }
  if (bullets.length === 0) {
    bullets = ["先明确目标，再按步骤执行并记录关键结果。"];
  }

  const details = [];
  for (let i = 0; i < note.pairs.length; i += 1) {
    const pair = note.pairs[i];
    if (!pair.response) continue;
    const heading = trimForExcerpt(pair.prompt || `关键问题 ${i + 1}`, 28);
    const paragraphs = extractParagraphs(pair.response).slice(0, 2);
    if (paragraphs.length === 0) continue;
    details.push({ heading, text: paragraphs.join("\n\n") });
    if (details.length >= 4) break;
  }

  if (details.length === 0) {
    const paragraphs = extractParagraphs(corpus).slice(0, 3);
    for (const [idx, para] of paragraphs.entries()) {
      details.push({ heading: `要点 ${idx + 1}`, text: para });
    }
  }

  const codeBlocks = extractCodeBlocks(corpus).slice(0, 4);

  const faq = [];
  for (const pair of note.pairs) {
    if (!pair.prompt || !pair.response) continue;
    const q = trimForExcerpt(pair.prompt, 70);
    const a = firstUsefulSentence(pair.response, trimForExcerpt(pair.response, 90));
    faq.push({ q, a: trimForExcerpt(a, 130) });
    if (faq.length >= 3) break;
  }

  if (faq.length === 0) {
    faq.push({
      q: "这篇笔记应该如何使用？",
      a: "先看核心结论，再按操作步骤执行，最后对照排查项验证结果。",
    });
  }

  const snippets = [];
  for (const pair of note.pairs) {
    if (!pair.prompt || !pair.response) continue;
    snippets.push({
      q: trimForExcerpt(pair.prompt, 90),
      a: trimForExcerpt(pair.response, 220),
    });
    if (snippets.length >= 3) break;
  }

  const practices = getBestPracticeBullets(note.category);
  const summary =
    bullets[0] ||
    "把问题拆成可执行步骤、逐步验证并沉淀经验，是这类问题最稳妥的解决路径。";

  const lines = [];

  if (primaryLink) {
    lines.push(
      `> 这篇内容与主文存在高度重复，已整理为索引版。完整版本请查看：[${note.primaryTitle}](${primaryLink})。`,
      "",
    );
  }

  lines.push("## 背景与适用场景", "", background, "");
  lines.push("## 核心结论", "");
  for (const bullet of bullets) {
    lines.push(`- ${bullet}`);
  }
  lines.push("");

  lines.push("## 详细说明", "");
  for (const detail of details) {
    lines.push(`### ${detail.heading}`, "", detail.text, "");
  }

  lines.push("## 操作步骤与命令示例", "");
  if (codeBlocks.length > 0) {
    codeBlocks.forEach((block, idx) => {
      lines.push(`### 示例 ${idx + 1}`, "", block, "");
    });
  } else {
    lines.push(
      "- 先根据核心结论确认目标状态。",
      "- 再按详细说明逐条执行并记录结果。",
      "- 遇到异常时优先使用排查清单定位问题。",
      "",
    );
  }

  lines.push("## 常见问题与排查", "");
  for (const item of faq) {
    lines.push(`- **问题：** ${item.q}  **排查：** ${item.a}`);
  }
  lines.push("");

  lines.push("## 最佳实践", "");
  for (const item of practices) {
    lines.push(`- ${item}`);
  }
  lines.push("");

  if (snippets.length > 0) {
    lines.push("## 关键问答摘录", "");
    for (const snippet of snippets) {
      lines.push(
        `> **Q:** ${snippet.q}`,
        ">",
        `> **A:** ${snippet.a}`,
        "",
      );
    }
  }

  lines.push("## 总结", "", summary, "");

  if (note.meta.link) {
    lines.push(`- 原始对话来源：${note.meta.link}`, "");
  }

  return {
    body: `${lines.join("\n").replace(/\n{3,}/g, "\n\n").trim()}\n`,
    description: makeDescription(note.title, background, bullets),
  };
}

function toDateOnly(input) {
  return new Date(input).toISOString().slice(0, 10);
}

function frontmatter(note, description) {
  const lines = [
    "---",
    `title: ${JSON.stringify(note.title)}`,
    `description: ${JSON.stringify(description)}`,
    `pubDate: ${JSON.stringify(note.pubDate)}`,
    `updatedDate: ${JSON.stringify(note.updatedDate)}`,
    `category: ${JSON.stringify(note.category)}`,
    `tags: [${JSON.stringify(note.category)}]`,
    `sourcePath: ${JSON.stringify(note.sourcePath)}`,
    `sourceVault: ${JSON.stringify("chat-export")}`,
    "---",
    "",
  ];
  return lines.join("\n");
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

function parseNote(raw, fileName, stat) {
  const base = fileName.replace(/\.md$/i, "");
  const fallbackTitle = base.replace(/^(ChatGPT|Gemini)-/i, "").trim();
  const title = parseTitle(raw, fallbackTitle);
  const pairs = parsePairs(raw);
  return {
    sourceFileName: fileName,
    sourcePath: `src/content/blog/${fileName}`,
    sourceBase: base,
    title,
    titleKey: normalizeTitleKey(title),
    provider: /^Gemini-/i.test(fileName) ? "gemini" : "chatgpt",
    raw,
    pairs,
    meta: parseMeta(raw),
    pubDate: toDateOnly(stat.mtimeMs),
    updatedDate: toDateOnly(stat.mtimeMs),
    category: "infra",
    isPrimary: true,
    primaryKey: "",
    primaryTitle: "",
    relTarget: "",
    type: "main",
  };
}

async function loadExistingRelativeTargets() {
  const existing = new Set();

  async function walk(dir, relPrefix = "") {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const abs = path.join(dir, entry.name);
      const rel = relPrefix ? `${relPrefix}/${entry.name}` : entry.name;
      if (entry.isDirectory()) {
        await walk(abs, rel);
        continue;
      }
      if (!/\.(md|mdx)$/i.test(entry.name)) continue;
      existing.add(rel);
    }
  }

  for (const dir of CATEGORY_DIRS) {
    const abs = path.join(ROOT, dir);
    try {
      await walk(abs, dir);
    } catch {
      // Ignore missing dirs.
    }
  }

  return existing;
}

async function main() {
  const entries = await fs.readdir(ROOT, { withFileTypes: true });
  const sources = entries
    .filter((entry) => entry.isFile() && SOURCE_PATTERN.test(entry.name))
    .map((entry) => entry.name)
    .sort();

  if (sources.length === 0) {
    console.log("No exported chat notes found in src/content/blog root.");
    return;
  }

  const notes = [];
  for (const fileName of sources) {
    const abs = path.join(ROOT, fileName);
    const raw = await fs.readFile(abs, "utf8");
    const stat = await fs.stat(abs);
    notes.push(parseNote(raw, fileName, stat));
  }

  // Duplicate handling by normalized title key.
  const groups = new Map();
  for (const note of notes) {
    if (!groups.has(note.titleKey)) groups.set(note.titleKey, []);
    groups.get(note.titleKey).push(note);
  }

  for (const list of groups.values()) {
    if (list.length <= 1) continue;
    list.sort((a, b) => {
      const aLen = a.raw.length;
      const bLen = b.raw.length;
      if (bLen !== aLen) return bLen - aLen;
      return a.sourceFileName.localeCompare(b.sourceFileName);
    });
    const primary = list[0];
    primary.isPrimary = true;
    primary.type = "main";
    for (let i = 1; i < list.length; i += 1) {
      const secondary = list[i];
      secondary.isPrimary = false;
      secondary.type = "index";
      secondary.primaryKey = primary.titleKey;
      secondary.primaryTitle = primary.title;
      secondary.title = `${secondary.title}（索引）`;
    }
  }

  // Category assignment.
  for (const note of notes) {
    const contentHint = note.pairs.map((pair) => `${pair.prompt}\n${pair.response}`).join("\n");
    note.category = chooseCategory(note.title.replace(/（索引）$/, ""), contentHint || note.raw);
  }

  // Secondary notes inherit primary category.
  const primaryByKey = new Map();
  for (const note of notes) {
    if (note.isPrimary) {
      primaryByKey.set(note.titleKey, note);
    }
  }
  for (const note of notes) {
    if (note.isPrimary) continue;
    const primary = primaryByKey.get(note.primaryKey);
    if (primary) {
      note.category = primary.category;
      note.primaryTitle = primary.title;
    }
  }

  // Ensure category directories exist.
  if (!DRY_RUN) {
    for (const dir of CATEGORY_DIRS) {
      await fs.mkdir(path.join(ROOT, dir), { recursive: true });
    }
  }

  const existingTargets = await loadExistingRelativeTargets();
  const usedTargets = new Set();

  // Target file resolution.
  for (const note of notes) {
    const baseTitle = note.title.replace(/（索引）$/, "");
    const suffix = note.type === "index" ? "-index" : "";
    let fileStem = `${slugify(baseTitle)}${suffix}`;
    if (!fileStem) fileStem = "untitled-note";

    let relTarget = `${note.category}/${fileStem}.md`;
    let attempt = 2;
    while (usedTargets.has(relTarget) || existingTargets.has(relTarget)) {
      relTarget = `${note.category}/${fileStem}-${attempt}.md`;
      attempt += 1;
    }
    note.relTarget = relTarget;
    usedTargets.add(relTarget);
  }

  const outputByKey = new Map();
  for (const note of notes) {
    if (note.isPrimary) {
      outputByKey.set(note.titleKey, note);
    }
  }

  let moved = 0;
  let indexCount = 0;
  const manifestRows = [];

  for (const note of notes) {
    const primary = note.isPrimary ? note : outputByKey.get(note.primaryKey);
    const primaryLink = primary ? `/blog/${primary.relTarget.replace(/\.md$/, "")}/` : "";

    const article = buildArticleBody(note, note.type === "index" ? primaryLink : "");
    const markdown = `${frontmatter(note, article.description)}${article.body}`;
    const outputAbs = path.join(ROOT, note.relTarget);

    if (!DRY_RUN) {
      await fs.writeFile(outputAbs, markdown, "utf8");
      await fs.unlink(path.join(ROOT, note.sourceFileName));
    }

    moved += 1;
    if (note.type === "index") indexCount += 1;

    manifestRows.push({
      source: `src/content/blog/${note.sourceFileName}`,
      target: `src/content/blog/${note.relTarget}`,
      category: note.category,
      type: note.type,
      note: note.type === "index" ? `主文: ${primary?.relTarget ?? ""}` : "",
    });
  }

  const byCategory = new Map();
  for (const row of manifestRows) {
    byCategory.set(row.category, (byCategory.get(row.category) || 0) + 1);
  }

  const manifestLines = [
    "# 2026-02-12 Blog Reorganization Manifest",
    "",
    `- Dry run: ${DRY_RUN ? "yes" : "no"}`,
    `- Source files: ${sources.length}`,
    `- Output files: ${moved}`,
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
    ...manifestRows.map(
      (row) =>
        `| ${row.source} | ${row.target} | ${row.category} | ${row.type} | ${row.note} |`,
    ),
    "",
  ];

  const manifestPath = path.resolve("docs/migration/2026-02-12-blog-reorg-manifest.md");
  if (!DRY_RUN) {
    await fs.mkdir(path.dirname(manifestPath), { recursive: true });
    await fs.writeFile(manifestPath, `${manifestLines.join("\n")}\n`, "utf8");
  }

  console.log(
    JSON.stringify(
      {
        dryRun: DRY_RUN,
        sourceFiles: sources.length,
        outputFiles: moved,
        duplicateIndexFiles: indexCount,
        byCategory: Object.fromEntries([...byCategory.entries()].sort()),
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
