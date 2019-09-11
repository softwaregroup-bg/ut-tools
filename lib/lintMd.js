var glob = require('glob');
var markdownlint = require('markdownlint');
var lintOutput = require('./lintOutput');
var fs = require('fs');

module.exports = function(from) {
    let ignore = ['node_modules/**', 'CHANGELOG.md', 'packages/*/node_modules/**'];
    if (fs.existsSync('.mdlintignore')) {
        ignore = ignore.concat(fs.readFileSync('.mdlintignore', 'utf8').split(/\r?\n/g).filter(Boolean));
    }

    var result = markdownlint.sync({
        files: glob.sync(from || '**/*.md', {absolute: true, ignore}),
        config: {
            default: true,
            line_length: {
                tables: false,
                headings: false
            }
        }
    });

    lintOutput('lint-md.xml', Object.keys(result).map(file => ({
        filePath: file,
        messages: result[file].map(msg => ({
            line: msg.lineNumber,
            column: 1,
            fatal: true,
            message: msg.ruleDescription,
            ruleId: msg.ruleNames[1]
        })),
        errorCount: result[file].length,
        warningCount: 0,
        fixableErrorCount: 0,
        fixableWarningCount: 0
    })));

    result = Object.keys(result).length;
};
