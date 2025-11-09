import pluginVitest from '@vitest/eslint-plugin';
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting';
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript';
import { globalIgnores } from 'eslint/config';
import pluginVue from 'eslint-plugin-vue';
import pluginImport from 'eslint-plugin-import';

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}']
  },

  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,

  // Подключаем плагин import
  {
    plugins: {
      import: pluginImport
    }
  },

  {
    ...pluginVitest.configs.recommended,
    files: ['src/**/__tests__/*']
  },

  {
    files: ['**/*.{ts,mts,tsx,vue}'],
    rules: {
      // Basic formatting rules
      'semi': ['error', 'always'],
      '@typescript-eslint/semi': ['error', 'always'],
      'quotes': ['error', 'double'],
      '@typescript-eslint/quotes': ['error', 'single'],
      'object-curly-spacing': ['error', 'always'],
      '@typescript-eslint/object-curly-spacing': ['error', 'always'],
      'no-trailing-spaces': 'error',
      'arrow-parens': 'error',

      // TypeScript specific
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          fixStyle: 'separate-type-imports',
          disallowTypeAnnotations: false
        }
      ],
      '@typescript-eslint/member-delimiter-style': [
        'error',
        {
          multiline: {
            delimiter: 'semi',
            requireLast: true
          },
          singleline: {
            delimiter: 'semi',
            requireLast: false
          }
        }
      ],
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'enumMember',
          format: ['UPPER_CASE']
        },
        {
          selector: 'typeAlias',
          format: ['PascalCase']
        }
      ],
      '@typescript-eslint/no-empty-interface': 'off',
      '@typescript-eslint/adjacent-overload-signatures': 'error',

      // Padding lines
      'padding-line-between-statements': [
        'error',
        // Перед if
        { blankLine: 'always', prev: '*', next: 'if' },
        // Перед return
        { blankLine: 'always', prev: '*', next: 'return' },
        // После function
        { blankLine: 'always', prev: 'function', next: '*' },
        // Перед function
        { blankLine: 'always', prev: '*', next: 'function' },
        // Между блоками
        { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
        { blankLine: 'any', prev: ['const', 'let', 'var'], next: ['const', 'let', 'var'] },
        // После импортов
        { blankLine: 'always', prev: 'import', next: '*' },
        { blankLine: 'any', prev: 'import', next: 'import' },
        // После экспортов
        { blankLine: 'always', prev: 'export', next: '*' },
        { blankLine: 'any', prev: 'export', next: 'export' }
      ],

      // Import/export rules - ИСПРАВЛЕНО
      'no-duplicate-imports': 'error', // Используем базовое правило ESLint
      'import/newline-after-import': 'error',

      // Code quality rules
      'eqeqeq': 'error',
      'curly': 'error',
      'no-return-await': 'error',
      'no-useless-return': 'error',
      'no-dupe-else-if': 'error',
      'no-duplicate-case': 'error',
      'no-empty': [
        'error',
        {
          allowEmptyCatch: true
        }
      ],
      'no-setter-return': 'error',
      'no-unreachable': 'error',
      'no-unreachable-loop': 'error',
      'valid-typeof': [
        'error',
        {
          requireStringLiterals: true
        }
      ],
      'default-case': 'error',
      'default-case-last': 'error',
      'default-param-last': 'error',
      'no-alert': 'error',
      'prefer-const': 'error',
      'prefer-template': 'error',
      'arrow-body-style': ['error', 'as-needed'],
      'radix': 'error',

      // Console rules
      'no-console': [
        'warn',
        {
          allow: ['error']
        }
      ],

      // Vue-specific adaptations
      'vue/component-name-in-template-casing': ['error', 'PascalCase'],
      'vue/html-self-closing': [
        'error',
        {
          html: {
            void: 'always',
            normal: 'always',
            component: 'always'
          }
        }
      ]
    }
  },

  skipFormatting
);
