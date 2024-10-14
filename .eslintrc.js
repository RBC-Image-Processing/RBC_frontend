module.exports = {
    extends: [
      'eslint:recommended',
      'plugin:react/recommended',
      'plugin:@typescript-eslint/recommended',
      'prettier',
    ],
    parser: '@typescript-eslint/parser',
    plugins: ['react', 'react-hooks', '@typescript-eslint'],
    rules: {
      // Add any custom rules here
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  };