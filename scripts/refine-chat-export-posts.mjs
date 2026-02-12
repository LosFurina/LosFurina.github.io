import fs from "node:fs/promises";
import path from "node:path";

const BLOG_ROOT = path.resolve("src/content/blog");
const BACKUP_ROOT = "/tmp/chat-note-backup-2026-02-12";

const TECH_CATEGORIES = new Set(["linux", "infra", "network", "security", "git", "docker", "ai"]);

const CATEGORY_FALLBACK = {
  linux: {
    description: (title) => `围绕${title}整理可执行步骤、命令示例与故障排查要点。`,
    background: (title) => `本文聚焦 ${title} 的实际使用场景，适用于希望快速落地配置或排错的 Linux 用户。`,
    bullets: ["先确认系统现状与目标状态，再执行变更。", "优先使用可回滚的步骤，避免一次性大改动。", "执行后逐项验证结果，并保留关键日志。"],
    steps: ["确认当前系统版本、服务状态与关键配置文件。", "按最小变更原则执行命令或修改配置。", "通过日志、状态命令和实际行为完成验证。"],
  },
  infra: {
    description: (title) => `围绕${title}梳理核心概念、实践流程与常见问题处理方式。`,
    background: (title) => `本文整理 ${title} 的关键实践路径，适用于基础设施建设、部署与运维场景。`,
    bullets: ["先定义目标架构与边界，再选择实现方案。", "将部署步骤拆分为准备、执行、验证三个阶段。", "通过可观测性与日志回溯降低排障成本。"],
    steps: ["明确目标环境、依赖条件与网络连通性。", "分阶段实施配置或部署，逐步验证。", "记录最终状态与回滚策略，便于复用。"],
  },
  network: {
    description: (title) => `围绕${title}汇总网络配置思路、关键命令与排查路径。`,
    background: (title) => `本文关注 ${title} 在网络连通、协议行为和跨端访问中的实操问题。`,
    bullets: ["先确认链路是否连通，再定位协议层问题。", "优先排查地址、端口、路由与防火墙规则。", "验证时同时观察客户端与服务端日志。"],
    steps: ["检查网络拓扑、地址分配和路由路径。", "逐层验证 DNS、端口与协议握手状态。", "根据日志和抓包结果修正配置。"],
  },
  security: {
    description: (title) => `围绕${title}整理安全配置步骤、风险点与加固建议。`,
    background: (title) => `本文围绕 ${title} 的安全实践展开，重点覆盖配置要点与误用风险。`,
    bullets: ["先识别资产与权限边界，再实施安全配置。", "优先采用最小权限和可审计策略。", "上线前后都要进行验证与定期轮换。"],
    steps: ["确认证书、密钥或权限策略的当前状态。", "按最小权限原则完成配置与策略收敛。", "使用审计日志和自动检查验证结果。"],
  },
  git: {
    description: (title) => `围绕${title}提炼协作流程、命令实践与分支管理建议。`,
    background: (title) => `本文整理 ${title} 的协作语义和实操流程，适用于团队开发与代码管理。`,
    bullets: ["先统一分支策略，再执行日常协作命令。", "提交粒度应小且可回溯，便于评审与回滚。", "冲突处理后要补充验证，确保行为一致。"],
    steps: ["确认仓库分支状态与目标基线。", "按流程执行提交、同步与合并操作。", "在合并后完成构建与关键用例验证。"],
  },
  docker: {
    description: (title) => `围绕${title}整理容器操作步骤、配置检查项与排错方法。`,
    background: (title) => `本文聚焦 ${title} 的容器化实操，适用于镜像、容器与网络排查场景。`,
    bullets: ["先确认镜像与容器状态，再执行操作。", "挂载、端口、环境变量是高频问题点。", "变更后通过日志与健康检查确认结果。"],
    steps: ["检查容器生命周期、端口映射与挂载配置。", "按步骤执行容器命令或 compose 配置变更。", "通过日志与探活结果验证服务可用性。"],
  },
  career: {
    description: (title) => `围绕${title}提炼核心观点、判断框架与可执行建议。`,
    background: (title) => `本文围绕 ${title} 做结构化整理，适用于理解概念、形成判断并指导实践。`,
    bullets: ["先明确问题定义，再建立判断维度。", "区分事实、观点和建议，避免混淆。", "将结论转化为可执行的小步骤。"],
    steps: ["明确当前问题与目标结果。", "按维度梳理关键信息并形成判断。", "结合场景选择可执行的下一步动作。"],
  },
  ai: {
    description: (title) => `围绕${title}整理核心概念、应用路径与实践注意事项。`,
    background: (title) => `本文聚焦 ${title} 的关键概念与落地方式，适用于快速建立认知并开始实践。`,
    bullets: ["先理解核心概念，再落地到具体场景。", "评估输入数据与约束条件对结果的影响。", "通过小规模实验验证方案有效性。"],
    steps: ["明确任务目标与输入输出要求。", "选择合适方法并构建最小可行实验。", "根据评估指标迭代优化方案。"],
  },
  default: {
    description: (title) => `围绕${title}整理核心结论、执行步骤与常见问题。`,
    background: (title) => `本文对 ${title} 进行结构化整理，帮助快速理解与落地执行。`,
    bullets: ["先明确目标，再按步骤执行。", "遇到问题时优先定位环境与参数差异。", "形成可复用的检查清单，降低重复成本。"],
    steps: ["明确目标状态与输入条件。", "分步骤执行并记录结果。", "根据结果回溯并修正关键参数。"],
  },
};

function stripQuotes(input = "") {
  return input.replace(/^['"]|['"]$/g, "").trim();
}

function parseDoc(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return null;
  const head = {};
  for (const line of match[1].split("\n")) {
    const idx = line.indexOf(":");
    if (idx <= 0) continue;
    head[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
  }
  return { head, body: match[2] };
}

async function* walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(full);
      continue;
    }
    if (/\.(md|mdx)$/i.test(entry.name)) yield full;
  }
}

function parsePairs(raw) {
  const lines = raw.replace(/\r\n/g, "\n").split("\n");
  const pairs = [];
  let mode = "none";
  let current = { prompt: "", response: "" };

  function push() {
    const prompt = current.prompt.trim();
    const response = current.response
      .replace(/^#{3,6}\s*Gemini said\s*$/gim, "")
      .trim();
    if (prompt || response) pairs.push({ prompt, response });
    current = { prompt: "", response: "" };
  }

  for (const line of lines) {
    const trimmed = line.trim();
    if (/^##\s*Prompt\s*[:：]?$/i.test(trimmed)) {
      if (mode === "response") push();
      mode = "prompt";
      continue;
    }
    if (/^##\s*Response\s*[:：]?$/i.test(trimmed)) {
      mode = "response";
      continue;
    }
    if (mode === "prompt") current.prompt += `${line}\n`;
    if (mode === "response") current.response += `${line}\n`;
  }

  push();
  return pairs.filter((pair) => pair.prompt || pair.response);
}

function stripMarkdown(input = "") {
  return input
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/^\s{0,3}#{1,6}\s+/gm, "")
    .replace(/^\s*[-*+]\s+/gm, "")
    .replace(/^\s*\d+[.)]\s+/gm, "")
    .replace(/[>*_~]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function sanitizeLine(input = "") {
  return stripMarkdown(input)
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/[❯👉👇🧨👍🔥✨💡🚀🎯]/g, " ")
    .replace(/\b(NAME|MAJ:MIN|MOUNTPOINTS|SIZE|TYPE)\b/gi, " ")
    .replace(/[|]+/g, " ")
    .replace(/^[：:、,，。;；\-\s]+/, "")
    .replace(/\s+/g, " ")
    .replace(/\s+([。！？!?,，；;:：])/g, "$1")
    .trim();
}

function symbolHeavy(line) {
  const compact = line.replace(/\s+/g, "");
  if (!compact) return true;
  const meaningful = (compact.match(/[A-Za-z0-9\u4e00-\u9fff]/g) || []).length;
  return meaningful / compact.length < 0.5;
}

function isNoisy(line = "") {
  if (!line) return true;
  if (line.length < 10 || line.length > 110) return true;
  if (symbolHeavy(line)) return true;
  if (/^(prompt|response|user|assistant|exported|link)[:：]/i.test(line)) return true;
  if (/(MAJ:MIN|MOUNTPOINTS|nvme\d+n\d+|sda\d+|\/dev\/|├─|└─|❯|16:\d{2}|(^|\s)sd[a-z](\s|$)|root@[\w.-]+|(^|\s)disk(\s|$))/i.test(line)) return true;
  if (/(你这个问题问得|我先给你|别慌|拍桌子|开席|直接给你|先表态一句|结论先行|一句话总结|你眼瞎|你现在可以|跟我说一句|Uploaded image)/i.test(line)) return true;
  if (/在\s*和\s*里/.test(line)) return true;
  if (/（\s*\+\s*\+\s*[^)]*）/.test(line)) return true;
  if (/(或者干脆|全局选项|Issue\/PR|Key type|Global Options|Normal Mode)/i.test(line)) return true;
  if (/^[\W_]+$/u.test(line)) return true;
  return false;
}

function splitSentences(text = "") {
  const normalized = text
    .replace(/\r\n/g, "\n")
    .replace(/```[\s\S]*?```/g, "\n")
    .replace(/\n{2,}/g, "\n")
    .replace(/>/g, " ");
  const chunks = normalized.split(/[\n。！？!?；;]+/g);
  return chunks
    .map((chunk) => sanitizeLine(chunk))
    .map((chunk) => chunk.replace(/[：:]\s*$/, "").trim())
    .filter(Boolean);
}

function unique(list) {
  const out = [];
  const seen = new Set();
  for (const item of list) {
    const key = item.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }
  return out;
}

function rankSentence(sentence, title) {
  let score = 0;
  if (sentence.length >= 16 && sentence.length <= 70) score += 2;
  if (/(建议|需要|可以|通过|使用|配置|检查|避免|确保|步骤|命令|排查|对比|原理|适用)/.test(sentence)) score += 2;
  if (sentence.includes(title.slice(0, Math.min(6, title.length)))) score += 1;
  if (/^(先|建议|可以|通过|使用|确认|检查)/.test(sentence)) score += 1;
  if (isNoisy(sentence)) score -= 4;
  return score;
}

function pickSentences(text, title, maxCount = 6) {
  const candidates = splitSentences(text).filter((line) => !isNoisy(line));
  const ranked = unique(candidates)
    .map((line, index) => ({ line, index, score: rankSentence(line, title) }))
    .filter((item) => item.score >= 1)
    .sort((a, b) => b.score - a.score || a.index - b.index);
  return ranked.slice(0, maxCount).map((item) => item.line);
}

function normalizeBullet(line = "") {
  let out = sanitizeLine(line);
  out = out.replace(/^[-*+]\s*/, "").replace(/^[0-9]+[.)]\s*/, "");
  out = out.replace(/[：:]\s*$/, "").trim();
  if (!out || isNoisy(out)) return "";
  if (out.length < 12) return "";
  if (/^(高级|默认|推荐|常见问题|关键说明|总结|步骤\s*\d+)$/i.test(out)) return "";
  if (out.length > 72) out = `${out.slice(0, 69).trimEnd()}...`;
  return out;
}

function shortHeading(prompt = "", fallback = "关键要点") {
  const primary = pickSentences(prompt, "", 1)[0] || sanitizeLine(prompt);
  let out = primary.replace(/[?？]$/, "").trim();
  if (!out || isNoisy(out)) out = fallback;
  if (out.length > 26) out = `${out.slice(0, 23).trimEnd()}...`;
  return out;
}

function isGoodHeading(input = "") {
  if (!input) return false;
  if (input.length < 4 || input.length > 18) return false;
  if (input.includes("...")) return false;
  if (/[()（）[\]{}<>]/.test(input)) return false;
  if (/root@|nvme|sda|Uploaded|http/i.test(input)) return false;
  if (isNoisy(input)) return false;
  return true;
}

function collectCodeBlocks(pairs) {
  const out = [];
  const seen = new Set();

  for (const pair of pairs) {
    for (const match of pair.response.matchAll(/```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g)) {
      const lang = (match[1] || "bash").trim() || "bash";
      const body = match[2]
        .split("\n")
        .map((line) => line.trimEnd())
        .filter((line) => line.trim().length > 0)
        .slice(0, 30)
        .join("\n")
        .trim();

      if (!body || body.length < 8) continue;
      if (/^(ok|yes|no)$/i.test(body)) continue;
      const key = `${lang}\n${body}`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push({ lang, body });
      if (out.length >= 4) return out;
    }
  }

  return out;
}

function getCategoryConfig(category) {
  return CATEGORY_FALLBACK[category] || CATEGORY_FALLBACK.default;
}

function buildBullets(note) {
  const candidates = [];
  for (const pair of note.pairs) {
    for (const match of pair.response.matchAll(/^\s*(?:[-*+]|\d+[.)])\s+(.+)$/gm)) {
      const bullet = normalizeBullet(match[1]);
      if (bullet) candidates.push(bullet);
    }
    for (const sentence of pickSentences(pair.response, note.title, 3)) {
      const bullet = normalizeBullet(sentence);
      if (bullet) candidates.push(bullet);
    }
  }

  const selected = unique(candidates).slice(0, 5);
  if (selected.length > 0) return selected;
  return getCategoryConfig(note.category).bullets.slice(0, 3);
}

function buildBackground(note) {
  const promptSummary = pickSentences(note.pairs[0]?.prompt || "", note.title, 1)[0];
  if (promptSummary && !isNoisy(promptSummary)) {
    const trimmed = promptSummary.length > 84 ? `${promptSummary.slice(0, 81).trimEnd()}...` : promptSummary;
    return `本文基于实际问题整理：${trimmed}。`;
  }
  return getCategoryConfig(note.category).background(note.title);
}

function buildDetailSections(note, bullets) {
  const sections = [];
  const fallbackHeading = TECH_CATEGORIES.has(note.category) ? "实现思路" : "分析思路";

  for (const pair of note.pairs) {
    const paragraphs = pickSentences(pair.response, note.title, 3).slice(0, 2);
    if (paragraphs.length === 0) continue;
    const suggestedHeading = shortHeading(pair.prompt, "");
    const heading = isGoodHeading(suggestedHeading) ? suggestedHeading : `${fallbackHeading} ${sections.length + 1}`;
    sections.push({
      heading,
      paragraphs,
    });
    if (sections.length >= 3) break;
  }

  if (sections.length === 0) {
    sections.push({
      heading: fallbackHeading,
      paragraphs: [bullets[0] || "先明确目标，再按步骤执行并验证。", bullets[1] || "遇到异常时优先比对环境与参数差异。"],
    });
  }

  return sections;
}

function conciseAnswer(text, title) {
  const picked = pickSentences(text, title, 2);
  if (picked.length === 0) return "按结论逐步执行，并对照日志排查差异。";
  const joined = picked.join("；");
  if (joined.length <= 88) return joined;
  return `${joined.slice(0, 85).trimEnd()}...`;
}

function buildFaq(note) {
  const faqs = [];
  const seen = new Set();
  for (const pair of note.pairs) {
    const rawQ = shortHeading(pair.prompt, "常见问题");
    const q = isGoodHeading(rawQ) ? rawQ : `常见问题 ${faqs.length + 1}`;
    const a = conciseAnswer(pair.response, note.title);
    const key = `${q}|${a}`;
    if (seen.has(key) || isNoisy(q) || isNoisy(a)) continue;
    seen.add(key);
    faqs.push({ q, a });
    if (faqs.length >= 3) break;
  }
  if (faqs.length > 0) return faqs;
  return [{ q: "如何开始", a: "先确认当前状态和目标，再按步骤执行并验证结果。" }];
}

function buildSnippets(note) {
  const snippets = [];
  const seen = new Set();
  for (const pair of note.pairs) {
    const rawQ = shortHeading(pair.prompt, "关键问题");
    const q = isGoodHeading(rawQ) ? rawQ : `关键问题 ${snippets.length + 1}`;
    const a = conciseAnswer(pair.response, note.title);
    const key = `${q}|${a}`;
    if (seen.has(key) || isNoisy(q) || isNoisy(a)) continue;
    seen.add(key);
    snippets.push({ q, a });
    if (snippets.length >= 2) break;
  }
  return snippets;
}

function buildDescription(note, bullets, detailSections) {
  const candidates = [...bullets, ...detailSections.flatMap((section) => section.paragraphs)];
  let pick = candidates.find(
    (line) =>
      line.length >= 16 &&
      line.length <= 72 &&
      !isNoisy(line) &&
      !/(或者干脆|全局选项|Issue\/PR|Key type|Global Options|Normal Mode|在\s*和\s*里)/i.test(line),
  );
  if (!pick) pick = getCategoryConfig(note.category).description(note.title);
  if (pick.length > 110) pick = `${pick.slice(0, 107).trimEnd()}...`;
  if (!/[。！？.!?]$/.test(pick)) pick += "。";
  return pick;
}

function sanitizeDescriptionOutput(description, note) {
  let output = sanitizeLine(description);
  if (isNoisy(output) || output.length < 16 || /(或者干脆|全局选项|Issue\/PR|Key type|Global Options|Normal Mode)/i.test(output)) {
    output = getCategoryConfig(note.category).description(note.title);
  }
  if (output.length > 110) output = `${output.slice(0, 107).trimEnd()}...`;
  if (!/[。！？.!?]$/.test(output)) output += "。";
  return output;
}

function sanitizeRenderedBody(body, note) {
  const config = getCategoryConfig(note.category);
  let next = body;

  next = next.replace(/(## 背景与适用场景\n\n)([\s\S]*?)(\n\n## 核心结论)/, (_m, prefix, content, suffix) => {
    const firstLine = content
      .trim()
      .split("\n")
      .map((line) => line.trim())
      .find(Boolean);
    if (!firstLine || isNoisy(sanitizeLine(firstLine))) {
      return `${prefix}${config.background(note.title)}${suffix}`;
    }
    return `${prefix}${content.trim()}${suffix}`;
  });

  const lines = next.split("\n");
  const output = [];
  let inDetails = false;
  let detailIndex = 0;
  const fallbackHeading = TECH_CATEGORIES.has(note.category) ? "实现思路" : "分析思路";

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed === "## 详细说明") {
      inDetails = true;
      detailIndex = 0;
      output.push(line);
      continue;
    }

    if (/^##\s+/.test(trimmed) && trimmed !== "## 详细说明") {
      inDetails = false;
      output.push(line);
      continue;
    }

    if (inDetails && /^###\s+/.test(trimmed)) {
      detailIndex += 1;
      const heading = trimmed.replace(/^###\s+/, "").trim();
      if (!isGoodHeading(heading)) {
        output.push(`### ${fallbackHeading} ${detailIndex}`);
        continue;
      }
    }

    output.push(line);
  }

  return output.join("\n").replace(/\n{3,}/g, "\n\n").trim() + "\n";
}

function buildSteps(note, codeBlocks) {
  const config = getCategoryConfig(note.category);
  const lines = [];

  if (codeBlocks.length > 0) {
    lines.push("## 操作步骤与命令示例", "");
    codeBlocks.forEach((block, index) => {
      lines.push(`### 示例 ${index + 1}`, "", `\`\`\`${block.lang}\n${block.body}\n\`\`\``, "");
    });
    lines.push("### 执行顺序建议", "");
    config.steps.slice(0, 3).forEach((step, idx) => lines.push(`${idx + 1}. ${step}`));
    lines.push("");
    return lines;
  }

  lines.push("## 操作步骤与命令示例", "");
  config.steps.slice(0, 3).forEach((step, idx) => lines.push(`${idx + 1}. ${step}`));
  lines.push("");
  return lines;
}

function renderMain(note) {
  const bullets = buildBullets(note);
  const detailSections = buildDetailSections(note, bullets);
  const codeBlocks = collectCodeBlocks(note.pairs);
  const faqs = buildFaq(note);
  const snippets = buildSnippets(note);
  const background = buildBackground(note);
  const description = buildDescription(note, bullets, detailSections);

  const lines = [];
  lines.push("## 背景与适用场景", "", background, "");
  lines.push("## 核心结论", "");
  bullets.forEach((bullet) => lines.push(`- ${bullet}`));
  lines.push("");

  lines.push("## 详细说明", "");
  detailSections.forEach((section) => {
    lines.push(`### ${section.heading}`, "");
    section.paragraphs.forEach((paragraph) => lines.push(paragraph, ""));
  });

  lines.push(...buildSteps(note, codeBlocks));

  lines.push("## 常见问题与排查", "");
  faqs.forEach((faq) => lines.push(`- **问题：** ${faq.q}  **排查：** ${faq.a}`));
  lines.push("");

  lines.push("## 关键问答摘录", "");
  snippets.forEach((item) => {
    lines.push(`> **Q:** ${item.q}`, ">", `> **A:** ${item.a}`, "");
  });
  if (snippets.length === 0) {
    lines.push("> **Q:** 这篇内容适合谁？", ">", "> **A:** 适合需要快速理解主题并执行实践步骤的读者。", "");
  }

  const summary = bullets[0] || getCategoryConfig(note.category).bullets[0];
  lines.push("## 总结", "", `${summary.replace(/[。！？.!?]$/, "")}。`, "");
  if (note.sourceLink) lines.push(`- 原始对话来源：${note.sourceLink}`, "");

  const body = sanitizeRenderedBody(`${lines.join("\n").replace(/\n{3,}/g, "\n\n").trim()}\n`, note);
  return {
    description: sanitizeDescriptionOutput(description, note),
    body,
  };
}

function renderIndex(note, mainLink) {
  const bullets = buildBullets(note).slice(0, 3);
  const titleBase = note.title.replace(/（索引）$/, "");
  const description = sanitizeDescriptionOutput(buildDescription(note, bullets, []), note);

  const lines = [
    `> 这篇内容与主文高度重合，已整理为索引版。完整内容请查看：[${titleBase}](${mainLink})。`,
    "",
    "## 索引摘要",
    "",
    ...bullets.map((bullet) => `- ${bullet}`),
    "",
    "## 主文入口",
    "",
    `- 完整教程：${mainLink}`,
    "",
  ];

  if (note.sourceLink) lines.push(`- 原始对话来源：${note.sourceLink}`, "");

  return {
    description,
    body: `${lines.join("\n").replace(/\n{3,}/g, "\n\n").trim()}\n`,
  };
}

function formatFrontmatter(head, description) {
  const title = stripQuotes(head.title || "Untitled");
  const pubDate = stripQuotes(head.pubDate || "2026-02-12");
  const updatedDate = stripQuotes(head.updatedDate || pubDate);
  const category = stripQuotes(head.category || "infra");
  const sourcePath = stripQuotes(head.sourcePath || "");
  const sourceVault = stripQuotes(head.sourceVault || "chat-export");

  return [
    "---",
    `title: ${JSON.stringify(title)}`,
    `description: ${JSON.stringify(description)}`,
    `pubDate: ${JSON.stringify(pubDate)}`,
    `updatedDate: ${JSON.stringify(updatedDate)}`,
    `category: ${JSON.stringify(category)}`,
    `tags: [${JSON.stringify(category)}]`,
    `sourcePath: ${JSON.stringify(sourcePath)}`,
    `sourceVault: ${JSON.stringify(sourceVault)}`,
    "---",
    "",
  ].join("\n");
}

async function main() {
  const notes = [];

  for await (const filePath of walk(BLOG_ROOT)) {
    const raw = await fs.readFile(filePath, "utf8");
    const parsed = parseDoc(raw);
    if (!parsed) continue;
    if (stripQuotes(parsed.head.sourceVault || "") !== "chat-export") continue;

    const title = stripQuotes(parsed.head.title || "Untitled");
    const category = stripQuotes(parsed.head.category || path.relative(BLOG_ROOT, filePath).split(path.sep)[0] || "infra");
    const sourcePath = stripQuotes(parsed.head.sourcePath || "");
    const backupPath = sourcePath ? path.join(BACKUP_ROOT, path.basename(sourcePath)) : "";

    let backupRaw = "";
    if (backupPath) {
      try {
        backupRaw = await fs.readFile(backupPath, "utf8");
      } catch {
        backupRaw = "";
      }
    }

    const sourceLinkMatch =
      backupRaw.match(/\*\*Link:\*\*\s*\[[^\]]+\]\((https?:\/\/[^)]+)\)/i) ||
      parsed.body.match(/原始对话来源：\s*(https?:\/\/\S+)/);
    const sourceLink = sourceLinkMatch ? sourceLinkMatch[1].trim() : "";

    const parsedPairs = backupRaw ? parsePairs(backupRaw) : [];
    const pairs = parsedPairs.length > 0 ? parsedPairs : [{ prompt: title, response: parsed.body }];

    notes.push({
      filePath,
      head: parsed.head,
      body: parsed.body,
      title,
      category,
      sourceLink,
      pairs,
      isIndex: /（索引）$/.test(title) || /-index\.md$/i.test(path.basename(filePath)),
    });
  }

  let changed = 0;

  for (const note of notes) {
    let mainLink = "/blog";
    if (note.isIndex) {
      const match = note.body.match(/\]\(\/blog\/([^)]+)\/\)/);
      if (match) mainLink = `/blog/${match[1].replace(/\/$/, "")}/`;
    }

    const rendered = note.isIndex ? renderIndex(note, mainLink) : renderMain(note);
    const next = `${formatFrontmatter(note.head, rendered.description)}${rendered.body}`;
    const current = await fs.readFile(note.filePath, "utf8");

    if (next !== current) {
      await fs.writeFile(note.filePath, next, "utf8");
      changed += 1;
    }
  }

  console.log(JSON.stringify({ processed: notes.length, changed }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
