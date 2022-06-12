const execute = require('./exec');

module.exports = function() {
    const configPath = require.resolve('../stylelint');
    const filesToLint = process.cwd() + '/**/*.css';
    execute(require('./stylelintPath'), [filesToLint, '--config', configPath]);
};
