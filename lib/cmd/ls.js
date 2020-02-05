/* eslint no-console:0 */
const helpers = require('./helpers');
const exec = require('../exec');
const path = require('path');

function pad(s, l) {
    return (s + Array(l).join(' ')).substr(0, l);
}

module.exports = (args) => {
    return helpers.isUt5Directory()
        .catch(err => {
            console.log(helpers.error({msg: `Couldn't find directory dev or node_modules in ${helpers.currentDir}`}));
            return err;
        })
        .then(isUt5Directory => helpers.devModules().then(modules => {
            modules.forEach(modulePath => {
                const options = {cwd: modulePath, stdio: 'pipe'};
                const branch = exec('git', ['rev-parse', '--abbrev-ref', 'HEAD'], options, false);
                const version = exec('git', ['describe', '--always'], options, false);
                const up = branch && exec('git', ['rev-list', '--left-only', '--count', `${branch}...origin/${branch}`], options, false);
                const dn = branch && exec('git', ['rev-list', '--right-only', '--count', `${branch}...origin/${branch}`], options, false);
                // let stat = exec('git', ['diff-files', '--shortstat'], options, false);
                // let staged = exec('git', ['diff', '--shortstat', '--cached'], options, false);
                const changed = exec('git', ['status', '-u', '-z'], options, false, false).split('\0').length - 1;
                let output = `\r\x1b[K\x1b[0m${pad(path.relative('.', modulePath), 40)}`;
                output += `\x1b[1;33m${pad(changed ? '*' + changed : ' ', 5)}`;
                output += dn === '0' ? `\x1b[0;37m▼${pad(dn, 5)} ` : `\x1b[1;32m▼${pad(dn, 5)} `;
                output += up === '0' ? `\x1b[0;37m▲${pad(up, 5)} ` : `\x1b[1;31m▲${pad(up, 5)} `;
                output += ` \x1b[1;34m${pad(branch, 25)} `;
                output += ` \x1b[1;34m${pad(version, 30)} `;
                // output += stat ? `\x1b[1;31m${stat}` : '';
                // output += staged ? `\x1b[0;33m + staged:${staged}` : '';
                output += '\x1b[0m\n';
                process.stdout.write(output);
            });
            return true;
        }));
};
