"use strict";

import { KIND, SIDE, TIER } from "../../../constants";

// Grouping components BY SIMILARITY. A group is a CONNECTED COMPONENT of the
// pair graph: every component reachable from another through a duplicate/similar
// pair belongs to the same group. Members carry the per-pair numbers so the
// group row can show the strongest and weakest link.

const placeKey = (place) => `${place?.path ?? ""}#${place?.name ?? ""}`;

const memberOf = (place, finding) => ({
	findingId: finding.id,
	name: place?.name ?? "—",
	path: place?.path ?? null,
	line: place?.line ?? null,
	confidence: finding.confidence,
	tier: finding.tier,
	side: place?.side ?? SIDE.App,
});

const buildGroups = (findings) => {
	const parent = new Map();
	const find = (x) => {
		if (!parent.has(x)) parent.set(x, x);
		let root = x;
		while (parent.get(root) !== root) root = parent.get(root);
		let cur = x;
		while (parent.get(cur) !== root) {
			const next = parent.get(cur);
			parent.set(cur, root);
			cur = next;
		}

		return root;
	};
	const union = (a, b) => {
		const ra = find(a);
		const rb = find(b);
		if (ra !== rb) parent.set(ra, rb);
	};

	const pairs = findings.filter((f) => f.kind === KIND.Duplicate || f.kind === KIND.Similar);
	for (const f of pairs) union(placeKey(f.left), placeKey(f.right));

	const components = new Map();
	for (const f of pairs) {
		const root = find(placeKey(f.left));
		if (!components.has(root)) components.set(root, { members: new Map(), findingIds: [] });
		const comp = components.get(root);
		comp.findingIds.push(f.id);
		for (const place of [f.left, f.right]) {
			const key = placeKey(place);
			if (!comp.members.has(key)) comp.members.set(key, memberOf(place, f));
		}
	}

	const groups = [...components.entries()].map(([root, comp]) => {
		const members = [...comp.members.values()];
		const confidences = members.map((m) => m.confidence).filter((c) => Number.isFinite(c));
		const name = members.map((m) => m.name).sort()[0] ?? "—";

		return {
			id: `group:${root}`,
			kind: KIND.Missing,
			name,
			canonical: null,
			members,
			findingIds: comp.findingIds,
			count: members.length,
			maxConfidence: confidences.length ? Math.max(...confidences) : null,
			minConfidence: confidences.length ? Math.min(...confidences) : null,
			duplicates: members.filter((m) => m.tier === TIER.Duplicate).length,
		};
	});

	return groups.filter((g) => g.count >= 2).sort((a, b) => (b.maxConfidence ?? 0) - (a.maxConfidence ?? 0) || b.count - a.count || a.name.localeCompare(b.name));
};

export {  buildGroups  };