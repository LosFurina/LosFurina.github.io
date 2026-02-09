import fs from "node:fs/promises";
import path from "node:path";

const BLOG_ROOT = path.resolve("src/content/blog");
const CHECK_ONLY = process.argv.includes("--check");

const MARKDOWN_EXT = new Set([".md", ".mdx"]);

function stripMarkdown(input) {
	let text = input;
	text = text.replace(/```[\s\S]*?```/g, " ");
	text = text.replace(/`[^`]*`/g, " ");
	text = text.replace(/!\[[^\]]*]\([^)]*\)/g, " ");
	text = text.replace(/\[([^\]]+)]\([^)]*\)/g, "$1");
	text = text.replace(/<[^>]+>/g, " ");
	text = text.replace(/^\s{0,3}#{1,6}\s+/gm, "");
	text = text.replace(/^\s*[-*+]\s+/gm, "");
	text = text.replace(/^\s*\d+\.\s+/gm, "");
	text = text.replace(/[*_~>#]/g, " ");
	text = text.replace(/\s+/g, " ").trim();
	return text;
}

function makeDescription(content, title) {
	const clean = stripMarkdown(content);
	const chunks = clean
		.split(/(?<=[.!?。！？])\s+/)
		.map((line) => line.trim())
		.filter(Boolean);

	let candidate = chunks.find(
		(line) =>
			line.length >= 36 &&
			line.length <= 180 &&
			!/lorem ipsum/i.test(line) &&
			!/auto-generated description/i.test(line) &&
			!/^topic$/i.test(line) &&
			!/^practice$/i.test(line) &&
			!/^keywords$/i.test(line),
	);

	if (!candidate) {
		candidate =
			chunks.find(
				(line) =>
					line.length >= 24 &&
					!/lorem ipsum/i.test(line) &&
					!/auto-generated description/i.test(line),
			) ?? `${title} notes and practical write-up.`;
	}

	let normalized = candidate.replace(/\s+/g, " ").trim();
	if (normalized.length > 155) {
		normalized = `${normalized.slice(0, 152).trimEnd()}...`;
	}

	if (!/[.!?。！？]$/.test(normalized)) {
		normalized = `${normalized}.`;
	}
	return normalized;
}

function parseTitle(frontmatter) {
	const match = frontmatter.match(/^title:\s*(.+)$/m);
	if (!match) return "Blog post";
	return match[1].replace(/^['"]|['"]$/g, "").trim();
}

function needsRewrite(description) {
	return (
		/auto-generated description for/i.test(description) ||
		/lorem ipsum/i.test(description)
	);
}

async function* walk(dir) {
	const entries = await fs.readdir(dir, { withFileTypes: true });
	for (const entry of entries) {
		const fullPath = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			yield* walk(fullPath);
			continue;
		}
		const ext = path.extname(entry.name).toLowerCase();
		if (!MARKDOWN_EXT.has(ext)) continue;
		yield fullPath;
	}
}

let filesChanged = 0;
let rewritesNeeded = 0;

for await (const filePath of walk(BLOG_ROOT)) {
	const raw = await fs.readFile(filePath, "utf8");
	const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
	if (!match) continue;

	const frontmatter = match[1];
	const content = match[2];
	const descMatch = frontmatter.match(/^description:\s*(.+)$/m);
	if (!descMatch) continue;

	const currentDescription = descMatch[1].replace(/^['"]|['"]$/g, "").trim();
	if (!needsRewrite(currentDescription)) continue;

	const title = parseTitle(frontmatter);
	const nextDescription = makeDescription(content, title);
	const nextDescLine = `description: ${JSON.stringify(nextDescription)}`;
	const nextFrontmatter = frontmatter.replace(/^description:\s*.+$/m, nextDescLine);
	const nextRaw = `---\n${nextFrontmatter}\n---\n${content}`;

	rewritesNeeded += 1;
	if (!CHECK_ONLY) {
		await fs.writeFile(filePath, nextRaw, "utf8");
		filesChanged += 1;
	}
}

if (CHECK_ONLY) {
	if (rewritesNeeded > 0) {
		console.error(`Found ${rewritesNeeded} blog files needing content optimization.`);
		process.exit(1);
	}
	console.log("All blog descriptions are optimized.");
	process.exit(0);
}

console.log(`Optimized ${filesChanged} blog files.`);
