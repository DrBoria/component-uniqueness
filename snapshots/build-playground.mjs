import { createRequire } from "node:module";
import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

/**
 * build-playground.mjs
 *
 * Builds the one-and-only playground page from a manifest:
 *   - every component is rendered exactly ONCE per run
 *   - the page is static (dist/playground.html + playground.js) — it can be
 *     snapshotted later by headless chromium with file://, no server needed
 *
 * Usage (from the consumer repo, e.g. /tmp/strict-test):
 *   node <pkg>/snapshots/build-playground.mjs --root <repoRoot> --manifest <path/to/manifest.js>
 *
 * The manifest is a CommonJS module exporting an array of:
 *   { id, label, import: [absModulePath, exportName], jsxTag?, props }
 *
 * Output: <root>/dist/playground.html + <root>/dist/playground.js
 * (plus <root>/dist/tw.css if the manifest file lives next to an input.css —
 * the consumer generates tw.css itself with @tailwindcss/cli when needed).
 */

const here = dirname(fileURLToPath(import.meta.url));
const req = createRequire(join(here, "noop.js"));

function arg(name, dflt) {
	const i = process.argv.indexOf(`--${name}`);
	return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : dflt;
}
const root = arg("root", process.cwd());
const manifestPath = arg("manifest", join(root, "playground/manifest.js"));

// esbuild: consumer's node_modules first, then this package's, then env override.
const importFile = (p) => import(pathToFileURL(p).href);
let esbuild;
try {
	esbuild = await importFile(req.resolve("esbuild"));
} catch {
	try {
		esbuild = await importFile(req.resolve(join(here, "..", "node_modules/esbuild/lib/main.js")));
	} catch {
		if (!process.env.ESBUILD_PATH) throw new Error("esbuild not found: install it or set ESBUILD_PATH");
		const ep = process.env.ESBUILD_PATH;
		esbuild = ep.startsWith("file:") || ep.startsWith("node:") ? await import(ep) : await importFile(ep);
	}
}

const manifestUrl = manifestPath.startsWith("file:") ? manifestPath : pathToFileURL(manifestPath).href;
const manifest = (await import(manifestUrl)).default;
if (!Array.isArray(manifest) || !manifest.length) throw new Error(`manifest at ${manifestPath} must export a non-empty array`);

const dist = join(root, "dist");
mkdirSync(dist, { recursive: true });

function serProps(p) {
	const parts = [];
	for (const [k, v] of Object.entries(p || {})) {
		if (typeof v === "function") parts.push(`${k}: () => {}`);
		else parts.push(`${k}: ${JSON.stringify(v)}`);
	}
	return `{ ${parts.join(", ")} }`;
}

const imports = manifest.map((m, i) => `import { ${m.import[1]} as Comp${i} } from ${JSON.stringify(m.import[0])};`);
const slots = manifest.map((m, i) => `  { id: ${JSON.stringify(m.id)}, name: ${JSON.stringify(m.import[1])}, jsxTag: ${JSON.stringify(m.jsxTag || m.import[1])}, comp: Comp${i}, props: ${serProps(m.props)} },`).join("\n");

const entry = `import * as React from "react";
import { createRoot } from "react-dom/client";
${imports.join("\n")}
const SLOTS = [
${slots}
];
function App() {
  return React.createElement("div", { style: { fontFamily: "sans-serif", padding: 16 } },
    SLOTS.map((s) =>
      React.createElement("div", { key: s.id, "data-slot": s.id, "data-comp": s.name, "data-jsxtag": s.jsxTag, style: { margin: 12, padding: 8, border: "1px solid #ccc", borderRadius: 6 } },
        [React.createElement("div", { style: { fontSize: 11, color: "#888", marginBottom: 6 } }, s.name + "  [" + s.id + "]"),
         React.createElement(s.comp, s.props)]
      )
    )
  );
}
const root = document.getElementById("root");
createRoot(root).render(React.createElement(App));
// Click-marker instrumentation: React delegates listeners to its root
// container, so per-element getEventListeners is unavailable from page
// context. Read the onClick prop from the fiber props map (React 18: key
// starts with "__reactProps$") and mark the element with data-clickevent.
window.addEventListener("load", () => {
  setTimeout(() => {
    const app = document.querySelector("[data-slot]");
    if (!app) return;
    let key = null;
    for (const k of Object.keys(app)) if (k.startsWith("__reactProps$")) { key = k; break; }
    if (!key) return;
    const marked = new WeakSet();
    const mark = (el) => {
      if (marked.has(el)) return;
      marked.add(el);
      const p = el[key];
      if (p && typeof p.onClick === "function") el.setAttribute("data-clickevent", "1");
      for (let c = el.firstElementChild; c; c = c.nextElementSibling) mark(c);
    };
    mark(root.firstElementChild);
    document.body.setAttribute("data-snapshot-ready", "1");
  }, 400);
});
`;

const entryPath = join(root, "playground/entry.generated.tsx");
writeFileSync(entryPath, entry);

const html = `<!doctype html>
<html><head><meta charset="utf-8"><link rel="stylesheet" href="tw.css"></head>
<body><div id="root"></div><script src="playground.js"></script>
<script>document.body.setAttribute("data-snapshot-ready","0");</script>
</body></html>`;
writeFileSync(join(dist, "playground.html"), html);

await esbuild.build({
	entryPoints: [entryPath],
	bundle: true,
	format: "iife",
	outfile: join(dist, "playground.js"),
	jsx: "automatic",
	define: { "process.env.NODE_ENV": '"production"' },
	logLevel: "warning",
	platform: "browser",
});
console.log(`PLAYGROUND BUNDLE OK -> ${join(dist, "playground.js")} (${manifest.length} slots)`);
