import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
  {
    languageOptions: {
      globals: {
        ...globals.browser, // Browser globals
        ...globals.node, // Node.js globals (includes `process`)
        React: 'readonly',
      },
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    rules: {
      'no-unused-vars': 'error',
      'no-undef': 'error',
      'react/react-in-jsx-scope': 'off',
    },
  },
  {
    ignores: [
      'node_modules/**', // Ignore node_modules
      'dist/**', // Ignore build/dist directories
      '.next/**', // Ignore Next.js build files
    ],
  },
];
