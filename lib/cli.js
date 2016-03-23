module.exports = function() {
    const meow = require('meow');

    const ut5 = meow(`
        Usage
        $ ut5 <clone|lint|lintJS|post-release|pre-release|release>

        Examples
        $ ut5 clone [impl]  [--anonymous]
        $ ut5 lint
        $ ut5 lintJS
    `, {
        alias: {
            h: 'help'
        }
    });

    if (ut5.input[0]) {
        try {
            var index = require('./index.js');
            index[ut5.input[0]]();
        } catch (e) {
            if (e.message.indexOf('Cannot find module') > -1 && e.message.indexOf(ut5.input[0]) > -1) {
                ut5.showHelp();
            } else {
                console.error(e.stack);
            }
        }
    } else {
        ut5.showHelp();
    }
};
