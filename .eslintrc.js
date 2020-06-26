module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  plugins: ['import'],
  extends: ['airbnb-base', 'plugin:prettier/recommended'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    'no-use-before-define' : 'off',
    'prefer-destructuring' : 'off',
    'prefer-destructuring' : 'off',
    'no-shadow' : 'off',
    'no-plusplus' : 'off',
    'no-return-assign' : 'off',
    'no-param-reassign' : 'off',
    'prefer-spread' : 'off',
    'no-unused-vars' : 'off',
    'prettier/prettier': 'error',
  },
};
