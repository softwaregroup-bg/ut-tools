/* eslint no-console:0 */
const path = require('path');

const helpers = require('./helpers');

module.exports = async (args) => {
    if (await helpers.isUt5Directory() === false) {
        console.log(helpers.error({msg: `Couldn't find directory dev or node_modules in ${helpers.currentDir}`}));
        return;
    }
    (await helpers.devModules())
        .map(async (folder) => {
            var fullpath = path.resolve(helpers.nodeModules, folder);
            if (!(await helpers.exists(fullpath))) {
                console.log(helpers.skip({msg: `Directory ${fullpath} is already deleted!`}));
                return;
            }
            helpers.execute('rm', ['-rf', fullpath])
                .then(data => console.log(helpers.ok({msg: `Directory ${fullpath} deleted successfully!`})))
                .catch(e => console.log(helpers.error({msg: `Error deleting ${fullpath}: ${e}`})));
        });
};
