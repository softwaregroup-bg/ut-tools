/* eslint no-console:0, no-process-exit:0, no-process-env:0 */
const packageJson = require('package-json');
var semver = require('semver');

module.exports = function() {
    var pkg = require('../package.json');

    if (pkg.publishConfig && pkg.publishConfig.registry) {
        process.env.npm_registry = pkg.publishConfig.registry;
    }
    var version = semver.prerelease(pkg.version);
    version = (version && version[0]) || ('' + semver.major(pkg.version));
    packageJson(pkg.name, {version})
        .then(data => data.version)
        .then(async function(version) {
            if (semver.lt(pkg.version, version)) {
                console.error('Please update to ' + pkg.name + '@' + version);
                return process.exit(1);
            } else {
                console.log(pkg.name, pkg.version, 'linting...');
                var error;
                error = await require('./lintJS')() || error;
                // error = require('./lintCSS')() || error;
                error = require('./lintSQL')() || error;
                error = require('./lintMd')() || error;
                error = await require('./lintPkg')() || error;
                if (error) {
                    return process.exit(1);
                }
            }
            return false;
        })
        .catch(function(err) {
            console.error(err);
            process.exit(1);
        });
};
