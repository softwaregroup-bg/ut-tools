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
            helpers.execute('git', ['-C', fullpath, 'status'])
                .then(data => {
                    if (data.indexOf('nothing to commit, working tree clean') > -1) {
                        console.log(helpers.ok({
                            icon: '🍺  ',
                            status: 'UP TO DATE',
                            msg: `${helpers.Bold}${folder}${helpers.Reset} is up to date with origin! ${data.split("\n")[0]}` /* eslint quotes:0 */
                        }));
                    } else {
                        console.log(helpers.warn({
                            msg: `${helpers.Bold}${folder}${helpers.Reset} is not synchronized with origin
${data}`
                        }));
                    }
                    return data;
                })
                .catch(e => console.log(helpers.error({msg: `Updating ${helpers.Bold}${folder}${helpers.Reset} ended with errors!: ${e}`})));
        });
};
