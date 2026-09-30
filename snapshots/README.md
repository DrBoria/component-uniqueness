# snapshots/ — dynamic component catalog (headless-browser pipeline)

Static AST scanning cannot see styles/actions of **library wrappers**
(`<MuiButton>`, `<AntButton>`, `styled.button`, tailwind classes inside a
wrapper). This pipeline renders every component once in a headless browser
and captures what the DOM actually shows:

- rendered DOM tag (`MuiButton` → `button`, `Bn` → `button`, `MuiPaper` → `div`)
- computed styles (normalized: padding/margin shorthand, defaults filtered)
- click behavior (fiber `__reactProps$` walk — React delegates listeners to
  the root, so `getEventListeners` is unusable)
- a11y attributes (`type`, `role`, `aria-label`, `data-testid`, `tabindex`)

## Usage

```sh
node <pkg>/snapshots/run.mjs --root <repoRoot> --manifest <repo>/playground/manifest.js
```

1. `build-playground.mjs` — esbuild bundle of the manifest → `dist/playground.html` + `dist/playground.js` (one page, every component rendered exactly once, `data-slot` per component, `data-snapshot-ready` flag after click-marker instrumentation).
2. `snapshot.mjs` — puppeteer-core + chromium opens the page via **file:// (no HTTP server)**, waits for `data-snapshot-ready="1"`, captures per slot, writes `reports/component-catalog-dynamic.json`.

Confined browsers (snap chromium) cannot read `/tmp` or hidden dirs — the page
is copied to `~/rqu-snapshot-dist/` automatically (override with `SNAPSHOT_URL`
by passing a `--url` that the browser can already read).

## Manifest format

CommonJS module exporting an array:

```js
module.exports = [
  { id: "can-button", label: "Button (canonical)",
    import: ["/abs/path/Button.tsx", "Button"],
    jsxTag: "Button",        // the JSX tag the consumer writes (dynTagMap key)
    props: { onClick: () => {}, children: "press" } },
];
```

`jsxTag` matters for renamed imports: `import { Button as Bn }` →
`jsxTag: "Bn"`. The rule resolves `Bn` → rendered `button` at lint time.

## Rule side

```js
rules: { "md/component-uniqueness": ["error", { includeDynamic: true }] }
```

`includeDynamic` (default `false`) merges the dynamic catalog into the static
one:

- entries are deduped by `path` — a file already in the static catalog keeps
  its static entry; dynamic only ADDS files the static pass could not fully see
- the rule resolves capitalized JSX tags (import aliases) to real DOM tags via
  the `comp` field
- **only tag + styles are merged** (and styles only into thin candidates,
  <3 style keys); actions/a11y are deliberately NOT merged — a plain
  `<MuiButton>` without onClick must stay a plain import, not a "duplicate"
- without the dynamic catalog file the flag is a no-op (static behavior)

## Env

| Var | Default |
| --- | --- |
| `SNAPSHOT_CHROME` | `/snap/bin/chromium` → `/usr/bin/chromium` → `google-chrome` |
| `SNAPSHOT_PUPPETEER` | consumer `node_modules/puppeteer-core`, else known hoisted paths |
| `ESBUILD_PATH` | consumer `node_modules/esbuild` |

`puppeteer-core` is an **optional** dependency — the static rule works without it.
