"use strict";

const TIERS = ["duplicate", "similar"];

const TIER_LABEL = {
	duplicate: "Duplicate (confidence ≥ threshold)",
	similar: "Similar (below duplicate threshold)",
};

const duplicateText = (match) => {
	const d = match.decision;
	return `Component \`${match.app.name}\` duplicates canonical \`${match.canon.name}\` (${match.canon.path}) — ${d.reason}. Use the canonical component instead.`;
};

const rawHtmlText = (tag, suggestion) => {
	return `Raw <${tag}> outside the canonical packages → replace with \`${suggestion.component}\` from ${suggestion.path}.`;
};

const renderHeader = (comp) => {
	const lines = [];
	lines.push("# Component duplicates (component-level funnel)");
	lines.push("");
	lines.push(`Scanned ${comp.files} app file(s), ${comp.appCount} app component(s) against ${comp.canonCount} canonical component(s).`);
	const dupCount = comp.matches.filter((m) => m.decision.tier === "duplicate").length;
	const simCount = comp.matches.filter((m) => m.decision.tier === "similar").length;
	const missingCount = (comp.missingClusters || []).reduce((n, c) => n + c.matches.length, 0);
	lines.push(`Found ${dupCount} duplicate component(s) and ${simCount} similar component(s)${comp.dropped && comp.dropped.length > 0 ? ` (after filtering out ${comp.dropped.length} match(es))` : ""}${missingCount > 0 ? `, plus ${missingCount} component(s) grouped under ${(comp.missingClusters || []).length} potentially missing component(s)` : ""}.`);
	lines.push("");
	return lines;
};

const renderTierSection = (tier, rows, title = TIER_LABEL[tier]) => {
	const lines = [];
	lines.push(`## ${title} (${rows.length})`);
	lines.push("");
	lines.push("| Local component | Location | Duplicates canonical | Canonical location | Confidence | Why |");
	lines.push("| --- | --- | --- | --- | --- | --- |");
	const sorted = [...rows].sort((a, b) => b.decision.confidence - a.decision.confidence || a.canon.name.localeCompare(b.canon.name));
	for (const m of sorted) {
		lines.push(`| ${m.app.name} | \`${m.app.path}:${m.app.line}\` | ${m.canon.name} | \`${m.canon.path}\` | ${m.decision.confidence.toFixed(2)} | ${m.decision.reason} |`);
	}
	lines.push("");
	return lines;
};

const renderMissingSection = (clusters) => {
	if (!clusters || clusters.length === 0) return [];
	const lines = [];
	lines.push(`## Potentially missing component (${clusters.length})`);
	lines.push("");
	lines.push("Several distinct components all matched the same canonical. This usually means the codebase is missing a shared component that would unify them — not that any single one is a duplicate. Consider extracting a new canonical component for each group below.");
	lines.push("");
	for (const cluster of clusters) {
		lines.push(`### ${cluster.name}`);
		lines.push("");
		lines.push(`All ${cluster.matches.length} components below matched canonical \`${cluster.canon.name}\` (\`${cluster.canon.path}\`). They are structurally similar to each other but distinct enough that none is a clean duplicate — a shared \`${cluster.name}\` would likely cover them.`);
		lines.push("");
		lines.push("| Local component | Location | Matched canonical | Confidence | Why |");
		lines.push("| --- | --- | --- | --- | --- |");
		for (const m of cluster.matches) {
			lines.push(`| ${m.app.name} | \`${m.app.path}:${m.app.line}\` | ${m.canon.name} | ${m.decision.confidence.toFixed(2)} | ${m.decision.reason} |`);
		}
		lines.push("");
	}
	return lines;
};

const renderRawHtmlSection = (rows) => {
	if (rows.length === 0) return [];
	const lines = [];
	lines.push(`## Raw HTML outside canonical packages (${rows.length})`);
	lines.push("");
	lines.push("| Element | Location | Replace with | From | Why |");
	lines.push("| --- | --- | --- | --- | --- |");
	const sorted = [...rows].sort((a, b) => a.path.localeCompare(b.path));
	for (const r of sorted) {
		lines.push(`| <${r.tag}> | \`${r.path}:${r.line}\` | \`${r.suggestion.component}\` | ${r.suggestion.path} | ${r.reason} |`);
	}
	lines.push("");
	return lines;
};

const renderPartsSection = (rows, title = "Parts of components that duplicate a canonical") => {
	if (rows.length === 0) return [];
	const lines = [];
	lines.push(`## ${title} (${rows.length})`);
	lines.push("");
	lines.push("| Part | Location | Replace with | From | Why |");
	lines.push("| --- | --- | --- | --- | --- |");
	const sorted = [...rows].sort((a, b) => a.path.localeCompare(b.path) || a.line - b.line);
	for (const r of sorted) {
		lines.push(`| ${r.owner} \u203a <${r.tag}> | \`${r.path}:${r.line}-${r.endLine}\` | \`${r.suggestion.component}\` | ${r.suggestion.path} | ${r.reason} |`);
	}
	lines.push("");
	return lines;
};

const renderFilteredSection = (dropped) => {
	const lines = [];
	const byFilter = new Map();
	for (const d of dropped) {
		if (!byFilter.has(d.filter)) byFilter.set(d.filter, []);
		byFilter.get(d.filter).push(d);
	}
	for (const [filter, rows] of byFilter) {
		lines.push(`## Filtered out by \`${filter}\` (${rows.length})`);
		lines.push("");
		lines.push("| Local component | Location | Canonical | Why dropped |");
		lines.push("| --- | --- | --- | --- |");
		const sorted = [...rows].sort((a, b) => a.match.canon.name.localeCompare(b.match.canon.name));
		for (const d of sorted) {
			lines.push(`| ${d.match.app.name} | \`${d.match.app.path}:${d.match.app.line}\` | ${d.match.canon.name} | ${d.reason} |`);
		}
		lines.push("");
	}
	return lines;
};

const renderComponentReport = (comp, verbose) => {
	const lines = [];
	const folders = comp.layerFolders || [];
	const inLayer = (p) => folders.some((d) => p.startsWith(d));
	const appMatches = comp.matches.filter((m) => !inLayer(m.app.path));
	const layerMatches = comp.matches.filter((m) => inLayer(m.app.path));
	const appParts = (comp.parts || []).filter((r) => !inLayer(r.path));
	const layerParts = (comp.parts || []).filter((r) => inLayer(r.path));
	lines.push(...renderHeader(comp));
	for (const tier of TIERS) {
		const rows = appMatches.filter((m) => m.decision.tier === tier);
		if (rows.length === 0) continue;
		lines.push(...renderTierSection(tier, rows));
	}
	const missingClusters = (comp.missingClusters || []).filter((c) => c.matches.every((m) => !inLayer(m.app.path)));
	lines.push(...renderMissingSection(missingClusters));
	if (comp.rawHtml && comp.rawHtml.length > 0) lines.push(...renderRawHtmlSection(comp.rawHtml));
	lines.push(...renderPartsSection(appParts));
	const layerIdx = (p) => folders.findIndex((d) => p.startsWith(d));
	const layerName = (d) => d.split("/").filter(Boolean).pop();
	for (let li = 0; li < folders.length; li += 1) {
		const seen = folders.slice(0, li).map(layerName);
		const suffix = seen.length > 0 ? ` (vs ${seen.join(" + ")})` : "";
		for (const tier of TIERS) {
			const rows = layerMatches.filter((m) => layerIdx(m.app.path) === li && m.decision.tier === tier);
			if (rows.length === 0) continue;
			lines.push(...renderTierSection(tier, rows, `Inside ${layerName(folders[li])}: ${TIER_LABEL[tier]}${suffix}`));
		}
	}
	lines.push(...renderPartsSection(layerParts, "Inside canonical layers: parts that duplicate a lower layer"));
	if (verbose && comp.dropped && comp.dropped.length > 0) lines.push(...renderFilteredSection(comp.dropped));
	return lines.join("\n");
};

module.exports = {
	renderComponentReport,
	duplicateText,
	rawHtmlText,
	TIERS,
	TIER_LABEL,
};
