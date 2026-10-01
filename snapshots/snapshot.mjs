import { createRequire } from "node:module";
import { writeFileSync, mkdirSync, cpSync, existsSync } from "node:fs";
import { join, dirname, resolve, relative, basename } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

/**
 * snapshot.mjs
 *
 * Headless-chromium snapshot of the built playground page ->
 * reports/component-catalog-dynamic.json
 *
 * No HTTP server: the page is opened via file://. Confined browsers (e.g. the
 * snap chromium) cannot read /tmp, so if --url points under /tmp the page is
 * copied to a home-dir temp location first.
 *
 * The page must contain a <div id="root"> with [data-slot] children (see
 * build-playground.mjs) and must set data-snapshot-ready="1" on <body> once
 * React has rendered (the generated entry does this after click-marker
 * instrumentation).
 *
 * Usage:
 *   node <pkg>/snapshots/snapshot.mjs --root <repoRoot> --url file:///abs/dist/playground.html \
 *        --manifest <path/to/manifest.js> [--out reports/component-catalog-dynamic.json]
 *
 * Env: SNAPSHOT_CHROME (default: /snap/bin/chromium, then /usr/bin/chromium,
 *      then /usr/bin/google-chrome), SNAPSHOT_PUPPETEER (path to puppeteer-core).
 *
 * Manifest entries may carry `jsxTag` — the JSX tag the consumer actually
 * writes (e.g. "Bn" for `import { Button as Bn }`). The dynamic catalog keys
 * on it (field `comp`), so the rule can resolve the tag at lint time.
 */

const here = dirname(fileURLToPath(import.meta.url));
const req = createRequire(join(here, "noop.js"));

function arg(name, dflt) {
	const i = process.argv.indexOf(`--${name}`);
	return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : dflt;
}
const root = arg("root", process.cwd());
const url = arg("url", null);
const manifestPath = arg("manifest", join(root, "playground/manifest.js"));
const outRel = arg("out", "reports/component-catalog-dynamic.json");
if (!url) throw new Error("--url is required (file:// URL of the built playground.html)");

// puppeteer-core: consumer first, then env override, then known hoisted locations.
const importFile = (p) => import(pathToFileURL(p).href);
let puppeteer;
try {
	puppeteer = await importFile(req.resolve("puppeteer-core"));
} catch {
	const candidates = [
		process.env.SNAPSHOT_PUPPETEER,
		"/home/llm/Documents/Work/fun/Jabberwock/node_modules/.pnpm/puppeteer-core@24.10.2/node_modules/puppeteer-core/lib/cjs/puppeteer/puppeteer-core.js",
	].filter(Boolean);
	let lastErr;
	for (const c of candidates) {
		try {
			puppeteer = await importFile(resolve(c));
			break;
		} catch (e) {
			lastErr = e;
		}
	}
	if (!puppeteer) throw new Error(`puppeteer-core not found (tried: ${candidates.join(", ")}): ${lastErr?.message}`);
}

const chrome =
	process.env.SNAPSHOT_CHROME ||
	[
		"/snap/bin/chromium",
		"/usr/bin/chromium",
		"/usr/bin/chromium-browser",
		"/usr/bin/google-chrome",
		"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
		"C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
	].find((p) => existsSync(p));
if (!chrome) throw new Error("No chromium found. Set SNAPSHOT_CHROME.");

const manifestUrl = manifestPath.startsWith("file:") ? manifestPath : pathToFileURL(manifestPath).href;
const manifest = (await import(manifestUrl)).default;

// Confinement: snap chromium cannot read /tmp. Copy the page to a home-dir temp.
let pageUrl = url;
const urlPath = decodeURIComponent(new URL(url).pathname);
if (urlPath.startsWith("/tmp/")) {
	// NOTE: snap chromium also refuses HIDDEN dirs — keep the name unhidden.
	const dest = join(process.env.HOME, "rqu-snapshot-dist");
	mkdirSync(dest, { recursive: true });
	cpSync(dirname(urlPath), dest, { recursive: true });
	// cpSync(distDir, existingDestDir) copies dist contents flat into dest
	pageUrl = `file://${dest}/${basename(urlPath)}`;
	console.log(`[snapshot] confined browser: page at ${pageUrl}`);
}

const browser = await puppeteer.default.launch({
	headless: "new",
	executablePath: chrome,
	args: ["--no-sandbox", "--disable-gpu", "--window-size=1440,900"],
});
try {
	const page = await browser.newPage();
	await page.setViewport({ width: 1440, height: 900 });
	const errors = [];
	page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
	page.on("console", (m) => m.type() === "error" && errors.push(`console: ${m.text()}`));
	await page.goto(pageUrl, { waitUntil: "load", timeout: 30000 });
	await page.waitForFunction("document.body.getAttribute('data-snapshot-ready') === '1'", { timeout: 20000 });

	const raw = await page.evaluate(() => {
		const props = [
			"display", "flex-direction", "align-items", "justify-content", "gap",
			"padding", "padding-top", "padding-right", "padding-bottom", "padding-left",
			"margin", "margin-top", "margin-right", "margin-bottom", "margin-left",
			"border", "border-radius", "box-shadow", "background-color", "color",
			"font-size", "font-weight", "text-align", "text-transform", "letter-spacing",
			"line-height", "width", "max-width", "height", "list-style",
		];
		const slots = [...document.querySelectorAll("[data-slot][data-comp]")];
		return slots.map((slot) => {
			const el = slot.children[1] || slot.firstElementChild;
			if (!el) return null;
			const cs = getComputedStyle(el);
			const styles = {};
			for (const p of props) {
				const v = cs.getPropertyValue(p);
				if (v && v !== "none" && v !== "normal" && v !== "auto" && v !== "0px" && v !== "transparent") styles[p] = v;
			}
			const attrs = {};
			for (const a of ["type", "role", "aria-label", "data-testid", "tabindex"]) {
				const v = el.getAttribute(a);
				if (v != null) attrs[a] = v;
			}
			const hasClick = !!el.closest("[data-clickevent]");
			return {
				id: slot.getAttribute("data-slot"),
				comp: slot.getAttribute("data-comp"),
				jsxTag: slot.getAttribute("data-jsxtag"),
				tag: el.tagName.toLowerCase(),
				styles,
				attrs,
				hasClick,
			};
		});
	});

	if (errors.length) console.error(`[snapshot] PAGE ERRORS:\n${errors.join("\n")}`);

	// --- noise filter: computed-style defaults that carry no design signal ---
	const NOISE = {
		"flex-direction": (v) => v === "row",
		"border": (v) => v.startsWith("0px solid") && /rgb\(0, 0, 0\)|transparent/.test(v),
		"list-style": () => true, // default "outside none disc"
		"width": () => true, // px layout noise
		"height": () => true,
		"max-width": (v) => v === "100%",
		"display": (v) => v === "block", // default for div
	};
	const normalize = (s) => {
		const out = {};
		for (const [k, v] of Object.entries(s)) {
			if (NOISE[k] && NOISE[k](v)) continue;
			if (k === "padding" || k === "margin") {
				const [t, r, b, l] = v.split(" ");
				if (t === r && r === b && b === l) { out[k] = t; continue; }
				if (l !== r) out[`margin` === k ? "margin-left" : "padding-left"] = l;
				if (r !== l) out[`margin` === k ? "margin-right" : "padding-right"] = r;
				if (t !== b) out[`margin` === k ? "margin-top" : "padding-top"] = t;
				if (b !== t) out[`margin` === k ? "margin-bottom" : "padding-bottom"] = b;
				continue;
			}
			out[k] = v;
		}
		return out;
	};

	const byId = new Map(raw.filter(Boolean).map((r) => [r.id, r]));
	const components = manifest.map((m) => {
		const r = byId.get(m.id);
		if (!r) throw new Error(`snapshot missing slot ${m.id}`);
		const styles = normalize(r.styles);
		// a11y must be an ARRAY of "key:value" tokens to match the static
		// catalog format (signature.js runs `new Set(entry.a11y)`).
		const a11y = Object.entries(r.attrs).map(([k, v]) => `${k}:${v}`);
		return {
			name: m.label,
			path: m.fileRel || relative(root, m.import[0]),
			comp: m.jsxTag || r.jsxTag, // JSX tag the consumer writes (dynTagMap key)
			origTag: r.comp, // export name (context)
			tag: r.tag, // rendered DOM tag
			styles,
			actions: r.hasClick ? ["click"] : [],
			a11y,
			data: {},
		};
	});

	const outPath = join(root, outRel);
	mkdirSync(dirname(outPath), { recursive: true });
	writeFileSync(outPath, JSON.stringify({ generatedAt: new Date().toISOString(), components }, null, 2));
	console.log(`[snapshot] wrote ${outPath} (${components.length} components)`);
} finally {
	await browser.close();
}
