/* eslint no-process-env:0 */
const cli = require('eslint/lib/cli');
const path = require('path');

module.exports = function() {
    let options = [
        '--config', require.resolve('../eslint/commit.eslintrc'),
        '--ignore-pattern', '**/.git/**',
        '--ignore-pattern', '**/.history/**',
        '--ignore-pattern', 'coverage/**',
        '--ignore-pattern', 'tap-snapshots/**',
        '--ignore-pattern', '**/*.marko.js',
        '--ignore-pattern', '**/node_modules/**',
        '--ignore-pattern', 'public/**',
        '--ignore-pattern', 'dist/**',
        '--ignore-pattern', 'help/**',
        '--rulesdir', path.join(__dirname, 'rules')
    ];
    if (typeof process.env.BUILD_NUMBER !== 'undefined') {
        options = options.concat([
            '--output-file', './.lint/lint.xml',
            '--format', require.resolve('./checkStyleRelative')
        ]);
    }
    return cli.execute(process.argv.concat(options));
};
