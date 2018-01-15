/* eslint no-console:0, no-process-env:0 */
var glob = require('glob');
var fs = require('fs');
var parse = require('ut-tsql-lexer');

module.exports = function(from) {
    var files = glob.sync(from || '**/*.sql', {absolute: true, ignore: ['**/postgre*/**', 'node_modules/**']});
    var result = [];
    var log = process.env.BUILD_NUMBER == null;
    files.forEach(function(file) {
        var source = fs.readFileSync(file).toString();
        try {
            var parsed = parse.parse(source);
            if (parsed.lint.length) {
                log && console.log(file);
                var messages = [];
                parsed.lint.forEach(function(item) {
                    if (log) {
                        console.log(`  ${item.line}:${item.column}  warning  ${item.message}  ${item.code}`);
                    } else {
                        messages.push({
                            line: item.endLine,
                            column: item.endColumn,
                            message: item.message,
                            ruleId: item.code
                        });
                    }
                });
                result.push({
                    filePath: file,
                    messages: messages
                });
            }
        } catch (e) {
            if (log) {
                console.error(file);
                console.error(`  ${e.location.start.line}:${e.location.start.column}  error  ${e.message}`);
            } else {
                result.push({
                    filePath: file,
                    messages: [{
                        line: e.location.start.line,
                        column: e.location.start.column,
                        message: e.message
                    }]
                });
            }
        }
    });
    if (!log) {
        var checkstyle = require('eslint/lib/formatters/checkstyle');
        fs.writeFileSync('lint-sql.xml', checkstyle(result));
    }
    return !result.length;
};
