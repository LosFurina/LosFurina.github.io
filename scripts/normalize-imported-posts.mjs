import fs from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve("src/content/blog");
const CHECK_ONLY = process.argv.includes("--check");

function cleanDescriptionLine(desc) {
	return desc
		.replace(/\(\([0-9a-fA-F-]{8,}\)\)/g, "")
		.replace(/\blogseq\.[a-zA-Z0-9_.-]+::\s*/g, "")
		.replace(/\s+/g, " ")
		.trim();
}

function stripMarkdown(input) {
	return input
		.replace(/```[\s\S]*?```/g, " ")
		.replace(/`[^`]*`/g, " ")
		.replace(/!\[\[[^\]]*\.excalidraw[^\]]*]]/gi, " ")
		.replace(/^!Drawing.*$/gim, " ")
		.replace(/!\[[^\]]*]\([^)]*\)/g, " ")
		.replace(/\[([^\]]+)]\([^)]*\)/g, "$1")
		.replace(/<[^>]+>/g, " ")
		.replace(/(^|\s)#[\p{L}\p{N}_-]+/gu, " ")
		.replace(/\bCopy code\b/gi, " ")
		.replace(/^\s{0,3}#{1,6}\s+/gm, "")
		.replace(/^\s*[-*+]\s+/gm, "")
		.replace(/^\s*\d+\.\s+/gm, "")
		.replace(/\s+/g, " ")
		.trim();
}

function makeDescription(title, body) {
	const clean = stripMarkdown(body);
	const parts = clean
		.split(/(?<=[.!?。！？])\s+/)
		.map((line) => line.trim())
		.filter(
			(line) =>
				line.length >= 24 &&
				!/^[-*#\s]+$/.test(line) &&
				!/\blogseq\./i.test(line) &&
				!/\(\([0-9a-fA-F-]{8,}\)\)/.test(line),
		);
	let pick = parts[0] || `${title} notes and practical write-up.`;
	pick = pick
		.replace(/\*+/g, "")
		.replace(/\s*-\s*/g, " ")
		.replace(/\s+/g, " ")
		.trim();
	if (pick.length > 155) {
		pick = `${pick.slice(0, 152).trimEnd()}...`;
	}
	if (!/[.!?。！？]$/.test(pick)) pick += ".";
	return pick;
}

async function* walk(dir) {
	const entries = await fs.readdir(dir, { withFileTypes: true });
	for (const entry of entries) {
		const fullPath = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			yield* walk(fullPath);
			continue;
		}
		if (!fullPath.endsWith(".md") && !fullPath.endsWith(".mdx")) continue;
		yield fullPath;
	}
}

function cleanBody(body) {
	let out = body;
	out = out.replace(/\r\n/g, "\n");
	out = out.replace(/^!Drawing.*$/gim, "");
	out = out.replace(/^!\[\[[^\]]*\.excalidraw[^\]]*]]\s*$/gim, "");

	// Remove Logseq inline properties and block ids.
	out = out.replace(/^\s*(?:-\s+)?[a-zA-Z0-9_.-]+::.*$/gm, "");

	// Remove Logseq block refs like ((uuid)).
	out = out.replace(/\(\([0-9a-fA-F-]{8,}\)\)/g, "");

	// Normalize LATER placeholders into readable note markers.
	out = out.replace(/\bLATER\b\s*:?/g, "Note:");

	// Convert list-heading artifacts from Logseq export.
	out = out.replace(/^\s*-\s+#\s+/gm, "## ");
	out = out.replace(/^\s*-\s+##\s+/gm, "## ");

	// Remove empty list markers left after cleanup.
	out = out.replace(/^\s*-\s*$/gm, "");

	// Collapse repeated blank lines.
	out = out.replace(/\n{3,}/g, "\n\n");

	return out.trimEnd();
}

let changed = 0;
let needsChanges = 0;

for await (const filePath of walk(ROOT)) {
	const raw = await fs.readFile(filePath, "utf8");
	const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
	if (!match) continue;

	const head = match[1];
	if (!/^\s*sourceVault:\s*["']?obsidian\/note["']?\s*$/m.test(head)) continue;
	const body = match[2];
	const cleanedBody = cleanBody(body);
	const currentBody = body.trimEnd();
	const titleMatch = head.match(/^title:\s*(.+)$/m);
	const title = titleMatch
		? titleMatch[1].replace(/^['"]|['"]$/g, "").trim()
		: "Imported Note";
	const updatedDesc = makeDescription(title, cleanedBody);
	let nextHead = head;
	if (/^description:\s*(.+)$/m.test(nextHead)) {
		nextHead = nextHead.replace(
			/^description:\s*(.+)$/m,
			(_, desc) => `description: ${JSON.stringify(cleanDescriptionLine(updatedDesc || desc))}`,
		);
	} else {
		nextHead = `${nextHead}\ndescription: ${JSON.stringify(updatedDesc)}`;
	}

	if (cleanedBody === currentBody && nextHead === head) continue;
	needsChanges += 1;
	if (!CHECK_ONLY) {
		const next = `---\n${nextHead}\n---\n${cleanedBody}\n`;
		await fs.writeFile(filePath, next, "utf8");
		changed += 1;
	}
}

if (CHECK_ONLY) {
	if (needsChanges > 0) {
		console.error(`Obsidian posts still need normalization: ${needsChanges} files.`);
		process.exit(1);
	}
	console.log("Obsidian posts are normalized.");
	process.exit(0);
}

console.log(`Normalized ${changed} Obsidian posts.`);
