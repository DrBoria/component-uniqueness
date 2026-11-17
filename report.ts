"use strict";

// Kept so `require("./report")` keeps working after the markdown report moved
// into `report/cli-report.js`. The engine is the one in `report/` — the SAME
// renderer the HTML page uses, so the terminal carries every tab the page draws
// (verdict tiers with each matcher's own lines, missing components, raw HTML,
// copied parts, filtered-out), with locations, like utils.

export * from "./report/cli-report";
export { TIER_ORDER } from "./constants";
