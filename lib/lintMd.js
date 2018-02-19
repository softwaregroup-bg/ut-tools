var glob = require('glob');
var markdownlint = require('markdownlint');
var lintOutput = require('./lintOutput');

module.exports = function(from) {
    var result = markdownlint.sync({
        files: glob.sync(from || '**/*.md', {absolute: true, ignore: ['node_modules/**', 'CHANGELOG.md']}),
        config: {
            default: true
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
