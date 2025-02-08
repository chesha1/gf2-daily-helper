import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
  ...tseslint.config(
    eslint.configs.recommended,
    tseslint.configs.recommended,
    tseslint.configs.stylistic,
  ),
  {
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      'quotes': ['error', 'single', { 'allowTemplateLiterals': true }],
      'no-multiple-empty-lines': ['error', { 'max': 1, 'maxEOF': 1, 'maxBOF': 0 }],
      'prefer-const': ['off'],
    },
  },
  // do not use Stylistic, as it conflicts with typescript-eslint
  // especially with the indent rules
  // see also: https://github.com/typescript-eslint/typescript-eslint/issues/1824
  // see also: https://typescript-eslint.io/users/what-about-formatting/
];