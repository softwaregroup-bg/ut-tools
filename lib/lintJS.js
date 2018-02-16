/* eslint no-process-env:0, no-process-exit:0, no-console:0 */
var path = require('path');
var fs = require('fs');

module.exports = function() {
    var CLIEngine = require('eslint').CLIEngine;
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

    var modulePath = process.argv.slice(2)[0] && process.argv.slice(2)[0] === '.' && process.env.PWD ? process.env.PWD : process.argv.slice(2);
    var report = cli.executeOnFiles(modulePath);
    if (typeof process.env.BUILD_NUMBER !== 'undefined') {
        const output = cli.getFormatter('checkstyle')(report.results);
        const outputFile = 'lint.xml';
        const filePath = path.resolve(process.cwd(), outputFile);

        if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
            console.error(`Cannot write to output file path, it is a directory: ${outputFile}`);
            return true;
        }

        try {
            fs.writeFileSync(filePath, output);
        } catch (ex) {
            console.error(`There was a problem writing the output file:\n${ex}`);
            return true;
        }
    } else {
        console.error(cli.getFormatter()(report.results));
    }

    return report.errorCount;
};
