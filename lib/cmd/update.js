/* eslint no-console:0 */
const path = require('path');

const helpers = require('./helpers');

module.exports = async (args) => {
    if (await helpers.isUt5Directory() === false) {
        console.log(helpers.error({msg: `Couldn't find directory dev or node_modules in ${helpers.currentDir}`}));
        return;
    }
    (await helpers.devModules()).concat('implementation')
        .map((folder) => {
            let fullpath;
            if (folder === 'implementation') {
                folder = require(path.resolve(helpers.currentDir, 'package.json')).name;
                fullpath = helpers.currentDir;
            } else fullpath = path.resolve(helpers.devFolder, folder);

            helpers.execute('git', ['-C', fullpath, 'pull'])
                .then(data => {
                    if (data.indexOf('Already up-to-date.') > -1) {
                        console.log(helpers.ok({
                            msg: `${helpers.Bold}${folder}${helpers.Reset} is already up to date!`
                        }));
                    }
                    return data;
                })
                .catch(e => {
                    if (e.indexOf('There is no tracking information for the current branch.') > -1) {
                        console.log(helpers.error({msg: `Updating ${helpers.Bold}${folder}${helpers.Reset} ended with errors!
${e}`}));
                    } else {
                        console.log(helpers.ok({
                            msg: `${helpers.Bold}${folder}${helpers.Reset} is updated
${e}`}));
                    }
                });
        });
};
