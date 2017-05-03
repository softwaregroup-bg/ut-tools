/* eslint no-console:0, no-process-exit:0, no-process-env:0 */
var latestVersion = require('latest-version');
var semver = require('semver');

module.exports = function() {
    var pkg = require('../package.json');

    if (pkg.publishConfig && pkg.publishConfig.registry) {
        process.env['npm_registry'] = pkg.publishConfig.registry;
    }

    latestVersion(pkg.name).then(function(version) {
        if ((semver.major(pkg.version) === semver.major(version)) && semver.lt(pkg.version, version)) {
            console.error('Please update to ' + pkg.name + '@' + version);
            process.exit(1);
        } else {
            console.log(pkg.name, pkg.version, 'linting...');
            var error = require('./lintJS')();
            // error = require('./lintCSS')() || error;
            error = require('./lintPkg')() || error;
            if (error) {
                process.exit(1);
            }
        }
        return false;
    }).catch(function(err) {
        console.error(err);
        process.exit(1);
    });
};
