import typescript from '@rollup/plugin-typescript';

const plugins = [
  typescript()
];

export default [
  {
    input: 'src/index.ts',
    output: {
      exports: 'default',
      file: './lib/index.cjs',
      format: 'cjs'
    },
    plugins: plugins
  },
  {
    input: 'src/index.ts',
    output: {
      file: './lib/index.mjs',
      format: 'esm'
    },
    plugins: plugins
  }
];
