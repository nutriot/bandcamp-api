import typescript from "@rollup/plugin-typescript";

const plugins = [typescript()];

export default [
	{
		input: "src/index.ts",
		output: [
			{
				file: "./lib/index.mjs",
				format: "esm",
			},
			{
				exports: "default",
				file: "./lib/index.cjs",
				format: "cjs"
			}
		],
		plugins: plugins,
	},
];
