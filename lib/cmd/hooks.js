/* eslint no-console:0 */
const path = require('path');

const helpers = require('./helpers');

module.exports = async (args) => {
    if (await helpers.isUt5Directory() === false) {
        console.log(helpers.error({msg: `Couldn't find directory dev or node_modules in ${helpers.currentDir}`}));
        return;
    }
    (await helpers.devModules()).concat('implementation')
        .map(async (folder) => {
            let fullpath;
            if (folder === 'implementation') {
                folder = require(path.resolve(helpers.currentDir, 'package.json')).name;
                fullpath = helpers.currentDir;
            } else fullpath = path.resolve(helpers.devFolder, folder);
            let preCommit = path.resolve(fullpath, '.git', 'hooks', 'pre-commit');
            if ((await helpers.exists(preCommit))) {
                console.log(helpers.skip({
                    icon: '🐟  ',
                    msg: `pre-commit hook for [${helpers.Bold}${folder}${helpers.Reset}] already exists!`
                }));
                return;
            }

            let hook = `#!/bin/sh
NODE_PATH=${helpers.devFolder} npm run lint`;
            if (!(await helpers.writeFile(preCommit, hook))) {
                console.log(helpers.error({msg: `Error creating hook for [${helpers.Bold}${folder}${helpers.Reset}] ⚓️`}));
                return;
            }
            if (process.platform !== 'win32') {
                helpers.execute('chmod', ['+x', preCommit])
                    .catch(e => console.log(helpers.error({msg: `Hook is created, but the file is not executable
${e}`})));
            }
            console.log(helpers.ok({
                icon: '🎣  ',
                status: 'SUCCESS',
                msg: `pre-commit hook created for [${helpers.Bold}${folder}${helpers.Reset}]`
            }));
        });
};
