import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    name: 'project:ts',
    files: ['src/**/*.ts'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
        sourceType: 'module'
      },
      globals: {
        ...globals.node,
        ...globals.es2024
      }
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
      '@typescript-eslint/no-misused-promises': ['error', { checksVoidReturn: false }],
      '@typescript-eslint/no-empty-object-type': ['error', { allowInterfaces: 'always' }],
      '@typescript-eslint/no-explicit-any': ['error', { fixToUnknown: false, ignoreRestArgs: true }],
      'no-console': ['error', { allow: ['info', 'warn', 'error'] }],
      'no-undef': 'off', // handled by TS
      'indent': ['error', 'tab']
    }
  },
  {
    name: 'project:ignore',
    ignores: [
      'dist',
      'node_modules',
      '*.config.js',
      '*.config.mjs'
    ]
  }
];
