const { defineConfig } = require('@vscode/test-cli');

module.exports = defineConfig({
    files: 'out/test/**/*.test.js',
    version: '1.102.0',
    launchArgs: [
        '--disable-extensions',
        '--disable-workspace-trust'
    ],
    mocha: {
        timeout: 10000
    }
});