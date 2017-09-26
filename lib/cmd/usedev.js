/* eslint no-console:0 */
const helpers = require('./helpers');

module.exports = (args) => {
    helpers.isUt5Directory().then(isUt5Directory => {
        return helpers.devModules().then(modules => modules
            .map(fullpath => {
                helpers.exists(fullpath).then(exists => {
                    return helpers.execute('rm', ['-rf', fullpath])
                        .then(data => console.log(helpers.ok({msg: `Directory ${fullpath} deleted successfully!`})))
                        .catch(e => console.log(helpers.error({msg: `Error deleting ${fullpath}: ${e}`})));
                }).catch(e => {
                    console.log(helpers.skip({msg: `Directory ${fullpath} is already deleted!`}));
                    return e;
                });
            })
        );
    }).catch(err => {
        console.log(helpers.error({msg: `Couldn't find directory dev or node_modules in ${helpers.currentDir}`}));
        return err;
    });
};
