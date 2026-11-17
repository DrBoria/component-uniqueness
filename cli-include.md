# Component duplicates (component-level funnel)

Scanned 1 app file(s), 1 app component(s) against 29 canonical component(s).

Found 1 duplicate component(s) and 0 similar component(s).

## High-confidence duplicates (confidence ≥ duplicate threshold) (1)

| Id | Local component | Location | Canonical | Canonical location | Confidence | Top signal | Fix |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `duplicate:tests/components/duplicates/FullBadgeDup.tsx#FullBadgeDup=>tests/components/lib/Badge.tsx#Badge` | FullBadgeDup | `tests/components/duplicates/FullBadgeDup.tsx:3` | Badge | `tests/components/lib/Badge.tsx:3` | 0.48 | Structure | Replace `FullBadgeDup` with `Badge` from `tests/components/lib/Badge.tsx` — they are the same component. |

### Why each one matched

- **FullBadgeDup** — `FullBadgeDup` duplicates canonical `Badge` — 0.48 (49%) confidence. Use the canonical component instead.
  scores  Structure 100%  ·  Styles 33%  ·  Behavior 0%  ·  Accessibility 0%  ·  Framework 0%  ·  Name 35%
  Structure  100%  structure (tree)
    chain 1/1  ·  quality 100%  ·  CSS agreement 100%
    matched nodes  span
  Styles  33%  styles (1/1 properties agree across 1 node pair(s))
    span  font-size: var(--text-xs)
  Name  35%  FullBadgeDup ↔ Badge
    match  fuzzy-name  ·  word overlap 0%
  **Fix** — Replace `FullBadgeDup` with `Badge` from `tests/components/lib/Badge.tsx` — they are the same component.
