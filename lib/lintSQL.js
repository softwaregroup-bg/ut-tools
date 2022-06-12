const glob = require('glob');
const fs = require('fs');
const parse = require('ut-tsql-lexer');
const lintOutput = require('./lintOutput');

module.exports = async function(from) {
    let ignore = ['**/postgre*/**', 'node_modules/**'];
    if (fs.existsSync('.sqllintignore')) {
        ignore = ignore.concat(fs.readFileSync('.sqllintignore', 'utf8').split(/\r?\n/g).filter(Boolean));
    }

    const files = glob.sync(from || '**/*.sql', {absolute: true, ignore});
    const errors = [];
    let result = false;
    files.forEach(function(file) {
        const source = fs.readFileSync(file).toString();
        try {
            const parsed = parse.parse(source);
            if (parsed.lint.length) {
                const messages = [];
                result = true;
                parsed.lint.forEach(function(item) {
                    messages.push({
                        line: item.endLine,
                        column: item.endColumn,
                        fatal: true,
                        message: item.message,
                        ruleId: item.code
                    });
                });
                errors.push({
                    filePath: file,
                    messages,
                    errorCount: messages.length,
                    warningCount: 0,
                    fixableErrorCount: 0,
                    fixableWarningCount: 0
                });
            }
        } catch (e) {
            result = true;
            errors.push({
                filePath: file,
                messages: [{
                    line: e.location.start.line,
                    column: e.location.start.column,
                    fatal: true,
                    message: e.message
                }],
                errorCount: 1,
                warningCount: 0,
                fixableErrorCount: 0,
                fixableWarningCount: 0
            });
        }
    });

    await lintOutput('lint-sql.xml', errors);

    return result;
};
