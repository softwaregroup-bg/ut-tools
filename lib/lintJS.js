/* eslint no-process-env:0 */

var CLIEngine = require('eslint').CLIEngine;
var lintOutput = require('./lintOutput');

module.exports = function() {
    var cli = new CLIEngine({
        configFile: require.resolve('../eslint/commit.eslintrc'),
        ignorePattern: [
            'coverage/**',
            '**/*.marko.js',
            '**/node_modules/**',
            'public/**',
            'dist/**'
        ]
    });
    cli.addPlugin('ut-lint', require('./rules'));

    var modulePath = process.argv.slice(2)[0] && process.argv.slice(2)[0] === '.' && process.env.PWD ? [process.env.PWD] : process.argv.slice(2);
    var report = cli.executeOnFiles(modulePath);

    lintOutput('lint.xml', report.results);

    return report.errorCount;
};
