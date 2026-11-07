import { createRequire } from "node:module";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const require = createRequire(import.meta.url);
const { parseComponents } = require("../playgrounds/react.js");

// A component that renders an imported one is UNFOLDED: the parser resolves the
// import to a file and inlines its tree, marking the node with `via`. Resolution
// is TypeScript's, so a `paths` alias has to be resolved through the project's
// own config — otherwise the same JSX is a leaf `<Button/>` and two components
// that differ only inside the child look identical.
let root: string;

const writeTree = () => {
	fs.mkdirSync(path.join(root, "src", "ui"), { recursive: true });
	fs.writeFileSync(
		path.join(root, "tsconfig.json"),
		JSON.stringify({ compilerOptions: { jsx: "react-jsx", baseUrl: ".", paths: { "@ui/*": ["src/ui/*"] } } }, null, 2),
		"utf8",
	);
	fs.writeFileSync(
		path.join(root, "src", "ui", "button.tsx"),
		'export function Button(props: { label: string }) {\n\treturn <button>{props.label}</button>;\n}\n',
		"utf8",
	);
	fs.writeFileSync(
		path.join(root, "src", "card.tsx"),
		'import { Button } from "@ui/button";\n\nexport function Card() {\n\treturn <div><Button label="ok" /></div>;\n}\n',
		"utf8",
	);
};

beforeAll(() => {
	root = fs.mkdtempSync(path.join(os.tmpdir(), "cu-aliases-"));
	writeTree();
});

afterAll(() => {
	fs.rmSync(root, { recursive: true, force: true });
});

const viaOf = (tree: unknown, out: string[] = []): string[] => {
	if (!tree || typeof tree !== "object") return out;
	const node = tree as { via?: string[]; children?: unknown[] };
	if (Array.isArray(node.via)) out.push(...node.via);
	for (const child of node.children ?? []) viaOf(child, out);
	return out;
};

describe("tsconfig aliases", () => {
	it("an imported component is unfolded through the alias", () => {
		const [card] = parseComponents(path.join(root, "src", "card.tsx"), new Set(), { root });
		expect(viaOf(card?.tree)).toContain("Button");
	});

	it("takes the config path explicitly when the project keeps it elsewhere", () => {
		const explicit = path.join(root, "tsconfig.app.json");
		fs.copyFileSync(path.join(root, "tsconfig.json"), explicit);
		fs.rmSync(path.join(root, "tsconfig.json"));
		try {
			const [card] = parseComponents(path.join(root, "src", "card.tsx"), new Set(), { root, tsconfig: "tsconfig.app.json" });
			expect(viaOf(card?.tree)).toContain("Button");
		} finally {
			fs.copyFileSync(explicit, path.join(root, "tsconfig.json"));
			fs.rmSync(explicit);
		}
	});
});
