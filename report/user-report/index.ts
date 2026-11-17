"use strict";

// Public entry for the interactive overview (`--overview`).
//
//   const { collectOverviewData, writeOverview } = require("./report/user-report");
//   const written = writeOverview(collectOverviewData({ comp, repoRoot, config, candidates }), "reports/component-overview.html");
//
// The payload is plain JSON; the presentation is the React app in ./src,
// compiled on demand by ./build/bundle.js and inlined by ./html/shell.js.

import * as path from "node:path";
import * as fs from "node:fs";

import { collectOverviewData } from "./data/collect";
import { renderHtml } from "./html/shell";

const renderOverview = (data) => renderHtml(data);

const writeOverview = (data, outPath) => {
	const abs = path.resolve(outPath);
	fs.mkdirSync(path.dirname(abs), { recursive: true });
	fs.writeFileSync(abs, renderOverview(data), "utf8");

	return { path: abs, bytes: fs.statSync(abs).size };
};

export {  collectOverviewData, renderOverview, writeOverview  };