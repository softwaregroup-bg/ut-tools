/* eslint no-console:0 */
const path = require('path');

const helpers = require('./helpers');

module.exports = async (args) => {
    helpers.isUt5Directory().then(isUt5Directory => {
        return helpers.devModules().then(modules => modules.concat('implementation')
            .map(folder => {
                let fullpath;
                if (folder === 'implementation') {
                    folder = require(path.resolve(helpers.currentDir, 'package.json')).name;
                    fullpath = helpers.currentDir;
                } else fullpath = path.resolve(helpers.devFolder, folder);
                let preCommit = path.resolve(fullpath, '.git', 'hooks', 'pre-commit');
                helpers.exists(preCommit).then(exists => {
                    console.log(helpers.skip({
                        icon: '🐟  ',
                        msg: `pre-commit hook for [${helpers.Bold}${folder}${helpers.Reset}] already exists!`
                    }));
                    return exists;
                }).catch(e => {
                    let hook = `#!/bin/sh
NODE_PATH=${helpers.devFolder} npm run lint`;
                    helpers.writeFile(preCommit, hook).then(written => {
                        var ok = () => console.log(helpers.ok({
                            icon: '🎣  ',
                            status: 'SUCCESS',
                            msg: `pre-commit hook created for [${helpers.Bold}${folder}${helpers.Reset}]`
                        }));
                        if (process.platform !== 'win32') {
                            return helpers.execute('chmod', ['+x', preCommit]).then(ok())
                                .catch(e => console.log(helpers.error({msg: `Hook is created, but the file is not executable
${e}`})));
                        } else ok();
                    }).catch(e => {
                        console.log(helpers.error({msg: `Error creating hook for [${helpers.Bold}${folder}${helpers.Reset}] ⚓️`}));
                        return e;
                    });
                });
            })
        );
    }).catch(err => {
        console.log(helpers.error({msg: `Couldn't find directory dev or node_modules in ${helpers.currentDir}`}));
        return err;
    });
};
