const devWarnProdError = process.env.NODE_ENV === 'production' ? 'error' : 'warn';

module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
    node: true
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 9
  },
  plugins: [
    '@typescript-eslint',
    'sonarjs'
  ],
  extends: [
    'eslint:recommended',
    'plugin:sonarjs/recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  // add your custom rules here
  rules: {
    // 调试
    'no-console': [
      devWarnProdError,
      { 'allow': ['info', 'warn', 'error', 'time', 'timeEnd'] }
    ],
    'no-debugger': devWarnProdError,

    // 基本
    'semi': ['error', 'always'],
    'indent': 'off',
    'brace-style': ['error', '1tbs', {
      'allowSingleLine': true
    }],
    'quotes': ['error', 'single'],

    // 变量
    'new-cap': 'error',
    'camelcase': 'error',
    'no-use-before-define': 0,
    'no-unused-vars': 0,

    // 空白与换行
    'semi-spacing': 'error',
    'array-bracket-spacing': ['error', 'never'],
    'block-spacing': ['error', 'always'],
    'computed-property-spacing': 'error',
    'comma-spacing': 0,
    'func-call-spacing': 'error',
    'key-spacing': 'error',
    'keyword-spacing': 'error',
    'no-trailing-spaces': 'error',
    'no-whitespace-before-property': 'error',
    'space-before-blocks': 'error',
    'space-before-function-paren': ['error', {
      anonymous: 'never',
      named: 'never',
      asyncArrow: 'always'
    }],
    'space-in-parens': 'error',
    'space-infix-ops': 'error',
    'space-unary-ops': 'error',
    'spaced-comment': ['error', 'always', {
      'block': {
        'markers': ['!'],
        'balanced': true
      }
    }],
    'object-curly-spacing': ['error', 'always'],
    'object-property-newline': ['error', {
      allowAllPropertiesOnSameLine: true
    }],
    'operator-linebreak': ['error', 'after'],
    'eol-last': ['error', 'always'],
    'padded-blocks': 0,

    // 逗号
    'comma-dangle': ['error', 'only-multiline'],
    'comma-style': 'error',

    // 其他
    'no-extra-bind': 'error',
    'no-extra-label': 'error',
    'no-floating-decimal': 'error',
    'no-implied-eval': 'error',
    'no-iterator': 'error',
    'no-loop-func': 'error',
    'no-multi-spaces': 'error',
    'no-proto': 'error',
    'no-script-url': 'error',
    'no-throw-literal': 'error',
    'no-useless-call': 'error',
    'no-with': 'error',
    'no-constant-condition': devWarnProdError,
    'no-cond-assign': ['error', 'except-parens'],
    'no-empty': [devWarnProdError, {
      'allowEmptyCatch': true
    }],
    'no-lonely-if': 0,
    'curly': ['error', 'multi-line'],
    'wrap-iife': ['error', 'inside'],

    // ES6
    'no-var': 'error',
    'prefer-const': 'error',
    'no-duplicate-imports': 'off',
    'prefer-promise-reject-errors': 'error',
    'template-curly-spacing': ['error', 'never'],
    'no-template-curly-in-string': 0,
    'arrow-spacing': 'error',
    'no-confusing-arrow': 'error',
    'import/order': 0,
    'unicorn/prefer-includes': 0,

    // Sonarjs
    'sonarjs/cognitive-complexity': ['error', 18],
    'sonarjs/no-duplicate-string': ['error', 5],
    'sonarjs/no-collection-size-mischeck': 0,
    'sonarjs/no-identical-functions': [devWarnProdError],

    // TypeScript
    '@typescript-eslint/semi': ['error', 'always'],
    '@typescript-eslint/indent': ['error', 2, {
      'SwitchCase': 1
    }],
    '@typescript-eslint/comma-spacing': ['error'],
    '@typescript-eslint/no-duplicate-imports': ['error'],
    '@typescript-eslint/type-annotation-spacing': ['error', {
      after: true,
      before: false,
      overrides: {
        arrow: {
          before: true,
          after: true
        }
      }
    }],
    '@typescript-eslint/no-var-requires': 0,
    '@typescript-eslint/no-unused-vars': [devWarnProdError, {
      vars: 'all',
      args: 'after-used'
    }],
    '@typescript-eslint/no-use-before-define': ['error', {
      'functions': false,
      'classes': false,
      'variables': true
    }]
  }
};
