// @ts-check
import eslint from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      ecmaVersion: 5,
      sourceType: 'module',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      'typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'no-useless-constructor': 'off',
      'no-new': 'off',
      'semi': [
        'error',
        'never'
      ],
      'prettier/prettier': ['error', {
        'endOfLine': 'auto',
        'printWidth': 80,
        'tabWidth': 2,
        'singleQuote': true,
        'trailingComma': 'all',
        'arrowParens': 'always',
        'semi': false
      }]
    },
  },
);