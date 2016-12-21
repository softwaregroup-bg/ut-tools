/* eslint no-process-env:0, no-process-exit:0 */
var path = require('path');

module.exports = function() {
    var args = [];

    var pkg = require(path.join(process.cwd(), 'package.json'));

    args.push('-c');
    if (pkg.name.startsWith('@leveloneproject/')) {
        args.push(require.resolve('../eslint/l1pcommit.eslintrc'));
    } else {
        args.push(require.resolve('../eslint/commit.eslintrc'));
    }
    args.push('--ignore-pattern');
    args.push('coverage/**');
    args.push('--ignore-pattern');
    args.push('**/*.marko.js');
    args.push('--ignore-pattern');
    args.push('**/node_modules/**');
    args.push('--ignore-pattern');
    args.push('public/**');
    args.push('--ignore-pattern');
    args.push('dist/**');

    if (typeof process.env.BUILD_NUMBER !== 'undefined') {
        args.push('-f');
        args.push('checkstyle');
        args.push('-o');
        args.push('lint.xml');
    }

    var CLIEngine = require('eslint').CLIEngine;
    CLIEngine.prototype.addPlugin('ut-lint', require('./rules'));

    var workingPath = process.env.PWD || process.argv.slice(2);
    return cli.execute(Array.prototype.concat(process.argv.slice(0, 2), args, workingPath));
};
