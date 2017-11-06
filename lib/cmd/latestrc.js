/* eslint no-console:0 */
const path = require('path');
const helpers = require('./helpers');

module.exports = (args) => {
    helpers.isUt5Directory().then(isUt5Directory => {
        const packageJson = require(path.resolve(helpers.currentDir, './package.json'));
        const allDependencies = Object.assign(packageJson.dependencies, packageJson.devDependencies);
        const promises = [];
        Object.keys(allDependencies).map(dependency => {
            if (dependency.includes('ut-')) {
                promises.push(helpers.getLatestCIVersion(dependency));
            };
        }, []);
        const text = [];
        const updatePackageJson = (key, module) => {
            if (module.name in packageJson[key]) {
                module.current = packageJson[key][module.name];
                if (module.latest === module.current) return;
                packageJson[key][module.name] = packageJson[key][module.name].replace(module.current, module.latest);
                text.push(`👆  ${helpers.Bold}${module.name}${helpers.Reset} updated from ${module.current} to ${helpers.FgGreen}${module.latest}${helpers.Reset} in dependencies`);
            }
        };

        return Promise.all(promises).then(result => {
            result = result.filter(res => res.latest && res.latest.includes('-rc'));
            result.map(ut5Module => {
                updatePackageJson('dependencies', ut5Module);
                updatePackageJson('devDependencies', ut5Module);
            });
            return helpers.writeFile(path.resolve(helpers.currentDir, 'package.json'), JSON.stringify(packageJson, null, 2) + '\n').then(ok => {
                console.log(helpers.ok({msg: `All versions are up to date!\n${text.join('\n')}`}));
                return text;
            }).catch(e => {
                console.log(helpers.error({msg: `Error writing into package.json`}));
            });
        }).catch(e => {
            console.log(helpers.error({msg: `Error getting latest rc version in ${helpers.fullpath}: ${e}`}));
        });
    }).catch(err => {
        console.log(helpers.error({msg: `Couldn't find directory dev or node_modules in ${helpers.currentDir} ${err}`}));
        return err;
    });
};
