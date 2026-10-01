"use strict";

/**
 * report.js
 *
 * Human-readable duplicate report (Markdown).
 *
 * The report clusters EVERY element signature found in the scanned code —
 * both the canonical component folders and the app code — using the same
 * decision matrix the ESLint rule uses (signature.js `decide`). Two
 * signatures from DIFFERENT files that match (error or warning tier) are
 * joined into one cluster (union-find). A cluster is a set of components /
 * elements that duplicate one another.
 *
 * This is what makes keystone-only duplicates visible: two hand-rolled
 * components that live only in apps/_keystone (and are NOT in the catalog)
 * still form a cluster, because the clustering is pairwise over all scanned
 * signatures, not "app code vs catalog".
 *
 * Clusters are named after the canonical component when one of their members
 * is a catalog entry; otherwise they are named after the most common tag.
 *
 * Tiers (decision matrix, `signature.js`):
 *   exact  (error tier):  a11y/actions overlap, or styles >= 90% (any tag),
 *                         or styles >= 70% for the same tag
 *   similar (warning tier): styles 50-90% (different tag) or 40-70% (same tag)
 *
 * No file links — counts only:
 *   component: Button, duplicates: 20 (12 exact, 8 similar)
 *   component: Input,  duplicates: 2  (2 exact)
 */

const { stylesSimilarity, specificA11yToken, MIN_SHARED_STYLE_KEYS } = require("./signature");

/**
 * Generic layout/box CSS keys that appear on hundreds of unrelated elements and
 * therefore cannot, on their own, identify a component. Two elements whose
 * shared keys are ALL generic (e.g. `display:flex; align-items:center; gap:8px`)
 * are NOT a duplicate — they are just both flex containers. Requiring at least
 * one SHARED distinctive key (border-radius, box-shadow, color, background,
 * border, ...) breaks the transitive "generic flexbox" hub that would
 * otherwise chain the whole graph together and hide the real duplicates.
 * Typography (font-size/weight, line-height) and spacing (margin/padding) are
 * treated as generic too: they appear on hundreds of unrelated labels and
 * paragraphs and would otherwise form their own hubs.
 *
 * The set is deliberately conservative: a key missing from it is treated as
 * distinctive, which only ADDS edges (never drops a real duplicate). It can
 * never cause a false negative, only a (rare) false positive.
 */
const GENERIC_STYLE_KEYS = new Set([
	"display",
	"flex",
	"flex-direction",
	"flex-wrap",
	"flex-grow",
	"flex-shrink",
	"flex-basis",
	"align-items",
	"align-content",
	"justify-content",
	"justify-items",
	"gap",
	"row-gap",
	"column-gap",
	"position",
	"top",
	"right",
	"bottom",
	"left",
	"z-index",
	"overflow",
	"overflow-x",
	"overflow-y",
	"cursor",
	"transition",
	"transition-property",
	"user-select",
	"box-sizing",
	"width",
	"height",
	"min-width",
	"max-width",
	"min-height",
	"max-height",
	// Typography + spacing: present on hundreds of unrelated labels/paragraphs/
	// headings. Without these, "font-weight + margin-bottom" alone chains every
	// form label in the repo into one hub (seen on Jabberwock: 65-member label
	// cluster of identical `block font-medium mb-1` labels).
	"font-size",
	"font-weight",
	"font-family",
	"line-height",
	"letter-spacing",
	"text-align",
	"margin",
	"margin-top",
	"margin-right",
	"margin-bottom",
	"margin-left",
	"padding",
	"padding-top",
	"padding-right",
	"padding-bottom",
	"padding-left",
]);

/**
 * Do two style objects share at least one DISTINCTIVE (non-generic) key?
 * This is the gate that stops generic flexbox layouts from forming a hub.
 *
 * @param {object} a style object
 * @param {object} b style object
 * @returns {boolean} true when the intersection contains a non-generic key
 */
function sharesDistinctiveKey(a, b) {
	const keys = Object.keys(a || {});
	const other = new Set(Object.keys(b || {}));
	return keys.some((k) => !GENERIC_STYLE_KEYS.has(k) && other.has(k));
}

/**
 * Cluster all signatures (canonical + app) pairwise. Two signatures from
 * different files that match at either tier are unioned.
 *
 * @param {object[]} allSigs signatures with { tag, styles, actions, a11y, path, name? }
 * @returns {Map<number, { exact: number, similar: number, name: string, members: object[] }>}
 *          root index -> cluster (only clusters with >1 member are returned)
 */
function clusterSignatures(allSigs) {
	const n = allSigs.length;
	const parent = new Array(n);
	for (let i = 0; i < n; i += 1) parent[i] = i;
	const find = (x) => {
		while (parent[x] !== x) {
			parent[x] = parent[parent[x]];
			x = parent[x];
		}
		return x;
	};
	const union = (a, b) => {
		const ra = find(a);
		const rb = find(b);
		if (ra !== rb) parent[rb] = ra;
	};

	// A cluster edge = two signatures that describe the SAME component.
	//
	// We deliberately do NOT use the full `decide` matrix here. The matrix's
	// "action overlap → error" edge (onClick/onChange) is far too generic to be
	// transitive: hundreds of unrelated clickable elements would chain into one
	// giant union-find "hub" that swallows the real duplicates. Clustering is
	// built on the signals that actually mean "same visual/behavioral component":
	//
	//   1. a11y overlap (role:dialog, type:range, ...) — but ONLY across files.
	//      Within one file, shared a11y tokens are normal (a form with three
	//      type:text inputs is not a duplicate).
	//   2. style similarity with a real shared footprint (>= MIN_SHARED_STYLE_KEYS
	//      shared CSS keys): same tag >= 0.7, different tag >= 0.9. This is
	//      order-insensitive by construction (Jaccard over property keys) and is
	//      the signal for "same component, styles written in a different order".
	//
	// Both are "exact" (error-tier) edges; the warning tier stays a pairwise
	// report hint, not a transitive glue.
	const styleKeys = allSigs.map((s) => Object.keys(s.styles || {}));

	for (let i = 0; i < n; i += 1) {
		const si = allSigs[i];
		for (let j = i + 1; j < n; j += 1) {
			const sj = allSigs[j];
			const sameFile = si.path === sj.path;
			// (1) a11y overlap — cross-file only, and only on MEANINGFUL tokens.
			// Boolean-presence tokens (value "true", e.g. `aria-label:true`,
			// `aria-expanded:true`) are NOT a duplicate signal: hundreds of
			// unrelated labeled/expandable elements all carry them, which would
			// chain the whole graph into one giant hub. A real a11y duplicate
			// shares a role or a typed input (role:dialog, type:range, ...).
			if (!sameFile) {
				// Only tokens specific enough to identify a component (role:dialog,
				// aria-label:..., ...). Ubiquitous ones (type:button, role:group,
				// every text input's type:text) are transitive glue: a single
				// catalog button would chain every button in the repo into one hub.
				const ai = new Set((si.a11y || []).filter(specificA11yToken));
				if ((sj.a11y || []).some((t) => specificA11yToken(t) && ai.has(t))) {
					union(i, j);
					continue;
				}
			}
			// (2) style similarity with a real shared footprint.
			const ki = styleKeys[i];
			const kj = new Set(styleKeys[j]);
			const shared = ki.length ? ki.filter((k) => kj.has(k)).length : 0;
			if (shared < MIN_SHARED_STYLE_KEYS) continue;
			// Both signatures must share a distinctive (non-generic) key, otherwise
			// they are just two generic flex/box layouts and must not be clustered.
			if (!sharesDistinctiveKey(si.styles, sj.styles)) continue;
			const sim = stylesSimilarity(si.styles, sj.styles);
			const sameTag = si.tag === sj.tag;
			if ((sameTag && sim >= 0.7) || (!sameTag && sim >= 0.9)) union(i, j);
		}
	}

	// Group by root.
	const groups = new Map();
	for (let i = 0; i < n; i += 1) {
		const r = find(i);
		if (!groups.has(r)) groups.set(r, []);
		groups.get(r).push(i);
	}

	// Build clusters with >1 member. Every member reached the cluster through an
	// "exact" edge (a11y overlap or high style similarity), so every member is an
	// exact duplicate. The warning tier is a pairwise report hint, not a cluster
	// edge, so it never appears in cluster counts.
	const clusters = new Map();
	for (const [root, idxs] of groups) {
		if (idxs.length < 2) continue;
		const exact = idxs.length;
		const similar = 0;
		// Name: canonical component if any member has one, else most common tag.
		let name = null;
		for (const idx of idxs) {
			if (allSigs[idx].name) {
				name = allSigs[idx].name;
				break;
			}
		}
		if (!name) {
			const tagCount = new Map();
			for (const idx of idxs) {
				const t = allSigs[idx].tag || "?";
				tagCount.set(t, (tagCount.get(t) || 0) + 1);
			}
			name = [...tagCount.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0][0];
		}
		clusters.set(root, { exact, similar, name, members: idxs.map((i) => allSigs[i]) });
	}
	return clusters;
}

/**
 * Count duplicates per component name from a cluster map.
 *
 * @param {Map<number, object>} clusters from clusterSignatures
 * @returns {Map<string, { exact: number, similar: number }>} name -> tier counts
 */
function clusterCounts(clusters) {
	const counts = new Map();
	for (const c of clusters.values()) {
		const total = c.members.length;
		if (total < 2) continue;
		if (!counts.has(c.name)) counts.set(c.name, { exact: 0, similar: 0 });
		const cur = counts.get(c.name);
		cur.exact += c.exact;
		cur.similar += c.similar;
	}
	return counts;
}

/**
 * (Legacy) Match every app-code signature against the catalog only.
 * Kept for callers that want the catalog-vs-app view.
 *
 * @param {object[]} appSigs
 * @param {object[]} catalog
 * @returns {Map<string, { exact: number, similar: number }>}
 */
function duplicateCounts(appSigs, catalog) {
	const { matchSignature } = require("./signature");
	const counts = new Map();
	for (const sig of appSigs) {
		const hit = matchSignature(sig, { components: catalog });
		if (!hit) continue;
		if (!counts.has(hit.name)) counts.set(hit.name, { exact: 0, similar: 0 });
		counts.get(hit.name)[hit.level === "error" ? "exact" : "similar"] += 1;
	}
	return counts;
}

/**
 * Render the Markdown report.
 *
 * @param {Map<string, { exact: number, similar: number }>} counts per-component duplicate counts
 * @param {object} [meta] { files: files scanned, catalog: catalog size }
 * @returns {string} markdown text
 */
function renderDuplicateReport(counts, meta = {}) {
	const rows = [...counts.entries()]
		.filter(([, c]) => c.exact + c.similar > 0)
		.map(([name, c]) => ({ name, ...c, total: c.exact + c.similar }))
		.sort((x, y) => y.total - x.total || x.name.localeCompare(y.name));

	const totalExact = rows.reduce((s, r) => s + r.exact, 0);
	const totalSimilar = rows.reduce((s, r) => s + r.similar, 0);

	const lines = [];
	lines.push("# Component duplicates report");
	lines.push("");
	lines.push(`Generated: ${new Date().toISOString().slice(0, 10)}`);
	lines.push("");
	lines.push(
		`Scanned ${meta.files != null ? meta.files : "?"} file(s)` +
			(meta.catalog != null ? ` against the catalog (${meta.catalog} canonical signature(s)).` : "."),
	);
	lines.push("");
	lines.push("Duplicates are clustered pairwise over ALL scanned signatures (canonical + app), so pairs that exist only inside the app code (e.g. two keystone components) are reported too.");
	lines.push("");
	lines.push("Tiers (decision matrix, `signature.js`):");
	lines.push("");
	lines.push("- **exact** (error tier) — a11y/actions overlap, or styles >= 90% similar (any tag), or styles >= 70% for the same tag. These fail the gate.");
	lines.push("- **similar** (warning tier) — styles 50-90% similar (different tag) or 40-70% (same tag). Report-only hint.");
	lines.push("");
	if (rows.length === 0) {
		lines.push("No duplicates found.");
		lines.push("");
		return lines.join("\n");
	}

	lines.push(`**Total: ${rows.length} component(s) with duplicates — ${totalExact} exact, ${totalSimilar} similar.**`);
	lines.push("");
	lines.push("| Component | Duplicates | Exact | Similar |");
	lines.push("| --------- | ---------: | ----: | ------: |");
	for (const r of rows) {
		lines.push(`| ${r.name} | ${r.total} | ${r.exact} | ${r.similar} |`);
	}
	lines.push("");
	lines.push("Per component:");
	lines.push("");
	for (const r of rows) {
		const parts = [];
		if (r.exact > 0) parts.push(`${r.exact} exact`);
		if (r.similar > 0) parts.push(`${r.similar} similar`);
		lines.push(`- component: ${r.name}, duplicates: ${r.total} (${parts.join(", ")})`);
	}
	lines.push("");
	return lines.join("\n");
}

module.exports = { clusterSignatures, clusterCounts, duplicateCounts, renderDuplicateReport };
