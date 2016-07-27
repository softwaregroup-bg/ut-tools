var execute = require('./exec');

module.exports = function() {
    var configPath = require.resolve('../stylelint');
    var filesToLint = process.cwd() + '/**/*.css';
    execute(require('./stylelintPath'), [filesToLint, '--config', configPath]);
};
