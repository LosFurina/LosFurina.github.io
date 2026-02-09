import fs from "node:fs/promises";
import path from "node:path";

const REPO_ROOT = process.cwd();
const OBSIDIAN_ROOT = "/home/wayne/Desktop/workspace/obsidian/note";
const BLOG_ROOT = path.join(REPO_ROOT, "src/content/blog");
const OUTPUT_ROOT = BLOG_ROOT;
const MANIFEST_PATH = path.join(
	REPO_ROOT,
	"docs/migration/obsidian-to-astro-manifest.json",
);
const REPORT_PATH = path.join(
	REPO_ROOT,
	"docs/migration/obsidian-dedupe-report.md",
);

const DRY_RUN = process.argv.includes("--dry-run");
const IMPORT_DIRS = ["ComputerScience", "English Study"];
const EXCLUDE_PATTERNS = [
	/\.excalidraw\.md$/i,
	/(^|\/)copilot-custom-prompts\//i,
];

const REVIEW_LOWER = 0.75;
const REVIEW_UPPER = 0.88;

const STOP_WORDS = new Set([
	"the",
	"a",
	"an",
	"to",
	"for",
	"of",
	"in",
	"on",
	"and",
	"or",
	"is",
	"are",
	"be",
	"it",
	"this",
	"that",
	"with",
	"as",
	"by",
	"from",
	"you",
	"your",
	"we",
	"our",
	"i",
	"my",
	"at",
	"if",
	"how",
	"what",
	"why",
	"when",
	"who",
	"which",
]);

function normalizeText(input) {
	return input
		.toLowerCase()
		.normalize("NFKC")
		.replace(/%3f/g, "?")
		.replace(/[`*_~>#()[\]{}!.,;:|/\\]/g, " ")
		.replace(/\s+/g, " ")
		.trim();
}

function slugNorm(input) {
	return normalizeText(input.replace(/\//g, "-"));
}

function normalizeSlugPart(input) {
	return input
		.toLowerCase()
		.normalize("NFKC")
		.replace(/%3f/g, "")
		.replace(/[、，。！？；：（）【】《》“”‘’]/g, "-")
		.replace(/[^\p{L}\p{N}-]+/gu, "-")
		.replace(/-+/g, "-")
		.replace(/^-|-$/g, "");
}

function parseFrontmatter(raw) {
	const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
	if (!match) {
		return { frontmatter: null, body: raw };
	}
	const frontmatterText = match[1];
	const body = match[2];
	const frontmatter = {};
	for (const line of frontmatterText.split("\n")) {
		const idx = line.indexOf(":");
		if (idx <= 0) continue;
		const key = line.slice(0, idx).trim();
		const value = line.slice(idx + 1).trim();
		frontmatter[key] = value.replace(/^['"]|['"]$/g, "");
	}
	return { frontmatter, body };
}

function stripMarkdown(raw) {
	return raw
		.replace(/```[\s\S]*?```/g, " ")
		.replace(/`[^`]*`/g, " ")
		.replace(/!\[[^\]]*]\([^)]*\)/g, " ")
		.replace(/\[([^\]]+)]\([^)]*\)/g, "$1")
		.replace(/<[^>]+>/g, " ")
		.replace(/\[\[([^[\]|]+)\|([^[\]]+)\]\]/g, "$2")
		.replace(/\[\[([^[\]]+)\]\]/g, "$1")
		.replace(/^\s{0,3}#{1,6}\s+/gm, "")
		.replace(/^\s*[-*+]\s+/gm, "")
		.replace(/^\s*\d+\.\s+/gm, "")
		.replace(/\s+/g, " ")
		.trim();
}

function tokenize(raw) {
	return new Set(
		normalizeText(raw)
			.split(" ")
			.filter((word) => word.length >= 2 && !STOP_WORDS.has(word))
			.slice(0, 1200),
	);
}

function jaccard(a, b) {
	if (a.size === 0 || b.size === 0) return 0;
	let intersection = 0;
	for (const item of a) {
		if (b.has(item)) intersection += 1;
	}
	const union = a.size + b.size - intersection;
	return union === 0 ? 0 : intersection / union;
}

function cleanupObsidianBody(raw) {
	let body = raw;
	body = body.replace(/\r\n/g, "\n");
	body = body.replace(/^:logbook:[\s\S]*?:END:\n?/gim, "");
	body = body.replace(/\[\[([^[\]|]+)\|([^[\]]+)\]\]/g, "$2");
	body = body.replace(/\[\[([^[\]]+)\]\]/g, "$1");
	body = body.replace(/\n{3,}/g, "\n\n").trim();
	return body;
}

function deriveTitle(relativePath, parsedFrontmatter, body) {
	if (parsedFrontmatter?.title) return parsedFrontmatter.title;
	const heading = body.match(/^\s*#\s+(.+)\s*$/m);
	if (heading) return heading[1].trim();

	const basename = path.basename(relativePath, path.extname(relativePath));
	try {
		return decodeURIComponent(basename).replace(/%3F/gi, "?");
	} catch {
		return basename.replace(/%3F/gi, "?");
	}
}

function buildDescription(title, body) {
	const clean = stripMarkdown(body);
	const parts = clean
		.split(/(?<=[.!?。！？])\s+/)
		.map((line) => line.trim())
		.filter((line) => line.length >= 24);
	let pick = parts[0] || `${title} notes and practical write-up.`;
	if (pick.length > 155) {
		pick = `${pick.slice(0, 152).trimEnd()}...`;
	}
	if (!/[.!?。！？]$/.test(pick)) pick += ".";
	return pick;
}

function resolveCategory(relativePath) {
	if (relativePath.startsWith("English Study/")) return "english";
	return "infra";
}

function makeOutputFileName(title, fallbackPath) {
	const fromTitle = normalizeSlugPart(title);
	if (fromTitle) return fromTitle;
	const basename = path.basename(fallbackPath, path.extname(fallbackPath));
	let decoded = basename;
	try {
		decoded = decodeURIComponent(basename);
	} catch {
		decoded = basename;
	}
	return normalizeSlugPart(decoded) || "untitled";
}

function toISODate(inputMs) {
	return new Date(inputMs).toISOString().slice(0, 10);
}

async function ensureDir(dirPath) {
	if (DRY_RUN) return;
	await fs.mkdir(dirPath, { recursive: true });
}

async function fileExists(filePath) {
	try {
		await fs.access(filePath);
		return true;
	} catch {
		return false;
	}
}

async function* walk(rootDir) {
	const entries = await fs.readdir(rootDir, { withFileTypes: true });
	for (const entry of entries) {
		const fullPath = path.join(rootDir, entry.name);
		if (entry.isDirectory()) {
			yield* walk(fullPath);
			continue;
		}
		if (!entry.name.endsWith(".md") && !entry.name.endsWith(".mdx")) continue;
		yield fullPath;
	}
}

async function loadExistingPosts() {
	const items = [];
	for await (const filePath of walk(BLOG_ROOT)) {
		if (filePath.endsWith(".bak")) continue;
		const raw = await fs.readFile(filePath, "utf8");
		const { frontmatter, body } = parseFrontmatter(raw);
		const rel = path.relative(BLOG_ROOT, filePath);
		const slug = rel.replace(/\.(md|mdx)$/i, "").replace(/\\/g, "/");
		const title = frontmatter?.title ?? path.basename(slug);
		items.push({
			filePath,
			relPath: rel,
			slug,
			title,
			titleNorm: normalizeText(title),
			slugNorm: slugNorm(slug),
			bodyTokens: tokenize(stripMarkdown(body)),
		});
	}
	return items;
}

async function loadObsidianCandidates() {
	const results = [];
	for (const dirname of IMPORT_DIRS) {
		const dirPath = path.join(OBSIDIAN_ROOT, dirname);
		for await (const filePath of walk(dirPath)) {
			const rel = path.relative(OBSIDIAN_ROOT, filePath).replace(/\\/g, "/");
			if (EXCLUDE_PATTERNS.some((pattern) => pattern.test(rel))) continue;
			results.push({ filePath, relPath: rel });
		}
	}
	return results;
}

function frontmatterToYaml(record) {
	const lines = ["---"];
	for (const [key, value] of Object.entries(record)) {
		if (Array.isArray(value)) {
			lines.push(`${key}: [${value.map((v) => JSON.stringify(v)).join(", ")}]`);
			continue;
		}
		if (typeof value === "string") {
			lines.push(`${key}: ${JSON.stringify(value)}`);
			continue;
		}
		lines.push(`${key}: ${String(value)}`);
	}
	lines.push("---", "");
	return lines.join("\n");
}

async function main() {
	const existing = await loadExistingPosts();
	const existingSlugSet = new Set(existing.map((post) => post.slugNorm));
	const existingTitleMap = new Map(existing.map((post) => [post.titleNorm, post]));

	const candidates = await loadObsidianCandidates();
	const manifest = [];
	const summary = {
		totalCandidates: candidates.length,
		imported: 0,
		existingSlug: 0,
		existingTitle: 0,
		similarSkip: 0,
		needsReview: 0,
	};

	await ensureDir(path.join(REPO_ROOT, "docs/migration"));
	await ensureDir(path.join(OUTPUT_ROOT, "infra"));
	await ensureDir(path.join(OUTPUT_ROOT, "english"));

	for (const candidate of candidates) {
		const stat = await fs.stat(candidate.filePath);
		const raw = await fs.readFile(candidate.filePath, "utf8");
		const { frontmatter, body } = parseFrontmatter(raw);
		const cleanedBody = cleanupObsidianBody(body);
		const title = deriveTitle(candidate.relPath, frontmatter, cleanedBody);
		const slugBase = makeOutputFileName(title, candidate.relPath);
		const category = resolveCategory(candidate.relPath);
		const slugCandidate = slugNorm(`${category}/${slugBase}`);
		const titleNorm = normalizeText(title);
		const tokens = tokenize(stripMarkdown(cleanedBody));

		let status = "new_draft";
		let reason = "";
		let matchedWith = "";
		let similarity = 0;

		if (existingSlugSet.has(slugCandidate)) {
			status = "existing";
			reason = "slug_match";
			summary.existingSlug += 1;
		} else if (existingTitleMap.has(titleNorm)) {
			status = "existing";
			reason = "title_match";
			matchedWith = existingTitleMap.get(titleNorm).slug;
			summary.existingTitle += 1;
		} else {
			let best = null;
			for (const post of existing) {
				const score = jaccard(tokens, post.bodyTokens);
				if (!best || score > best.score) {
					best = { score, post };
				}
			}
			similarity = best?.score ?? 0;
			if (similarity >= REVIEW_UPPER) {
				status = "existing";
				reason = "high_similarity";
				matchedWith = best.post.slug;
				summary.similarSkip += 1;
			} else if (similarity >= REVIEW_LOWER) {
				status = "needs_review";
				reason = "medium_similarity";
				matchedWith = best.post.slug;
				summary.needsReview += 1;
			}
		}

		const record = {
			sourcePath: candidate.relPath,
			title,
			category,
			status,
			reason,
			matchedWith,
			similarity: Number(similarity.toFixed(3)),
		};
		manifest.push(record);

		if (status !== "new_draft") continue;

		const outputDir = path.join(OUTPUT_ROOT, category);
		let outputName = slugBase;
		let attempt = 2;
		let outputFile = path.join(outputDir, `${outputName}.md`);
		while (await fileExists(outputFile)) {
			outputName = `${slugBase}-${attempt}`;
			outputFile = path.join(outputDir, `${outputName}.md`);
			attempt += 1;
		}

		const description = buildDescription(title, cleanedBody);
		const yaml = frontmatterToYaml({
			title,
			description,
			pubDate: toISODate(stat.mtimeMs),
			updatedDate: toISODate(stat.mtimeMs),
			draft: true,
			slug: `${category}/${outputName}`.toLowerCase(),
			category,
			tags: [category],
			sourcePath: candidate.relPath,
			sourceVault: "obsidian/note",
		});
		const outputContent = `${yaml}${cleanedBody}\n`;
		if (!DRY_RUN) {
			await fs.writeFile(outputFile, outputContent, "utf8");
		}
		summary.imported += 1;
	}

	const reportLines = [
		"# Obsidian -> Astro Migration Report",
		"",
		`- Timestamp: ${new Date().toISOString()}`,
		`- Dry run: ${DRY_RUN ? "yes" : "no"}`,
		`- Candidates: ${summary.totalCandidates}`,
		`- Imported as draft: ${summary.imported}`,
		`- Existing by slug: ${summary.existingSlug}`,
		`- Existing by title: ${summary.existingTitle}`,
		`- Existing by high similarity: ${summary.similarSkip}`,
		`- Needs review: ${summary.needsReview}`,
		"",
		"## Needs Review",
		"",
		...manifest
			.filter((item) => item.status === "needs_review")
			.map(
				(item) =>
					`- ${item.sourcePath} -> ${item.matchedWith} (similarity=${item.similarity})`,
			),
	];

	if (!DRY_RUN) {
		await fs.writeFile(MANIFEST_PATH, JSON.stringify({ summary, manifest }, null, 2));
		await fs.writeFile(REPORT_PATH, `${reportLines.join("\n")}\n`, "utf8");
	}

	console.log(JSON.stringify({ summary, dryRun: DRY_RUN }, null, 2));
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
