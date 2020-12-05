module.exports = {
  extends: [
    'react-app',
    'prettier',
    'plugin:react/recommended',
    'plugin:import/typescript',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:prettier/recommended',
    'prettier/react',
  ],
  plugins: ['react', 'prettier', 'import', 'simple-import-sort'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      modules: true,
    },
  },
  rules: {
    'no-duplicate-imports': 'error',
    'sort-imports': 'off',
    'import/order': 'off',
    'import/first': 'error',
    'import/newline-after-import': 'error',
    'import/no-duplicates': 'error',
    'simple-import-sort/exports': 'error',
    'simple-import-sort/imports': [
      'error',
      {
        groups: [
          // Packages. `react` related packages come first.
          ['^react', '^\\w', '^@?\\w'],
          // Internal packages.
          [
            '^@/.*|$',
            '^@interfaces/.*|$',
            '^@constants/.*|$',
            '^@resources/.*|$',
            '^@utils/.*|$',
            '^@services/.*|$',
            '^@apis/.*|$',
            '^@data/.*|$',
            '^@hooks/.*|$',
            '^@pages/.*|$',
            '^@components/.*|$',
            '^@styles/.*|$',
          ],
          // Parent imports. Put `..` last.
          ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
          // Other relative imports. Put same-folder imports and `.` last.
          ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
          // Style imports.
          ['^.+\\.s?css$'],
          // Side effect imports.
          ['^\\u0000'],
        ],
      },
    ],
    'prettier/prettier': [
      'warn',
      {
        arrowParens: 'always',
        bracketSpacing: true,
        semi: false,
        trailingComma: 'all',
        endOfLine: 'lf',
        tabWidth: 2,
        singleQuote: true,
        printWidth: 80,
        useTabs: false,
      },
    ],
    'no-console': 'warn',
    'react/prop-types': 0,
    'newline-before-return': 1,
    'no-useless-return': 1,
    'prefer-const': 1,
    'no-unused-vars': 0,
  },
  settings: {
    'import/resolver': {
      typescript: {},
      // alias: {
      //   map: [
      //     ['@', './src'],
      //     ['@utils', './src/client/utils'],
      //     ['@resources', './src/resources'],
      //   ],
      //   extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
      // },
    },
    react: {
      version: 'detect',
    },
  },
}
