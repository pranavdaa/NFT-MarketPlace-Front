module.exports = {
  root: true,
  parser: 'vue-eslint-parser',
  extends: [
    'eslint:recommended',
    // 'plugin:prettier/recommended',
    // "prettier",
    'standard',
    'plugin:vue/recommended',
  ],
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module',
    allowImportExportEverywhere: false,
    ecmaFeatures: {
      legacyDecorators: true,
    },
  },
  plugins: ['vue', 'unicorn', 'html'],

  // add your custom rules here
  rules: {
    indent: [
      'error',
      2,
      {
        SwitchCase: 1,
        MemberExpression: 1,
        ArrayExpression: 1,
      },
    ],
    'space-before-function-paren': ['error', 'never'],
    'no-console': ['off'],
    'no-undef': ['off'],
    'comma-dangle': ['error', 'always-multiline'],
    quotes: [
      'error',
      'single',
      { avoidEscape: true, allowTemplateLiterals: true },
    ],
    camelcase: ['error', { properties: 'always' }],
    'unicorn/filename-case': ['error', { case: 'kebabCase' }],
    'vue/component-name-in-template-casing': [
      'error',
      'kebab-case',
      {
        ignores: [],
      },
    ],
    'brace-style': ['error', '1tbs'],
    curly: ['error', 'all'],
    'vue/attribute-hyphenation': 'off',
  },
  globals: {
    Promise: true,
  },
}
