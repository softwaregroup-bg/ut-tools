/* eslint no-process-env:0 */

var CLIEngine = require('eslint').CLIEngine;
var lintOutput = require('./lintOutput');

module.exports = function() {
    var fix = process.argv.find(s => s === '--fix');
    var cli = new CLIEngine({
        configFile: require.resolve('../eslint/commit.eslintrc'),
        ignorePattern: [
            '**/.git/**',
            '**/.history/**',
            'coverage/**',
            '**/*.marko.js',
            '**/node_modules/**',
            'public/**',
            'dist/**'
        ],
        fix
    });
    cli.addPlugin('ut-lint', require('./rules'));

    var files = process.argv.slice(2).filter(v => !v.startsWith('-'));
    if (!files.length) files.push('.');
    files = files.map(v => v !== '.' ? v : (process.env.PWD || v));
    var report = cli.executeOnFiles(files);

    lintOutput('lint.xml', report.results);

    fix && CLIEngine.outputFixes(report);

    return report.errorCount;
};
