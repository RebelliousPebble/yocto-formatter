module.exports = {
    parser: '@typescript-eslint/parser',
    extends: [
        'eslint:recommended',
    ],
    plugins: [
        '@typescript-eslint',
    ],
    env: {
        node: true,
        es6: true,
        mocha: true
    },
    rules: {
        '@typescript-eslint/no-unused-vars': 'error',
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
};