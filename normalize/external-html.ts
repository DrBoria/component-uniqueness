"use strict";

// ── EXTERNAL COMPONENTS → the HTML they render ─────────────────────────────
//
// Some components come from packages we cannot unfold statically (next/image,
// lucide-react). They still render REAL HTML, and the snapshot must show that
// HTML, not the wrapper name. This is the one place that knows what a known
// external component becomes:
//
//   next/image, next-image-export-optimizer  → <img>
//   next/link                                 → <a>
//   lucide-react (any icon), LucideIcon       → <svg>
//
// A component not listed here stays as its own tag (we do not invent HTML).

const IMAGE_PACKAGES = new Set(["next/image", "next-image-export-optimizer", "next/legacy/image"]);
const LINK_PACKAGES = new Set(["next/link"]);

// The HTML tag an external module's default/named export renders, or null.
const externalTagOf = (spec, exported) => {
	if (!spec) return null;
	if (IMAGE_PACKAGES.has(spec)) return "img";
	if (LINK_PACKAGES.has(spec)) return "a";
	if (spec === "lucide-react") return "svg";

	return null;
};

// A local wrapper component that is known to render a specific HTML element even
// though its body is dynamic (it picks an icon at runtime). Keyed by component
// name; the value is the tag it renders.
const KNOWN_RENDER = new Map([
	["LucideIcon", "svg"],
]);

const knownRenderTag = (name) => KNOWN_RENDER.get(name) ?? null;

export { externalTagOf, knownRenderTag, IMAGE_PACKAGES, LINK_PACKAGES };