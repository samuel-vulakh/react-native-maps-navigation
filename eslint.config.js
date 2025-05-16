const { defineConfig, globalIgnores } = require('eslint/config');

const tsParser = require('@typescript-eslint/parser');
const react = require('eslint-plugin-react');
const reactNative = require('eslint-plugin-react-native');
const reactHooks = require('eslint-plugin-react-hooks');
const typescriptEslint = require('@typescript-eslint/eslint-plugin');
const prettier = require('eslint-plugin-prettier');

const { fixupPluginRules } = require('@eslint/compat');

const js = require('@eslint/js');

const { FlatCompat } = require('@eslint/eslintrc');

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

module.exports = defineConfig([
  {
    extends: compat.extends(
      'eslint:recommended',
      'plugin:react/recommended',
      'plugin:react-native/all',
      'plugin:@typescript-eslint/recommended',
      'plugin:prettier/recommended'
    ),

    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2020,
      sourceType: 'module',

      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },

      globals: {
        ...reactNative.environments['react-native']['react-native'],
      },
    },

    plugins: {
      react,
      'react-native': reactNative,
      'react-hooks': fixupPluginRules(reactHooks),
      '@typescript-eslint': typescriptEslint,
      prettier,
    },

    rules: {
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      '@typescript-eslint/explicit-module-boundary-types': 'off',

      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
        },
      ],

      '@typescript-eslint/no-explicit-any': 'warn',
      'react-native/no-unused-styles': 'warn',
      'react-native/split-platform-components': 'warn',
      'react-native/no-inline-styles': 'warn',
      'react-native/no-color-literals': 'warn',
      'react-native/sort-styles': 'warn',
      'prettier/prettier': 'warn',

      'no-console': [
        'warn',
        {
          allow: ['warn', 'error'],
        },
      ],
    },

    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  globalIgnores([
    '**/node_modules/',
    '**/dist/',
    '**/babel.config.js',
    '**/metro.config.js',
    '**/*.config.js',
  ]),
  globalIgnores([
    '**/node_modules/',
    '**/dist/',
    '**/coverage/',
    '**/android/',
    '**/ios/',
    '**/jest.config.js',
    '**/jest.setup.js',
    '**/babel.config.js',
    '**/metro.config.js',
    '**/*.config.js',
  ]),
]);
