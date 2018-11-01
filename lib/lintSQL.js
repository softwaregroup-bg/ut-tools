var glob = require('glob');
var fs = require('fs');
var parse = require('ut-tsql-lexer');
var lintOutput = require('./lintOutput');

module.exports = function(from) {
    var files = glob.sync(from || '**/*.sql', {absolute: true, ignore: ['**/postgre*/**', 'node_modules/**']});
    var errors = [];
    var result = false;
    files.forEach(function(file) {
        var source = fs.readFileSync(file).toString();
        try {
            var parsed = parse.parse(source);
            if (parsed.lint.length) {
                var messages = [];
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
                    messages: messages,
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

    lintOutput('lint-sql.xml', errors);

    return result;
};
