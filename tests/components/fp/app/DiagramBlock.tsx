import React from "react";

// A STATIC illustration block (like a page-layout diagram). It deliberately
// mirrors the *layout* of a list row (the same nesting and the same utility
// classes) but is filled with literal placeholder text instead of mapped data.
//
// This is the shape that produces a FALSE POSITIVE: the matched chain is mostly
// a faithful copy (most nodes share tag + styling, so the AVERAGE per-node
// similarity / "quality" is high), but one node — the placeholder <strong> whose
// text is a literal instead of an expression — is only weakly similar. The
// average masks that weak link; the *minimum* per-node similarity exposes it.
// No dynamic content: no .map(), no {expr}, no handlers — only literal text.
const DiagramBlock = () => (
	<div className="mt-4">
		<div className="flex items-center justify-between rounded-md px-3 py-2">
			<div className="min-w-0">
				<div className="text-sm font-semibold">
					<strong>table content</strong>
				</div>
				<span className="truncate text-xs text-gray-500">placeholder note</span>
			</div>
		</div>
	</div>
);

export default DiagramBlock;
