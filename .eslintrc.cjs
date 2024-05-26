/* eslint-disable */
module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint', 'unicorn'],
	extends: ['eslint:recommended', 'plugin:jsonc/recommended-with-json', 'plugin:@typescript-eslint/recommended'],
	globals: {
		Deno: 'readonly',
	},
	rules: {
		'@typescript-eslint/ban-ts-comment': 'off',
		'@typescript-eslint/no-explicit-any': 'off',
		'unicorn/filename-case': 'error',
		'unicorn/new-for-builtins': 'error',
		'unicorn/prefer-node-protocol': 'error',
	},
	overrides: [
		{
			files: ['tsconfig.json'],
			rules: {
				'jsonc/no-comments': 'off'
			}
		},
	],
};
