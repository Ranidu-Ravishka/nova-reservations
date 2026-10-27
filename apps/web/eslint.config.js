import { nextJsConfig } from "@repo/eslint-config/next-js";

/** @type {import("eslint").Linter.Config[]} */
export default [
	...nextJsConfig,
	{
		files: ["postcss.config.cjs"],
		languageOptions: {
			globals: {
				module: "readonly",
			},
		},
	},
];
