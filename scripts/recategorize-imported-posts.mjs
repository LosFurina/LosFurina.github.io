import fs from "node:fs/promises";
import path from "node:path";

const BLOG_ROOT = path.resolve("src/content/blog");
const IMPORTED_ROOT = path.join(BLOG_ROOT, "imported");

function updateFrontmatter(raw, category) {
	const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
	if (!match) return raw;
	let head = match[1];
	const body = match[2];

	if (/^category:\s*.+$/m.test(head)) {
		head = head.replace(/^category:\s*.+$/m, `category: ${JSON.stringify(category)}`);
	} else {
		head += `\ncategory: ${JSON.stringify(category)}`;
	}

	if (/^tags:\s*.+$/m.test(head)) {
		head = head.replace(/^tags:\s*.+$/m, `tags: [${JSON.stringify(category)}]`);
	} else {
		head += `\ntags: [${JSON.stringify(category)}]`;
	}

	return `---\n${head}\n---\n${body}`;
}

async function exists(filePath) {
	try {
		await fs.access(filePath);
		return true;
	} catch {
		return false;
	}
}

function addSuffix(fileName, suffix) {
	const ext = path.extname(fileName);
	const base = fileName.slice(0, -ext.length);
	return `${base}${suffix}${ext}`;
}

async function moveCategory(category) {
	const fromDir = path.join(IMPORTED_ROOT, category);
	const toDir = path.join(BLOG_ROOT, category);
	await fs.mkdir(toDir, { recursive: true });

	const entries = await fs.readdir(fromDir, { withFileTypes: true });
	let moved = 0;
	for (const entry of entries) {
		if (!entry.isFile()) continue;
		if (!entry.name.endsWith(".md") && !entry.name.endsWith(".mdx")) continue;
		const src = path.join(fromDir, entry.name);
		let targetName = entry.name;
		let dst = path.join(toDir, targetName);

		if (await exists(dst)) {
			targetName = addSuffix(entry.name, "-obsidian");
			dst = path.join(toDir, targetName);
		}
		let i = 2;
		while (await exists(dst)) {
			targetName = addSuffix(entry.name, `-obsidian-${i}`);
			dst = path.join(toDir, targetName);
			i += 1;
		}

		const raw = await fs.readFile(src, "utf8");
		const updated = updateFrontmatter(raw, category);
		await fs.writeFile(dst, updated, "utf8");
		await fs.unlink(src);
		moved += 1;
	}
	return moved;
}

async function main() {
	const movedEnglish = await moveCategory("english");
	const movedInfra = await moveCategory("infra");

	// Try removing empty imported dirs.
	for (const dir of [
		path.join(IMPORTED_ROOT, "english"),
		path.join(IMPORTED_ROOT, "infra"),
		IMPORTED_ROOT,
	]) {
		try {
			await fs.rmdir(dir);
		} catch {
			// Ignore non-empty or missing.
		}
	}

	console.log(
		JSON.stringify(
			{
				moved: movedEnglish + movedInfra,
				english: movedEnglish,
				infra: movedInfra,
			},
			null,
			2,
		),
	);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
