"use strict";

const { keys, reduce } = require("remeda");

const { stylesSimilarity, specificA11yToken, MIN_SHARED_STYLE_KEYS } = require("./signature");

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

const sharesDistinctiveKey = (a, b) => {
	const ak = keys(a || {});
	const other = new Set(keys(b || {}));
	return ak.some((k) => !GENERIC_STYLE_KEYS.has(k) && other.has(k));
}

const clusterSignatures = (allSigs) => {
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

	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	const styleKeys = allSigs.map((s) => keys(s.styles || {}));

	for (let i = 0; i < n; i += 1) {
		const si = allSigs[i];
		for (let j = i + 1; j < n; j += 1) {
			const sj = allSigs[j];
			const sameFile = si.path === sj.path;
			
			
			
			
			
			
			if (!sameFile) {
				
				
				
				
				const ai = new Set((si.a11y || []).filter(specificA11yToken));
				if ((sj.a11y || []).some((t) => specificA11yToken(t) && ai.has(t))) {
					union(i, j);
					continue;
				}
			}
			
			const ki = styleKeys[i];
			const kj = new Set(styleKeys[j]);
			const shared = ki.length ? ki.filter((k) => kj.has(k)).length : 0;
			if (shared < MIN_SHARED_STYLE_KEYS) continue;
			
			
			if (!sharesDistinctiveKey(si.styles, sj.styles)) continue;
			const sim = stylesSimilarity(si.styles, sj.styles);
			const sameTag = si.tag === sj.tag;
			if ((sameTag && sim >= 0.7) || (!sameTag && sim >= 0.9)) union(i, j);
		}
	}

	
	const groups = new Map();
	for (let i = 0; i < n; i += 1) {
		const r = find(i);
		if (!groups.has(r)) groups.set(r, []);
		groups.get(r).push(i);
	}

	
	
	
	
	const clusters = new Map();
	for (const [root, idxs] of groups) {
		if (idxs.length < 2) continue;
		const exact = idxs.length;
		const similar = 0;
		
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

const clusterCounts = (clusters) => {
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

const duplicateCounts = (appSigs, catalog) => {
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

const renderDuplicateReport = (counts, meta = {}) => {
	const rows = [...counts.entries()]
		.filter(([, c]) => c.exact + c.similar > 0)
		.map(([name, c]) => ({ name, ...c, total: c.exact + c.similar }))
		.sort((x, y) => y.total - x.total || x.name.localeCompare(y.name));

	const totalExact = reduce(rows, (s, r) => s + r.exact, 0);
	const totalSimilar = reduce(rows, (s, r) => s + r.similar, 0);

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
