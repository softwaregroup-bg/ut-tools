/* eslint no-console:0 */
module.exports = function() {
    const meow = require('meow');

    const ut5 = meow(`
        Usage
        $ ut5 <clone|lint|lintJS>

        Examples
        $ ut5 clone [impl]  [--anonymous]
        $ ut5 lint
        $ ut5 lintJS
    `, {
        alias: {
            h: 'help'
        }
    });

    var index = require('./index.js');
    if (ut5.input[0] && typeof index[ut5.input[0]] === 'function') {
        index[ut5.input[0]]();
    } else {
        ut5.showHelp();
    }
};
