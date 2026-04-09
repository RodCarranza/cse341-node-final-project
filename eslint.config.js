const js = require('@eslint/js');
const globals = require('globals');

module.exports = [
  js.configs.recommended,
  {
    files: ['**/*.js'],
    ignores: ['node_modules/**'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
      globals: {
        ...globals.node
      }
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-undef': 'error',
      'no-console': 'off'
    }
  },
  {
    files: ['**/*.test.js', 'tests/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.jest,
        ...globals.node
      }
    }
  }
];