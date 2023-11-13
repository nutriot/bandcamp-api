import { defineConfig } from 'tsup';

export default defineConfig({
	target: 'esnext',
  clean: true,
  dts: true,
  entry: [
		'src/index.ts'
	],
  format: ['esm', 'cjs'],
  minify: true,
	outDir: 'lib',
  treeshake: 'recommended'
});
