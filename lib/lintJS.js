/* eslint no-process-env:0, no-process-exit:0 */
module.exports = function() {
    var args = [];
    args.push('-c');
    args.push(require.resolve('../eslint/commit.eslintrc'));
    args.push('--ignore-pattern');
    args.push('**/coverage/**');
    args.push('--ignore-pattern');
    args.push('**/*.marko.js');
    args.push('--ignore-pattern');
    args.push('**/node_modules/**');

    if (typeof process.env.BUILD_NUMBER !== 'undefined') {
        args.push('-f');
        args.push('checkstyle');
        args.push('-o');
        args.push('lint.xml');
    }

    var CLIEngine = require('eslint').CLIEngine;
    CLIEngine.prototype.addPlugin('ut-lint', require('./rules'));

    var cli = require('eslint/lib/cli');
    return cli.execute(Array.prototype.concat(process.argv.slice(0, 2), args, process.argv.slice(2)));
};
