const glob = require('glob');
const markdownlint = require('markdownlint');
const lintOutput = require('./lintOutput');
const fs = require('fs');

module.exports = async function(from) {
    let ignore = ['node_modules/**', '*CHANGELOG.md', 'packages/*/node_modules/**', 'packages/*/*CHANGELOG.md'];
    if (fs.existsSync('.mdlintignore')) {
        ignore = ignore.concat(fs.readFileSync('.mdlintignore', 'utf8').split(/\r?\n/g).filter(Boolean));
    }
    if (fs.existsSync('.gitignore')) {
        ignore = ignore.concat(fs.readFileSync('.gitignore', 'utf8').split(/\r?\n/g).filter(Boolean));
    }

    let result = markdownlint.sync({
        files: glob.sync(from || '**/*.md', {absolute: true, ignore}),
        config: {
            default: true,
            line_length: {
                tables: false,
                headings: false
            }
        }
    });

    await lintOutput('lint-md.xml', Object.keys(result).map(file => ({
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
