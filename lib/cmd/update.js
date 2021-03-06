/* eslint no-console:0 */
const path = require('path');

const helpers = require('./helpers');

module.exports = (args) => {
    helpers.isUt5Directory().then(isUt5Directory => {
        return helpers.devModules().then(modules => modules.concat('implementation')
            .map(folder => {
                let fullpath = folder;
                if (folder === 'implementation') {
                    folder = require(path.resolve(helpers.currentDir, 'package.json')).name;
                    fullpath = helpers.currentDir;
                } else {
                    folder = path.relative(helpers.currentDir, folder);
                };
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
                            console.log(helpers.error({
                                msg: `Updating ${helpers.Bold}${folder}${helpers.Reset} ended with errors!
${e}`
                            }));
                        } else {
                            console.log(helpers.ok({
                                msg: `${helpers.Bold}${folder}${helpers.Reset} is updated
${e}`
                            }));
                        }
                    });
            })
        );
    }).catch(err => {
        console.log(helpers.error({msg: `Couldn't find directory dev or node_modules in ${helpers.currentDir}`}));
        return err;
    });
};
