var exec = require('../lib/exec');

module.exports = function() {
    exec('npm run lint --silent');
};
