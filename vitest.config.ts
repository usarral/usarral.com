import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
	resolve: {
		alias: {
			"@": path.resolve("./src"),
			"astro:content": path.resolve("./src/test/__mocks__/astro-content.ts"),
		},
	},
	test: {
		include: ["src/test/unit/**/*.test.ts"],
		environment: "node",
	},
});
