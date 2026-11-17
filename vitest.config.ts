import fs from "node:fs";
import path from "node:path";
import { defineConfig } from "vitest/config";

// The overview SPA (report/user-report/src) uses extensionless imports that
// esbuild resolves; vitest needs the same hint to load those modules in tests.
const extensionless = {
	name: "extensionless-imports",
	resolveId(source: string, importer: string | undefined) {
		if (!importer || !source.startsWith(".")) return null;
		const base = path.resolve(path.dirname(importer), source);
		for (const suffix of [".ts", ".tsx", "/index.ts", "/index.tsx"]) {
			const candidate = base + suffix;
			if (fs.existsSync(candidate)) return candidate;
		}
		return null;
	},
};

export default defineConfig({
	plugins: [extensionless],
	test: {
		include: ["tests/**/*.test.ts"],
		testTimeout: 120000,
		hookTimeout: 120000,
	},
});
