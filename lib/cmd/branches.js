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
            helpers.execute('git', ['-C', fullpath, 'branch'])
                .then(data => {
                    let branches = data.split("\n"); /* eslint quotes:0 */
                    branches.forEach((branch) => {
                        if (branch.substr(0, 1) === '*') {
                            branch = branch.substr(2, branch.length);
                            console.log(helpers.ok({
                                icon: '🌲  ',
                                msg: `${helpers.Bold}${folder}${helpers.Reset} is on branch [${helpers.Bold}${branch}${helpers.Reset}]`
                            }));
                        }
                    });
                    return data;
                })
                .catch(e => console.log(helpers.error({msg: `Error getting information about ${fullpath}: ${e}`})));
        });
};
