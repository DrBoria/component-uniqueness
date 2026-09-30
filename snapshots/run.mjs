import { execFileSync } from "node:child_process";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { existsSync } from "node:fs";

/**
 * run.mjs — one command for the whole dynamic-catalog pipeline.
 *
 *   node <pkg>/snapshots/run.mjs --root <repoRoot> [--manifest <path>] [--url <file://...>]
 *
 * Steps:
 *   1. build-playground.mjs — bundle the manifest into dist/playground.html + playground.js
 *   2. snapshot.mjs         — headless chromium (file://, no server) renders the page,
 *                             captures computed styles + click markers per slot and
 *                             writes reports/component-catalog-dynamic.json
 *
 * The consumer is responsible for dist/tw.css (e.g. @tailwindcss/cli) — the
 * generated page links it, but the snapshot works without it (components
 * that rely on tailwind classes will just capture fewer styles).
 */

const here = dirname(fileURLToPath(import.meta.url));

function arg(name, dflt) {
	const i = process.argv.indexOf(`--${name}`);
	return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : dflt;
}
const root = arg("root", process.cwd());
const manifest = arg("manifest", join(root, "playground/manifest.js"));
const url = arg("url", `file://${join(root, "dist/playground.html")}`);

const node = process.execPath;
const env = { ...process.env };

console.log(`[run] 1/2 build playground (root=${root})`);
execFileSync(node, [join(here, "build-playground.mjs"), "--root", root, "--manifest", manifest], { stdio: "inherit", env });

console.log(`[run] 2/2 snapshot (url=${url})`);
execFileSync(node, [join(here, "snapshot.mjs"), "--root", root, "--url", url, "--manifest", manifest], { stdio: "inherit", env });

const out = join(root, "reports/component-catalog-dynamic.json");
if (!existsSync(out)) throw new Error(`expected output not found: ${out}`);
console.log(`[run] DONE -> ${out}`);
