import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve('src/content/blog/infra');
const TODAY = '2026-02-09';

function parseDoc(raw) {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) return null;
  return { head: m[1], body: m[2] };
}

function parseHead(head) {
  const obj = {};
  for (const line of head.split('\n')) {
    const i = line.indexOf(':');
    if (i <= 0) continue;
    const k = line.slice(0, i).trim();
    const v = line.slice(i + 1).trim();
    obj[k] = v;
  }
  return obj;
}

function stripQuotes(s = '') {
  return s.replace(/^['\"]|['\"]$/g, '');
}

function isCJK(str) {
  return /[\u3400-\u9FFF]/.test(str);
}

function titleCaseAscii(str) {
  return str
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

function prettifyTitle(currentTitle, basename) {
  let t = (currentTitle || '').trim();
  if (!t || /notes and practical write up\.?$/i.test(t)) {
    t = basename;
  }
  t = t.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  t = t.replace(/^#+\s*/, '');
  t = t.replace(/-obsidian$/i, '');
  t = t.replace(/\s*notes and practical write\s*up\.?$/i, '');
  t = t.replace(/[🤖📌]/g, '');

  if (!isCJK(t)) {
    const normalized = t
      .replace(/[_-]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    if (normalized) t = titleCaseAscii(normalized);
  }

  t = t.replace(/\s+/g, ' ').trim();
  if (!t) t = basename;
  return t;
}

function cleanupBody(input) {
  let out = input.replace(/\r\n/g, '\n');
  out = out.replace(/^\s*---\s*$/gm, '');
  out = out.replace(/^!Drawing.*$/gim, '');
  out = out.replace(/^!\[\[[^\]]*\.excalidraw[^\]]*]]\s*$/gim, '');
  out = out.replace(/^\s*Copy code\s*$/gim, '');
  out = out.replace(/^#{1,6}\s*🤖\s*Assistant\s*$/gim, '');
  out = out.replace(/^\s*(?:-\s+)?[a-zA-Z0-9_.-]+::.*$/gm, '');
  out = out.replace(/\(\([0-9a-fA-F-]{8,}\)\)/g, '');
  out = out.replace(/\n{3,}/g, '\n\n').trim();
  if (!out) {
    out = [
      '# Notes',
      '',
      'This draft is imported from my Obsidian vault and will be expanded with full steps, commands, and troubleshooting notes.',
      ''
    ].join('\n');
  }
  return out;
}

function stripMarkdown(input) {
  return input
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[[^\]]*]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)]\([^)]*\)/g, '$1')
    .replace(/https?:\/\/\S+/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[🤖📌]/g, ' ')
    .replace(/\bAssistant\b/gi, ' ')
    .replace(/(^|\s)#[\p{L}\p{N}_-]+/gu, ' ')
    .replace(/^\s{0,3}#{1,6}\s+/gm, '')
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function makeDescription(title, body) {
  const clean = stripMarkdown(body);
  const parts = clean
    .split(/(?<=[.!?。！？])\s+/)
    .map((s) => s.trim())
    .filter((s) =>
      s.length >= 20 &&
      !/^[-*#\s]+$/.test(s) &&
      !/^(notes|todo)\b/i.test(s)
    );
  let pick = parts[0] || `${title} quick notes and setup checklist.`;
  pick = pick.replace(/\s+/g, ' ').trim();
  if (pick.length > 140) pick = `${pick.slice(0, 137).trimEnd()}...`;
  if (!/[.!?。！？]$/.test(pick)) pick += '.';
  return pick;
}

function toYaml({ title, description, pubDate, draft, sourcePath, sourceVault, slug }) {
  const lines = [
    '---',
    `title: ${JSON.stringify(title)}`,
    `description: ${JSON.stringify(description)}`,
    `pubDate: ${JSON.stringify(pubDate)}`,
    `updatedDate: ${JSON.stringify(TODAY)}`,
    `draft: ${draft}`,
    `category: ${JSON.stringify('infra')}`,
    `tags: [${JSON.stringify('infra')}]`,
    `sourcePath: ${JSON.stringify(sourcePath)}`,
    `sourceVault: ${JSON.stringify(sourceVault)}`,
    `slug: ${JSON.stringify(slug)}`,
    '---',
    ''
  ];
  return lines.join('\n');
}

async function* walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      yield* walk(p);
      continue;
    }
    if (/\.(md|mdx)$/i.test(e.name)) yield p;
  }
}

let touched = 0;
for await (const file of walk(ROOT)) {
  const raw = await fs.readFile(file, 'utf8');
  const parsed = parseDoc(raw);
  if (!parsed) continue;

  const headObj = parseHead(parsed.head);
  const sourceVault = stripQuotes(headObj.sourceVault || '');
  if (sourceVault !== 'obsidian/note') continue;

  const basename = path.basename(file, path.extname(file));
  const title = prettifyTitle(stripQuotes(headObj.title || ''), basename);
  const body = cleanupBody(parsed.body);
  const description = makeDescription(title, body);
  const pubDate = stripQuotes(headObj.pubDate || TODAY);
  const draftRaw = (headObj.draft || 'true').trim().toLowerCase();
  const draft = draftRaw === 'false' ? false : true;
  const sourcePath = stripQuotes(headObj.sourcePath || '');
  const slug = `infra/${basename.toLowerCase()}`;

  const next = `${toYaml({ title, description, pubDate, draft, sourcePath, sourceVault: 'obsidian/note', slug })}${body}\n`;
  if (next !== raw) {
    await fs.writeFile(file, next, 'utf8');
    touched += 1;
  }
}

console.log(`Optimized ${touched} infra Obsidian posts.`);
