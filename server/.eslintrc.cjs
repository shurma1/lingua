// Legacy config for WebStorm compatibility
// Primary config is in eslint.config.mjs
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
    ecmaVersion: 2024
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  env: {
    node: true,
    es2024: true
  },
  rules: {
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
    '@typescript-eslint/no-misused-promises': ['error', { checksVoidReturn: false }],
    '@typescript-eslint/no-empty-object-type': ['error', { allowInterfaces: 'always' }],
    '@typescript-eslint/no-explicit-any': ['error', { fixToUnknown: false, ignoreRestArgs: true }],
    'no-console': ['error', { allow: ['info', 'warn', 'error'] }],
    'no-undef': 'off',
    'indent': ['error', 'tab']
  },
  ignorePatterns: [
    'dist',
    'node_modules',
    '*.config.js',
    '*.config.mjs',
    '*.config.cjs'
  ]
};
