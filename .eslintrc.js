module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    sourceType: 'module',
    tsconfigRootDir: __dirname,
  },
  extends: ['plugin:n8n-nodes-base/nodes'],
  rules: {
    'n8n-nodes-base/node-dirname-against-convention': 'off',
  },
};