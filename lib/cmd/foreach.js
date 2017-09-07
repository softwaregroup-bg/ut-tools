/* eslint no-console:0 */
const helpers = require('./helpers');
const exec = require('../exec');

module.exports = (args) => {
    let cmd = args.shift();
    helpers.isUt5Directory().then(isUt5Directory => helpers.devModules().then(modules => {
        modules.forEach(path => {
            process.stdout.write(`\r\x1b[K\x1b[1;34m${path} \x1b[;0m`);
            if (cmd) {
                exec(cmd, args, {cwd: path}, false);
            } else {
                process.stdout.write(`\n`);
            }
        });
        return true;
    })).catch(err => {
        console.log(helpers.error({msg: `Couldn't find directory dev or node_modules in ${helpers.currentDir}`}));
        return err;
    });
};
