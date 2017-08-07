/* eslint no-console:0 */
const path = require('path');

const helpers = require('./helpers');

module.exports = (args) => {
    helpers.isUt5Directory().then(isUt5Directory => {
        var command = 'npm';
        if (process.platform === 'win32') {
            command = 'npm.cmd';
        }
        return helpers.execute(command, ['outdated'])
            .then(e => {
                let toUpdate = [];
                e.split('\n').map(module => {
                    if (module.indexOf('ut-') === 0) {
                        let versions = module.split(/\s+/);
                        let current = versions[2].split(/\./g);
                        let latest = versions[3].split(/\./g);
                        let needUpdate = (parseInt(current[0]) < parseInt(latest[0]) ||
                            (parseInt(current[0]) === parseInt(latest[0]) && parseInt(current[1]) < parseInt(latest[1])) ||
                            ((parseInt(current[0]) === parseInt(latest[0]) && parseInt(current[1]) === parseInt(latest[1])) && parseInt(current[2]) < parseInt(latest[2])));
                        if (needUpdate) {
                            toUpdate.push({
                                'name': versions[0],
                                'current': versions[2],
                                'latest': versions[3]
                            });
                        }
                    }
                });
                let packageJson = require(path.resolve(helpers.currentDir, 'package.json'));
                let text = [];
                toUpdate.map(module => {
                    if (module.name in packageJson.dependencies) {
                        packageJson.dependencies[module.name] = packageJson.dependencies[module.name].replace(module.current, module.latest);
                        text.push(`👆  ${helpers.Bold}${module.name}${helpers.Reset} updated from ${module.current} to ${helpers.FgGreen}${module.latest}${helpers.Reset} in dependencies`);
                    }
                    if (module.name in packageJson.devDependencies) {
                        packageJson.devDependencies[module.name] = packageJson.devDependencies[module.name].replace(module.current, module.latest);
                        text.push(`👆  ${helpers.Bold}${module.name}${helpers.Reset} updated from ${module.current} to ${helpers.FgGreen}${module.latest}${helpers.Reset} in devDependencies`);
                    }
                });
                helpers.writeFile(path.resolve(helpers.currentDir, 'package.json'), JSON.stringify(packageJson, null, 2) + '\n').then(ok => {
                    console.log(helpers.ok({msg: `All versions are up to date!
${text.join('\n')}`}));
                }).catch(e => {
                    console.log(helpers.error({msg: `Error executing npm outdated in ${helpers.fullpath}: ${e}`}));
                });
            })
            .catch(e => {
                console.log(helpers.error({msg: `Error executing npm outdated in ${helpers.fullpath}: ${e}`}));
            });
    }).catch(err => {
        console.log(helpers.error({msg: `Couldn't find directory dev or node_modules in ${helpers.currentDir} ${err}`}));
        return err;
    });
};
