import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {languageOptions: { globals: globals.browser },
   rules:{
  'quotes': ['error', 'single', { 'allowTemplateLiterals': true }],
  'no-multiple-empty-lines': ['error', { 'max': 1, 'maxEOF': 1, 'maxBOF': 0 }],
  'prefer-const': ['off'],
  '@typescript-eslint/no-unused-vars': ['off']
  
}}
];